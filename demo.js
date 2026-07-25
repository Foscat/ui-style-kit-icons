import {
  getPack,
  packRegistry,
  packs,
  resolveIconUrl
} from "./dist/ui-style-kit-icons.js";

const defaults = {
  pack: "minimal-saas",
  theme: "arctic-indigo",
  mode: "dark",
  frame: "auto",
  size: 76,
  extras: false,
  q: ""
};
const allowedThemes = new Set([
  "midnight-gold",
  "ocean-steel",
  "forest-moss",
  "sunset-ember",
  "royal-plum",
  "graphite-cyan",
  "desert-sage",
  "rose-quartz",
  "cyber-lime",
  "arctic-indigo"
]);
const allowedModes = new Set(["light", "dark", "contrast"]);
const allowedFrames = new Set(["auto", "none"]);
const storageKey = "ui-style-kit-icons:demo-state";
const query = new URLSearchParams(window.location.search);
const stored = readStoredState();
const storedPack = packRegistry[stored.pack] ? stored.pack : defaults.pack;
const storedTheme = allowedThemes.has(stored.theme) ? stored.theme : defaults.theme;
const storedMode = allowedModes.has(stored.mode) ? stored.mode : defaults.mode;
const storedFrame = allowedFrames.has(stored.frame) ? stored.frame : defaults.frame;
const state = {
  pack: packRegistry[query.get("pack")] ? query.get("pack") : storedPack,
  theme: allowedThemes.has(query.get("theme")) ? query.get("theme") : storedTheme,
  mode: allowedModes.has(query.get("mode")) ? query.get("mode") : storedMode,
  frame: allowedFrames.has(query.get("frame")) ? query.get("frame") : storedFrame,
  size: clampNumber(query.get("size") ?? stored.size, 48, 104, defaults.size),
  extras: query.get("extras") === "1" || (query.get("extras") === null && stored.extras === true),
  q: query.get("q") ?? ""
};

const elements = {
  body: document.body,
  packSelect: requiredElement("#packSelect", HTMLSelectElement),
  themeSelect: requiredElement("#themeSelect", HTMLSelectElement),
  modeButtons: [...document.querySelectorAll("[data-mode-value]")],
  frameButtons: [...document.querySelectorAll("[data-frame-value]")],
  sizeRange: requiredElement("#sizeRange", HTMLInputElement),
  sizeOutput: requiredElement("#sizeOutput", HTMLOutputElement),
  extrasToggle: requiredElement("#extrasToggle", HTMLInputElement),
  extrasCount: requiredElement("#extrasCount", HTMLElement),
  packName: requiredElement("#packName", HTMLElement),
  packDescription: requiredElement("#packDescription", HTMLElement),
  packExtraStat: requiredElement("#packExtraStat", HTMLElement),
  packSourceLink: requiredElement("#packSourceLink", HTMLAnchorElement),
  search: requiredElement("#iconSearch", HTMLInputElement),
  grid: requiredElement("#iconGrid", HTMLElement),
  resultCount: requiredElement("#resultCount", HTMLOutputElement),
  emptyState: requiredElement("#emptyState", HTMLElement),
  clearSearchButton: requiredElement("#clearSearchButton", HTMLButtonElement),
  resetButton: requiredElement("#resetButton", HTMLButtonElement),
  dialog: requiredElement("#iconDialog", HTMLDialogElement),
  dialogIcon: requiredElement("#dialogIcon", HTMLElement),
  dialogPack: requiredElement("#dialogPack", HTMLElement),
  dialogType: requiredElement("#dialogType", HTMLElement),
  dialogTitle: requiredElement("#dialogTitle", HTMLElement),
  dialogId: requiredElement("#dialogId", HTMLElement),
  dialogMeaning: requiredElement("#dialogMeaning", HTMLElement),
  componentSnippet: requiredElement("#componentSnippet", HTMLElement),
  spriteSnippet: requiredElement("#spriteSnippet", HTMLElement),
  downloadIconLink: requiredElement("#downloadIconLink", HTMLAnchorElement),
  copyLinkButton: requiredElement("#copyLinkButton", HTMLButtonElement),
  toast: requiredElement("#toast", HTMLElement)
};

let activeIconId = query.get("icon");
let toastTimer;

assertDemoControls();
populatePackSelect();
bindEvents();
syncControls();
applyState({ updateUrl: false });

if (activeIconId) {
  const icon = currentIcons().find(({ id }) => id === activeIconId);

  if (icon) {
    openIconDialog(icon);
  }
}

function readStoredState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) ?? {};
  } catch {
    return {};
  }
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function requiredElement(selector, ElementClass) {
  const element = document.querySelector(selector);

  if (!(element instanceof ElementClass)) {
    throw new Error(`UI Style Kit Icons demo is missing ${selector}.`);
  }

  return element;
}

function assertDemoControls() {
  if (elements.modeButtons.length !== allowedModes.size) {
    throw new Error("UI Style Kit Icons demo mode controls are incomplete.");
  }

  if (elements.frameButtons.length !== allowedFrames.size) {
    throw new Error("UI Style Kit Icons demo frame controls are incomplete.");
  }

  const unsupportedModes = elements.modeButtons.filter(
    (button) => !allowedModes.has(button.dataset.modeValue)
  );
  const unsupportedFrames = elements.frameButtons.filter(
    (button) => !allowedFrames.has(button.dataset.frameValue)
  );

  if (unsupportedModes.length > 0) {
    throw new Error("UI Style Kit Icons demo contains an unsupported mode control.");
  }

  if (unsupportedFrames.length > 0) {
    throw new Error("UI Style Kit Icons demo contains an unsupported frame control.");
  }
}

function populatePackSelect() {
  const fragment = document.createDocumentFragment();

  for (const pack of packs) {
    const option = document.createElement("option");
    option.value = pack.id;
    option.textContent = `${pack.label} - ${pack.iconCount}`;
    fragment.append(option);
  }

  elements.packSelect.replaceChildren(fragment);
}

function bindEvents() {
  elements.packSelect.addEventListener("change", () => {
    state.pack = elements.packSelect.value;
    state.extras = false;
    activeIconId = null;
    applyState();
  });
  elements.themeSelect.addEventListener("change", () => {
    state.theme = elements.themeSelect.value;
    applyState();
  });
  elements.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.modeValue;
      applyState();
    });
  });
  elements.frameButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.frame = button.dataset.frameValue;
      applyState();
    });
  });
  elements.sizeRange.addEventListener("input", () => {
    state.size = clampNumber(elements.sizeRange.value, 48, 104, defaults.size);
    applyState();
  });
  elements.extrasToggle.addEventListener("change", () => {
    state.extras = elements.extrasToggle.checked;
    applyState();
  });
  elements.search.addEventListener("input", () => {
    state.q = elements.search.value;
    activeIconId = null;
    applyState();
  });
  elements.grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-icon-id]");

    if (!card) {
      return;
    }

    const icon = currentIcons().find(({ id }) => id === card.dataset.iconId);

    if (icon) {
      openIconDialog(icon);
    }
  });
  elements.clearSearchButton.addEventListener("click", () => {
    state.q = "";
    applyState();
    elements.search.focus();
  });
  elements.resetButton.addEventListener("click", () => {
    Object.assign(state, defaults);
    activeIconId = null;
    applyState();
  });
  elements.dialog.addEventListener("close", () => {
    activeIconId = null;
    updateUrl();
  });
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) {
      elements.dialog.close();
    }
  });
  document.addEventListener("click", (event) => {
    const copyTarget = event.target.closest("[data-copy-target]");
    const copyText = event.target.closest("[data-copy-text]");

    if (copyTarget) {
      copy(document.querySelector(`#${copyTarget.dataset.copyTarget}`).textContent);
    } else if (copyText) {
      copy(copyText.dataset.copyText);
    }
  });
  elements.copyLinkButton.addEventListener("click", () => copy(window.location.href));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "/" &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)
    ) {
      event.preventDefault();
      elements.search.focus();
      elements.search.select();
    }
  });
  window.addEventListener("popstate", () => window.location.reload());
}

function syncControls() {
  elements.packSelect.value = state.pack;
  elements.themeSelect.value = state.theme;
  elements.sizeRange.value = state.size;
  elements.sizeOutput.value = `${state.size}px`;
  elements.sizeOutput.textContent = `${state.size}px`;
  elements.extrasToggle.checked = state.extras;
  elements.search.value = state.q;
  elements.modeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.modeValue === state.mode));
  });
  elements.frameButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.frameValue === state.frame));
  });
}

function currentPack() {
  return getPack(state.pack);
}

function currentIcons() {
  const pack = currentPack();
  return [
    ...pack.coreIcons.map((icon) => ({ ...icon, optional: false })),
    ...(state.extras
      ? pack.optionalIcons.map((icon) => ({ ...icon, optional: true }))
      : [])
  ];
}

function applyState({ updateUrl: shouldUpdateUrl = true } = {}) {
  const pack = currentPack();
  const root = document.documentElement;
  const normalizedQuery = state.q.trim().toLowerCase();

  elements.body.dataset.iconPack = pack.id;
  elements.body.dataset.ui = pack.uiStyle;
  elements.body.dataset.theme = state.theme;
  elements.body.dataset.mode = state.mode;
  elements.body.dataset.iconFrame = state.frame;
  elements.body.dataset.lyLayout = pack.layoutStyle;
  root.style.setProperty("--demo-icon-size", `${state.size}px`);
  elements.packName.textContent = pack.label;
  elements.packDescription.textContent = pack.description;
  elements.packExtraStat.textContent = String(pack.optionalIconCount);
  elements.extrasCount.textContent = String(pack.optionalIconCount);
  elements.extrasToggle.disabled = pack.optionalIconCount === 0;
  elements.extrasToggle.closest("label").toggleAttribute("data-disabled", pack.optionalIconCount === 0);
  elements.packSourceLink.href = `https://github.com/Foscat/ui-style-kit-icons/tree/main/${pack.sourcePath}`;

  if (pack.optionalIconCount === 0) {
    state.extras = false;
    elements.extrasToggle.checked = false;
  }

  const visibleIcons = currentIcons().filter((icon) => {
    if (!normalizedQuery) {
      return true;
    }

    return [icon.id, icon.label, icon.meaning, ...pack.tags]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  renderGrid(visibleIcons);
  elements.resultCount.value = `${visibleIcons.length} icons`;
  elements.resultCount.textContent = `${visibleIcons.length} icon${visibleIcons.length === 1 ? "" : "s"}`;
  elements.emptyState.hidden = visibleIcons.length > 0;
  elements.grid.hidden = visibleIcons.length === 0;
  syncControls();

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        pack: state.pack,
        theme: state.theme,
        mode: state.mode,
        frame: state.frame,
        size: state.size,
        extras: state.extras
      })
    );
  } catch {
    // The demo remains fully functional when storage is unavailable.
  }

  if (shouldUpdateUrl) {
    updateUrl();
  }
}

function renderGrid(icons) {
  const fragment = document.createDocumentFragment();

  for (const icon of icons) {
    const card = document.createElement("button");
    const artwork = document.createElement("usk-icon");
    const label = document.createElement("strong");
    const id = document.createElement("code");

    card.type = "button";
    card.className = "icon-card";
    card.dataset.iconId = icon.id;
    card.setAttribute("aria-label", `Inspect ${icon.label}`);
    artwork.setAttribute("name", icon.id);
    artwork.setAttribute("pack", state.pack);
    artwork.setAttribute("aria-hidden", "true");
    applyIconFrame(artwork);
    label.textContent = icon.label;
    id.textContent = icon.id;
    card.append(artwork, label, id);

    if (icon.optional) {
      const badge = document.createElement("span");
      badge.className = "extra-badge";
      badge.textContent = "Extra";
      card.append(badge);
    }

    fragment.append(card);
  }

  elements.grid.replaceChildren(fragment);
}

function openIconDialog(icon) {
  const pack = currentPack();
  const isOptional = pack.optionalIcons.some(({ id }) => id === icon.id);
  const componentFrame = state.frame === "none" ? ' frame="none"' : "";
  const spriteFrame =
    state.frame === "none"
      ? ' style="--usk-icon-frame-opacity:0; --usk-icon-frame-decor-opacity:0"'
      : "";
  const componentMarkup = `<usk-icon name="${icon.id}" label="${icon.label}"${componentFrame}></usk-icon>`;
  const spriteMarkup = `<svg class="${pack.iconClass}" role="img" aria-label="${icon.label}"${spriteFrame}>\n  <use href="${pack.sprite}#${pack.spritePrefix}-${icon.id}"></use>\n</svg>`;

  activeIconId = icon.id;
  elements.dialogIcon.setAttribute("name", icon.id);
  elements.dialogIcon.setAttribute("pack", pack.id);
  elements.dialogIcon.setAttribute("label", icon.label);
  applyIconFrame(elements.dialogIcon);
  elements.dialogPack.textContent = pack.label;
  elements.dialogType.textContent = isOptional ? "Optional pack extension" : "Core semantic icon";
  elements.dialogTitle.textContent = icon.label;
  elements.dialogId.textContent = icon.id;
  elements.dialogMeaning.textContent = icon.meaning.endsWith(".") ? icon.meaning : `${icon.meaning}.`;
  elements.componentSnippet.textContent = componentMarkup;
  elements.spriteSnippet.textContent = spriteMarkup;
  elements.downloadIconLink.href = resolveIconUrl(icon.id, pack.id);
  elements.downloadIconLink.download = `${pack.id}-${icon.id}.svg`;
  updateUrl();

  if (!elements.dialog.open) {
    elements.dialog.showModal();
  }
}

function updateUrl() {
  const params = new URLSearchParams();

  if (state.pack !== defaults.pack) params.set("pack", state.pack);
  if (state.theme !== defaults.theme) params.set("theme", state.theme);
  if (state.mode !== defaults.mode) params.set("mode", state.mode);
  if (state.frame !== defaults.frame) params.set("frame", state.frame);
  if (state.size !== defaults.size) params.set("size", String(state.size));
  if (state.extras) params.set("extras", "1");
  if (state.q.trim()) params.set("q", state.q.trim());
  if (activeIconId) params.set("icon", activeIconId);

  const suffix = params.size ? `?${params}` : "";
  history.replaceState(null, "", `${window.location.pathname}${suffix}`);
}

function applyIconFrame(iconElement) {
  if (state.frame === "auto") {
    iconElement.removeAttribute("frame");
  } else {
    iconElement.setAttribute("frame", state.frame);
  }
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  showToast("Copied to clipboard");
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.dataset.visible = "true";
  toastTimer = setTimeout(() => {
    elements.toast.dataset.visible = "false";
  }, 1800);
}
