import {
  aliases,
  contractVersion,
  coreIconIds,
  packageName,
  packageVersion,
  packCount,
  packs,
  packRegistry,
  requiredIconCount,
  styleAliases,
  uiStyleKitCssCompatibility
} from "./registry.js";

const svgCache = new Map();
const liveIcons = new Set();
const moduleBaseUrl = new URL("../", import.meta.url);
const iconTokenPrefixes = [
  "usk",
  "saas",
  "bento",
  "max",
  "brutal",
  "tactile",
  "neo",
  "rg",
  "y2k",
  "cp",
  "sw"
];
const iconTokenRoles = [
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "danger",
  "muted"
];
const svgTokenBridge = [
  ...iconTokenPrefixes.flatMap((prefix) =>
    iconTokenRoles.map(
      (role) =>
        `--${prefix}-icon-${role}: var(--usk-icon-contrast-${role}) !important;`
    )
  ),
  ...iconTokenPrefixes.map(
    (prefix) =>
      `--${prefix}-icon-border: var(--usk-icon-contrast-keyline) !important;`
  )
].join("\n");
let fallbackPack = "system";
let fallbackAssetBaseUrl = moduleBaseUrl;
let observer;

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-")
    .replace(/\s+/g, "-");
}

export function normalizeIconName(name) {
  const normalized = normalizeKey(name);
  return aliases[normalized] ?? normalized;
}

export function getPack(packOrStyle = fallbackPack) {
  const normalized = normalizeKey(packOrStyle);
  const id = packRegistry[normalized]
    ? normalized
    : styleAliases[normalized] ?? fallbackPack;

  return packRegistry[id] ?? packRegistry.system;
}

export function setDefaultPack(packOrStyle) {
  fallbackPack = getPack(packOrStyle).id;

  for (const icon of liveIcons) {
    icon.refresh();
  }

  return fallbackPack;
}

function directoryUrl(value, baseUrl = moduleBaseUrl) {
  if (value instanceof URL) {
    return new URL(
      value.href.endsWith("/") ? value.href : `${value.href}/`
    );
  }

  const text = String(value ?? "").trim();

  if (!text) {
    return new URL(baseUrl);
  }

  return new URL(
    text.endsWith("/") ? text : `${text}/`,
    globalThis.document?.baseURI ?? baseUrl
  );
}

export function setAssetBaseUrl(value) {
  fallbackAssetBaseUrl = directoryUrl(value);

  for (const icon of liveIcons) {
    icon.refresh();
  }

  return fallbackAssetBaseUrl.href;
}

export function getAssetBaseUrl() {
  return fallbackAssetBaseUrl.href;
}

export function resolveIconUrl(
  name,
  packOrStyle,
  baseUrl = fallbackAssetBaseUrl
) {
  const iconName = normalizeIconName(name);
  const pack = getPack(packOrStyle);
  const icon = [...pack.coreIcons, ...pack.optionalIcons].find(
    (candidate) => candidate.id === iconName
  );

  if (!icon) {
    throw new RangeError(`Unknown icon "${name}" for pack "${pack.id}".`);
  }

  return new URL(
    `${pack.sourcePath}/${icon.file}`,
    directoryUrl(baseUrl)
  ).href;
}

export function iconNames(packOrStyle = fallbackPack, { includeOptional = false } = {}) {
  const pack = getPack(packOrStyle);
  const names = pack.coreIcons.map(({ id }) => id);

  if (includeOptional) {
    names.push(...pack.optionalIcons.map(({ id }) => id));
  }

  return names;
}

function sanitizeSvg(svgText) {
  const documentNode = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = documentNode.documentElement;

  if (svg.nodeName.toLowerCase() !== "svg" || documentNode.querySelector("parsererror")) {
    throw new TypeError("The icon response was not a valid SVG document.");
  }

  /*
   * Icons may be loaded from a caller-configured asset host. Preserve SVG
   * drawing primitives while removing executable and remote-resource surfaces.
   */
  svg
    .querySelectorAll(
      [
        "a",
        "animate",
        "animateMotion",
        "animateTransform",
        "audio",
        "discard",
        "embed",
        "foreignObject",
        "iframe",
        "image",
        "object",
        "script",
        "set",
        "source",
        "track",
        "video"
      ].join(",")
    )
    .forEach((node) => node.remove());

  for (const style of svg.querySelectorAll("style")) {
    if (containsUnsafeCssReference(style.textContent ?? "")) {
      style.remove();
    }
  }

  for (const node of [svg, ...svg.querySelectorAll("*")]) {
    for (const attribute of [...node.attributes]) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();

      if (
        name.startsWith("on") ||
        (["href", "xlink:href", "src"].includes(name) &&
          !value.startsWith("#")) ||
        containsUnsafeCssReference(value)
      ) {
        node.removeAttribute(attribute.name);
      }
    }
  }

  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.removeAttribute("role");
  svg.removeAttribute("aria-labelledby");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("part", "svg");

  return svg.outerHTML;
}

function containsUnsafeCssReference(value) {
  if (/@import\b|expression\s*\(/iu.test(value)) {
    return true;
  }

  return [...value.matchAll(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/giu)].some(
    ([, , target]) => !target.trim().startsWith("#")
  );
}

async function loadSvg(url) {
  if (!svgCache.has(url)) {
    const request = fetch(url).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Unable to load icon (${response.status}).`);
      }

      return sanitizeSvg(await response.text());
    });

    svgCache.set(url, request);
    request.catch(() => {
      if (svgCache.get(url) === request) {
        svgCache.delete(url);
      }
    });
  }

  return svgCache.get(url);
}

function ensureObserver() {
  if (observer || typeof MutationObserver === "undefined") {
    return;
  }

  observer = new MutationObserver((records) => {
    if (
      records.some(({ attributeName }) =>
        ["data-ui", "data-icon-pack", "data-icon-base"].includes(attributeName)
      )
    ) {
      for (const icon of liveIcons) {
        icon.refresh();
      }
    }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ["data-ui", "data-icon-pack", "data-icon-base"]
  });
}

function contextualPack(element) {
  const explicit = element.getAttribute("pack");

  if (explicit) {
    return getPack(explicit);
  }

  const packScope = element.closest("[data-icon-pack]");

  if (packScope?.dataset.iconPack) {
    return getPack(packScope.dataset.iconPack);
  }

  const uiScope = element.closest("[data-ui]");
  return getPack(uiScope?.dataset.ui ?? fallbackPack);
}

function contextualAssetBaseUrl(element) {
  const explicit = element.getAttribute("asset-base");

  if (explicit) {
    return directoryUrl(explicit);
  }

  const scope = element.closest("[data-icon-base]");

  if (scope?.dataset.iconBase) {
    return directoryUrl(scope.dataset.iconBase);
  }

  return fallbackAssetBaseUrl;
}

const HTMLElementBase = globalThis.HTMLElement ?? class {};

export class UiStyleIconElement extends HTMLElementBase {
  static observedAttributes = ["name", "pack", "label", "size", "asset-base", "frame"];

  #renderId = 0;
  #root;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    liveIcons.add(this);
    ensureObserver();
    this.refresh();
  }

  disconnectedCallback() {
    liveIcons.delete(this);
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.refresh();
    }
  }

  get name() {
    return this.getAttribute("name") ?? "";
  }

  set name(value) {
    this.setAttribute("name", value);
  }

  get pack() {
    return contextualPack(this).id;
  }

  get frame() {
    return this.getAttribute("frame") ?? "auto";
  }

  set frame(value) {
    if (value === null || value === undefined || value === "auto") {
      this.removeAttribute("frame");
    } else {
      this.setAttribute("frame", value);
    }
  }

  refresh() {
    const renderId = ++this.#renderId;
    const name = normalizeIconName(this.name);
    const pack = contextualPack(this);
    const label = this.getAttribute("label")?.trim();
    const size = this.getAttribute("size")?.trim();

    this.dataset.pack = pack.id;
    this.toggleAttribute("data-loading", true);
    this.removeAttribute("data-error");

    if (label) {
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", label);
      this.removeAttribute("aria-hidden");
    } else {
      this.removeAttribute("role");
      this.removeAttribute("aria-label");
      this.setAttribute("aria-hidden", "true");
    }

    if (size) {
      this.style.setProperty("--usk-icon-size", size);
    } else {
      this.style.removeProperty("--usk-icon-size");
    }

    let url;

    try {
      url = resolveIconUrl(name, pack.id, contextualAssetBaseUrl(this));
    } catch (error) {
      this.#renderError(error);
      return;
    }

    loadSvg(url)
      .then((svg) => {
        if (renderId !== this.#renderId || !this.isConnected) {
          return;
        }

        this.#root.innerHTML = `
          <style>
            :host {
              --usk-icon-contrast-primary: rgb(var(--usk-primary-rgb, 37 99 235));
              --usk-icon-contrast-primary: color-mix(
                in srgb,
                rgb(var(--usk-primary-rgb, 37 99 235)) 45%,
                currentColor 55%
              );
              --usk-icon-contrast-secondary: rgb(var(--usk-secondary-rgb, 100 116 139));
              --usk-icon-contrast-secondary: color-mix(
                in srgb,
                rgb(var(--usk-secondary-rgb, 100 116 139)) 30%,
                currentColor 70%
              );
              --usk-icon-contrast-accent: rgb(var(--usk-accent-rgb, 14 165 233));
              --usk-icon-contrast-accent: color-mix(
                in srgb,
                rgb(var(--usk-accent-rgb, 14 165 233)) 30%,
                currentColor 70%
              );
              --usk-icon-contrast-success: rgb(var(--usk-success-rgb, 22 163 74));
              --usk-icon-contrast-success: color-mix(
                in srgb,
                rgb(var(--usk-success-rgb, 22 163 74)) 38%,
                currentColor 62%
              );
              --usk-icon-contrast-warning: rgb(var(--usk-warning-rgb, 202 138 4));
              --usk-icon-contrast-warning: color-mix(
                in srgb,
                rgb(var(--usk-warning-rgb, 202 138 4)) 38%,
                currentColor 62%
              );
              --usk-icon-contrast-danger: rgb(var(--usk-danger-rgb, 220 38 38));
              --usk-icon-contrast-danger: color-mix(
                in srgb,
                rgb(var(--usk-danger-rgb, 220 38 38)) 38%,
                currentColor 62%
              );
              --usk-icon-contrast-muted: rgb(var(--usk-text-muted-rgb, 100 116 139));
              --usk-icon-contrast-muted: color-mix(
                in srgb,
                rgb(var(--usk-text-muted-rgb, 100 116 139)) 20%,
                currentColor 80%
              );
              --usk-icon-contrast-keyline: currentColor;
              --usk-icon-foreground: currentColor;
              --usk-icon-play: currentColor;
              --usk-icon-primary: var(--usk-icon-contrast-primary);
              --usk-icon-secondary: var(--usk-icon-contrast-secondary);
              --usk-icon-accent: var(--usk-icon-contrast-accent);
              --usk-icon-success: var(--usk-icon-contrast-success);
              --usk-icon-warning: var(--usk-icon-contrast-warning);
              --usk-icon-danger: var(--usk-icon-contrast-danger);
              --usk-icon-muted: var(--usk-icon-contrast-muted);
              --usk-icon-border: var(--usk-icon-contrast-keyline);
              --saas-icon-primary: var(--usk-icon-contrast-primary);
              --saas-icon-secondary: var(--usk-icon-contrast-secondary);
              --saas-icon-accent: var(--usk-icon-contrast-accent);
              --saas-icon-success: var(--usk-icon-contrast-success);
              --saas-icon-warning: var(--usk-icon-contrast-warning);
              --saas-icon-danger: var(--usk-icon-contrast-danger);
              --saas-icon-muted: var(--usk-icon-contrast-muted);
              --saas-icon-border: var(--usk-icon-contrast-keyline);
              --bento-icon-primary: var(--usk-icon-contrast-primary);
              --bento-icon-secondary: var(--usk-icon-contrast-secondary);
              --bento-icon-accent: var(--usk-icon-contrast-accent);
              --bento-icon-success: var(--usk-icon-contrast-success);
              --bento-icon-warning: var(--usk-icon-contrast-warning);
              --bento-icon-danger: var(--usk-icon-contrast-danger);
              --bento-icon-muted: var(--usk-icon-contrast-muted);
              --bento-icon-border: var(--usk-icon-contrast-keyline);
              --max-icon-primary: var(--usk-icon-contrast-primary);
              --max-icon-secondary: var(--usk-icon-contrast-secondary);
              --max-icon-accent: var(--usk-icon-contrast-accent);
              --max-icon-success: var(--usk-icon-contrast-success);
              --max-icon-warning: var(--usk-icon-contrast-warning);
              --max-icon-danger: var(--usk-icon-contrast-danger);
              --max-icon-muted: var(--usk-icon-contrast-muted);
              --max-icon-border: var(--usk-icon-contrast-keyline);
              --brutal-icon-primary: var(--usk-icon-contrast-primary);
              --brutal-icon-secondary: var(--usk-icon-contrast-secondary);
              --brutal-icon-accent: var(--usk-icon-contrast-accent);
              --brutal-icon-success: var(--usk-icon-contrast-success);
              --brutal-icon-warning: var(--usk-icon-contrast-warning);
              --brutal-icon-danger: var(--usk-icon-contrast-danger);
              --brutal-icon-muted: var(--usk-icon-contrast-muted);
              --brutal-icon-border: var(--usk-icon-contrast-keyline);
              --tactile-icon-primary: var(--usk-icon-contrast-primary);
              --tactile-icon-secondary: var(--usk-icon-contrast-secondary);
              --tactile-icon-accent: var(--usk-icon-contrast-accent);
              --tactile-icon-success: var(--usk-icon-contrast-success);
              --tactile-icon-warning: var(--usk-icon-contrast-warning);
              --tactile-icon-danger: var(--usk-icon-contrast-danger);
              --tactile-icon-muted: var(--usk-icon-contrast-muted);
              --tactile-icon-border: var(--usk-icon-contrast-keyline);
              --neo-icon-primary: var(--usk-icon-contrast-primary);
              --neo-icon-secondary: var(--usk-icon-contrast-secondary);
              --neo-icon-accent: var(--usk-icon-contrast-accent);
              --neo-icon-success: var(--usk-icon-contrast-success);
              --neo-icon-warning: var(--usk-icon-contrast-warning);
              --neo-icon-danger: var(--usk-icon-contrast-danger);
              --neo-icon-muted: var(--usk-icon-contrast-muted);
              --neo-icon-border: var(--usk-icon-contrast-keyline);
              --rg-icon-primary: var(--usk-icon-contrast-primary);
              --rg-icon-secondary: var(--usk-icon-contrast-secondary);
              --rg-icon-accent: var(--usk-icon-contrast-accent);
              --rg-icon-success: var(--usk-icon-contrast-success);
              --rg-icon-warning: var(--usk-icon-contrast-warning);
              --rg-icon-danger: var(--usk-icon-contrast-danger);
              --rg-icon-muted: var(--usk-icon-contrast-muted);
              --rg-icon-border: var(--usk-icon-contrast-keyline);
              --y2k-icon-primary: var(--usk-icon-contrast-primary);
              --y2k-icon-secondary: var(--usk-icon-contrast-secondary);
              --y2k-icon-accent: var(--usk-icon-contrast-accent);
              --y2k-icon-success: var(--usk-icon-contrast-success);
              --y2k-icon-warning: var(--usk-icon-contrast-warning);
              --y2k-icon-danger: var(--usk-icon-contrast-danger);
              --y2k-icon-muted: var(--usk-icon-contrast-muted);
              --y2k-icon-border: var(--usk-icon-contrast-keyline);
              --cp-icon-primary: var(--usk-icon-contrast-primary);
              --cp-icon-secondary: var(--usk-icon-contrast-secondary);
              --cp-icon-accent: var(--usk-icon-contrast-accent);
              --cp-icon-success: var(--usk-icon-contrast-success);
              --cp-icon-warning: var(--usk-icon-contrast-warning);
              --cp-icon-danger: var(--usk-icon-contrast-danger);
              --cp-icon-muted: var(--usk-icon-contrast-muted);
              --cp-icon-border: var(--usk-icon-contrast-keyline);
              --sw-icon-primary: var(--usk-icon-contrast-primary);
              --sw-icon-secondary: var(--usk-icon-contrast-secondary);
              --sw-icon-accent: var(--usk-icon-contrast-accent);
              --sw-icon-success: var(--usk-icon-contrast-success);
              --sw-icon-warning: var(--usk-icon-contrast-warning);
              --sw-icon-danger: var(--usk-icon-contrast-danger);
              --sw-icon-muted: var(--usk-icon-contrast-muted);
              --sw-icon-border: var(--usk-icon-contrast-keyline);
              inline-size: var(--usk-icon-size, 1.25em);
              block-size: var(--usk-icon-size, 1.25em);
              display: inline-flex;
              flex: 0 0 auto;
              vertical-align: -0.125em;
            }
            :host-context([data-mode="contrast"]) {
              /*
               * Contrast mode prioritizes an unambiguous silhouette while
               * light and dark modes retain each theme's color identity.
               */
              --usk-icon-contrast-primary: currentColor !important;
              --usk-icon-contrast-secondary: currentColor !important;
              --usk-icon-contrast-accent: currentColor !important;
              --usk-icon-contrast-success: currentColor !important;
              --usk-icon-contrast-warning: currentColor !important;
              --usk-icon-contrast-danger: currentColor !important;
              --usk-icon-contrast-muted: currentColor !important;
              --usk-icon-contrast-keyline: currentColor !important;
            }
            :host-context([data-mode="light"]) {
              --usk-icon-contrast-keyline: rgb(15 23 42);
            }
            :host-context([data-mode="dark"]) {
              --usk-icon-contrast-keyline: rgb(248 250 252);
            }
            :host([frame="none"]) {
              --usk-icon-frame-opacity: 0;
              --usk-icon-frame-decor-opacity: 0;
            }
            :host([frame="soft"]) {
              --usk-icon-frame-opacity: 0.36;
              --usk-icon-frame-decor-opacity: 0.10;
            }
            svg :is(
              [data-icon-frame]:is(path, rect, circle, ellipse):not([fill="none"]),
              [data-icon-frame] :is(path, rect, circle, ellipse):not([fill="none"])
            ) {
              fill-opacity: var(--usk-icon-frame-fill-alpha, 0.18) !important;
            }
            :host-context([data-mode="contrast"]) svg :is(
              [data-icon-frame]:is(path, rect, circle, ellipse):not([fill="none"]),
              [data-icon-frame] :is(path, rect, circle, ellipse):not([fill="none"])
            ) {
              /*
               * Contrast mode keeps frame outlines while preventing scenic
               * frame fills from competing with the semantic foreground.
               */
              fill-opacity: 0.08 !important;
            }
            svg {
              /*
               * Authored SVG roots declare standalone fallback tokens and sizes.
               * The component bridge remains authoritative when artwork is embedded.
               */
              ${svgTokenBridge}
              inline-size: 100% !important;
              block-size: 100% !important;
              display: block;
              overflow: visible;
              pointer-events: none;
            }
            svg.y2k-icon {
              overflow: hidden;
            }
            svg [data-icon-frame="surface"] {
              opacity: var(--usk-icon-frame-opacity, 1);
            }
            svg [data-icon-glyph="play"] {
              fill: var(--usk-icon-play, var(--usk-icon-foreground, rgb(var(--usk-text-rgb, 255 255 255))));
              stroke: none;
              opacity: 1;
            }
            svg :is(
              [class*="-bg-strong"],
              [class*="-bg-soft"],
              [class$="-bg"]
            ):not(
              [data-icon-frame],
              [data-icon-frame] *,
              [data-icon-audit],
              [data-icon-audit] *
            ) {
              stroke: var(--usk-icon-contrast-keyline) !important;
              stroke-width: var(--usk-icon-keyline-width, 3.5);
              stroke-linejoin: round;
            }
            svg [class*="-primary"]:not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-primary-rgb, 37 99 235) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg [class*="-secondary"]:not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-secondary-rgb, 100 116 139) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg [class*="-accent"]:not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-accent-rgb, 14 165 233) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg [class*="-success"]:not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-success-rgb, 22 163 74) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg [class*="-warning"]:not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-warning-rgb, 202 138 4) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg [class*="-danger"]:not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-danger-rgb, 220 38 38) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg [fill^="url("]:not(
              [data-icon-frame],
              [data-icon-frame] *,
              [data-icon-audit],
              [data-icon-audit] *
            ) {
              /*
               * Rich pack gradients remain visible as a tint while the
               * contrast keyline carries the small-size silhouette.
               */
              fill-opacity: var(--usk-icon-gradient-fill-alpha, 0.16) !important;
            }
            svg :is(
              [fill^="url("],
              [fill*="--cp-icon-"],
              [fill*="--sw-icon-"],
              [fill*="--usk-surface-"]
            ):not(
              [data-icon-frame],
              [data-icon-frame] *,
              [data-icon-audit],
              [data-icon-audit] *
            ) {
              stroke: var(--usk-icon-contrast-keyline) !important;
              stroke-width: var(--usk-icon-fill-keyline-width, 3.5);
              stroke-linejoin: round;
            }
            svg :is(
              [stroke*="--usk-surface-"],
              [stroke*="--usk-bg-"]
            ):not(
              [data-icon-frame],
              [data-icon-frame] *,
              [data-icon-audit],
              [data-icon-audit] *
            ) {
              stroke: var(--usk-icon-contrast-keyline) !important;
            }
            svg [stroke*="-icon-"]:not(
              [data-icon-frame],
              [data-icon-frame] *,
              [data-icon-audit],
              [data-icon-audit] *
            ) {
              /*
               * Semantic line work uses the foreground keyline; theme color
               * remains in fills so fine strokes do not disappear by mode.
               */
              stroke: var(--usk-icon-contrast-keyline) !important;
            }
            svg [opacity]:is(
              [fill*="-icon-"],
              [class*="-primary"],
              [class*="-secondary"],
              [class*="-accent"],
              [class*="-success"],
              [class*="-warning"],
              [class*="-danger"]
            ):not(
              [data-icon-frame],
              [data-icon-frame] *,
              [data-icon-audit],
              [data-icon-audit] *
            ) {
              opacity: 1 !important;
            }
            svg :is(
              [fill*="--cp-icon-primary"],
              [fill*="--sw-icon-primary"]
            ):not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-primary-rgb, 37 99 235) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg :is(
              [fill*="--cp-icon-secondary"],
              [fill*="--sw-icon-secondary"]
            ):not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-secondary-rgb, 100 116 139) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg :is(
              [fill*="--cp-icon-accent"],
              [fill*="--sw-icon-accent"]
            ):not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-accent-rgb, 14 165 233) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg :is(
              [fill*="--cp-icon-success"],
              [fill*="--sw-icon-success"]
            ):not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-success-rgb, 22 163 74) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg :is(
              [fill*="--cp-icon-warning"],
              [fill*="--sw-icon-warning"]
            ):not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-warning-rgb, 202 138 4) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg :is(
              [fill*="--cp-icon-danger"],
              [fill*="--sw-icon-danger"]
            ):not([data-icon-frame], [data-icon-frame] *) {
              fill: rgb(var(--usk-danger-rgb, 220 38 38) / var(--usk-icon-fill-alpha, 0.22)) !important;
            }
            svg stop[stop-color*="--cp-icon-primary"],
            svg stop[stop-color*="--sw-icon-primary"] {
              stop-color: var(--usk-icon-contrast-primary) !important;
            }
            svg stop[stop-color*="--cp-icon-secondary"],
            svg stop[stop-color*="--sw-icon-secondary"] {
              stop-color: var(--usk-icon-contrast-secondary) !important;
            }
            svg stop[stop-color*="--cp-icon-accent"],
            svg stop[stop-color*="--sw-icon-accent"] {
              stop-color: var(--usk-icon-contrast-accent) !important;
            }
            svg stop[stop-color*="--cp-icon-warning"],
            svg stop[stop-color*="--sw-icon-warning"] {
              stop-color: var(--usk-icon-contrast-warning) !important;
            }
            svg stop[stop-color*="--cp-icon-success"],
            svg stop[stop-color*="--sw-icon-success"] {
              stop-color: var(--usk-icon-contrast-success) !important;
            }
            svg stop[stop-color*="--cp-icon-danger"],
            svg stop[stop-color*="--sw-icon-danger"] {
              stop-color: var(--usk-icon-contrast-danger) !important;
            }
            svg :is(
              [class*="-primary"],
              [class*="-secondary"],
              [class*="-accent"],
              [class*="-success"],
              [class*="-warning"],
              [class*="-danger"]
            ):not(
              [data-icon-frame],
              [data-icon-frame] *,
              [data-icon-audit],
              [data-icon-audit] *
            ) {
              /*
               * Soft fills retain each pack's palette while a stable keyline
               * keeps their silhouettes readable against light surfaces.
               */
              stroke: var(--usk-icon-contrast-keyline) !important;
              stroke-width: var(--usk-icon-fill-keyline-width, 3.5);
              stroke-linejoin: round;
            }
            @media (prefers-reduced-motion: reduce) {
              svg { animation: none !important; transition: none !important; }
            }
          </style>
          ${svg}
        `;
        this.toggleAttribute("data-loading", false);
        this.dispatchEvent(
          new CustomEvent("usk-icon-load", {
            bubbles: true,
            composed: true,
            detail: { name, pack: pack.id, url }
          })
        );
      })
      .catch((error) => this.#renderError(error));
  }

  #renderError(error) {
    this.toggleAttribute("data-loading", false);
    this.setAttribute("data-error", "");
    this.#root.innerHTML = `
      <style>
        :host {
          inline-size: var(--usk-icon-size, 1.25em);
          block-size: var(--usk-icon-size, 1.25em);
          display: inline-block;
        }
      </style>
    `;
    this.dispatchEvent(
      new CustomEvent("usk-icon-error", {
        bubbles: true,
        composed: true,
        detail: { name: this.name, pack: this.pack, error }
      })
    );
  }
}

export function defineUiStyleIcon(tagName = "usk-icon") {
  if (
    typeof globalThis.customElements !== "undefined" &&
    !globalThis.customElements.get(tagName)
  ) {
    globalThis.customElements.define(tagName, UiStyleIconElement);
  }

  return globalThis.customElements?.get(tagName);
}

defineUiStyleIcon();

export {
  aliases,
  contractVersion,
  coreIconIds,
  packageName,
  packageVersion,
  packCount,
  packs,
  packRegistry,
  requiredIconCount,
  styleAliases,
  uiStyleKitCssCompatibility
};
