var MotionStyle = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // icons-collection-work/dependencies/package/src/index.js
  var index_exports = {};
  __export(index_exports, {
    animate: () => animate,
    cancel: () => cancel,
    enter: () => enter,
    exit: () => exit,
    presets: () => presets,
    replace: () => replace,
    stagger: () => stagger
  });
  var presets = Object.freeze([
    "form",
    "slide",
    "swirl",
    "slam",
    "origami",
    "portal",
    "curtain",
    "elastic",
    "cascade",
    "flip"
  ]);
  var directions = /* @__PURE__ */ new Set(["left", "right", "up", "down"]);
  var active = /* @__PURE__ */ new WeakMap();
  var replacements = /* @__PURE__ */ new WeakMap();
  var requests = /* @__PURE__ */ new WeakMap();
  function assertElement(element) {
    if (!element || !element.dataset || ![
      "addEventListener",
      "removeEventListener",
      "dispatchEvent",
      "getAttribute",
      "setAttribute",
      "removeAttribute"
    ].every((key) => typeof element[key] === "function") || ![
      "setProperty",
      "getPropertyValue",
      "getPropertyPriority",
      "removeProperty"
    ].every((key) => typeof element.style?.[key] === "function") || !["add", "remove", "contains"].every(
      (key) => typeof element.classList?.[key] === "function"
    )) {
      throw new TypeError("Expected a DOM element");
    }
  }
  function normalize(options = {}) {
    const preset = options.preset ?? "form";
    const phase = options.phase ?? "in";
    const direction = options.direction ?? "left";
    const duration = options.duration ?? 600;
    const delay = options.delay ?? 0;
    const easing = options.easing ?? "cubic-bezier(.2,.8,.2,1)";
    if (typeof easing !== "string" || !easing.trim())
      throw new TypeError("easing must be a non-empty CSS timing function");
    if (!presets.includes(preset))
      throw new RangeError(`Unknown motion preset: ${preset}`);
    if (phase !== "in" && phase !== "out")
      throw new RangeError(`Unknown phase: ${phase}`);
    if (!directions.has(direction))
      throw new RangeError(`Unknown direction: ${direction}`);
    if (!Number.isFinite(duration) || duration < 0 || duration > 6e4)
      throw new RangeError("duration must be 0\u201360000 ms");
    if (!Number.isFinite(delay) || delay < 0 || delay > 6e4)
      throw new RangeError("delay must be 0\u201360000 ms");
    return {
      preset,
      phase,
      direction,
      duration,
      delay,
      easing,
      respectReducedMotion: options.respectReducedMotion !== false
    };
  }
  function reduced(element) {
    const view = element.ownerDocument?.defaultView ?? (typeof window === "undefined" ? void 0 : window);
    return Boolean(
      view?.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    );
  }
  function animationName(config) {
    if (config.preset === "slam" && config.phase === "out") return "ms-boom-out";
    return `ms-${config.preset}-${config.phase}${config.preset === "curtain" ? `-${config.direction}` : ""}`;
  }
  function cancel(element) {
    assertElement(element);
    requests.set(element, {});
    return cancelCurrent(element);
  }
  function cancelCurrent(element) {
    const task = active.get(element);
    const replacement = replacements.get(element);
    if (replacement) {
      replacement.cancelled = true;
      replacements.delete(element);
    }
    if (task) task.finish("cancelled");
    return Boolean(task || replacement);
  }
  function claim(element) {
    const request = {};
    requests.set(element, request);
    cancelCurrent(element);
    return requests.get(element) === request;
  }
  function animate(element, options = {}) {
    assertElement(element);
    const config = normalize(options);
    if (!claim(element)) return Promise.resolve({ status: "cancelled" });
    return runMotion(element, config);
  }
  function runMotion(element, config) {
    if (config.respectReducedMotion && reduced(element) || config.duration === 0) {
      if (config.phase === "out") element.setAttribute("data-ms-exited", "true");
      else element.removeAttribute("data-ms-exited");
      return Promise.resolve({ status: "skipped" });
    }
    return new Promise((resolve) => {
      const owned = ["--ms-duration", "--ms-delay", "--ms-ease"];
      const originals = owned.map((k) => [
        k,
        element.style.getPropertyValue(k),
        element.style.getPropertyPriority(k)
      ]);
      const originalClass = element.classList.contains("ms-motion");
      const original = {
        preset: element.getAttribute("data-ms-preset"),
        phase: element.getAttribute("data-ms-phase"),
        direction: element.getAttribute("data-ms-direction")
      };
      let timeout;
      let settled = false;
      const cleanup = () => {
        clearTimeout(timeout);
        element.removeEventListener("animationend", onEnd);
        element.removeEventListener("animationcancel", onCancel);
        for (const [key, value, priority] of originals) {
          if (value) element.style.setProperty(key, value, priority);
          else element.style.removeProperty(key);
        }
        for (const [key, value] of Object.entries(original)) {
          if (value === null) element.removeAttribute(`data-ms-${key}`);
          else element.setAttribute(`data-ms-${key}`, value);
        }
        if (!originalClass) element.classList.remove("ms-motion");
      };
      const finish = (status) => {
        if (settled) return;
        settled = true;
        cleanup();
        if (status === "finished") {
          if (config.phase === "out")
            element.setAttribute("data-ms-exited", "true");
          else element.removeAttribute("data-ms-exited");
        }
        if (active.get(element)?.finish === finish) active.delete(element);
        const EventClass2 = element.ownerDocument?.defaultView?.CustomEvent ?? CustomEvent;
        element.dispatchEvent(
          new EventClass2("ms:finish", {
            detail: { status, preset: config.preset, phase: config.phase }
          })
        );
        resolve({ status });
      };
      const ownsEvent = (event) => event.target === element && !event.pseudoElement && event.animationName === animationName(config);
      const onEnd = (event) => {
        if (ownsEvent(event)) finish("finished");
      };
      const onCancel = (event) => {
        if (ownsEvent(event)) finish("cancelled");
      };
      active.set(element, { finish });
      if (config.phase === "in") element.removeAttribute("data-ms-exited");
      element.classList.add("ms-motion");
      element.style.setProperty("--ms-duration", `${config.duration}ms`);
      element.style.setProperty("--ms-delay", `${config.delay}ms`);
      element.style.setProperty("--ms-ease", config.easing);
      element.removeAttribute("data-ms-phase");
      void element.offsetWidth;
      element.dataset.msPreset = config.preset;
      element.dataset.msDirection = config.direction;
      element.dataset.msPhase = config.phase;
      element.addEventListener("animationend", onEnd);
      element.addEventListener("animationcancel", onCancel);
      timeout = setTimeout(
        () => finish("finished"),
        config.duration + config.delay + 120
      );
      const EventClass = element.ownerDocument?.defaultView?.CustomEvent ?? CustomEvent;
      element.dispatchEvent(
        new EventClass("ms:start", {
          detail: { preset: config.preset, phase: config.phase }
        })
      );
    });
  }
  function enter(element, options = {}) {
    return animate(element, { ...options, phase: "in" });
  }
  function exit(element, options = {}) {
    return animate(element, { ...options, phase: "out" });
  }
  function stagger(elements, options = {}) {
    const { interval = 85, ...rest } = options;
    if (!Number.isFinite(interval) || interval < 0 || interval > 6e4)
      throw new RangeError("interval must be 0\u201360000 ms");
    if (!elements || typeof elements[Symbol.iterator] !== "function")
      throw new TypeError("elements must be iterable");
    const nodes = Array.from(elements);
    if (new Set(nodes).size !== nodes.length)
      throw new TypeError("elements must be unique");
    const config = normalize(rest);
    const configs = nodes.map((element, index) => {
      assertElement(element);
      return normalize({ ...config, delay: config.delay + index * interval });
    });
    return Promise.all(
      nodes.map((element, index) => animate(element, configs[index]))
    );
  }
  async function replace(element, swap, options = {}) {
    if (typeof swap !== "function")
      throw new TypeError("swap must be a function");
    const { in: inPreset = "form", out: outPreset = "form", ...rest } = options;
    const outConfig = normalize({ ...rest, preset: outPreset, phase: "out" });
    const inConfig = normalize({ ...rest, preset: inPreset, phase: "in" });
    assertElement(element);
    if (!claim(element))
      return { out: { status: "cancelled" }, in: { status: "cancelled" } };
    const operation = { cancelled: false };
    const originalExited = element.getAttribute("data-ms-exited");
    replacements.set(element, operation);
    try {
      const out = await runMotion(element, outConfig);
      if (out.status === "cancelled" || operation.cancelled)
        return { out, in: { status: "cancelled" } };
      await swap();
      if (operation.cancelled) return { out, in: { status: "cancelled" } };
      const inside = await runMotion(element, inConfig);
      return { out, in: inside };
    } catch (error) {
      if (replacements.get(element) === operation) {
        if (originalExited === null) element.removeAttribute("data-ms-exited");
        else element.setAttribute("data-ms-exited", originalExited);
      }
      throw error;
    } finally {
      if (replacements.get(element) === operation) replacements.delete(element);
    }
  }
  return __toCommonJS(index_exports);
})();
