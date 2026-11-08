import { inlineSvg } from "../paint/inline-svg.mjs";
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
let fallbackPack = "organic-modern";
let fallbackAssetBaseUrl = moduleBaseUrl;
let observer;

/**
 * Normalizes a public icon, family, or alias key.
 *
 * @param {unknown} value User-supplied key.
 * @returns {string} Lowercase kebab-case key.
 */
function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-")
    .replace(/\s+/gu, "-");
}

/**
 * Resolves a supported icon alias to its canonical Collection 01 name.
 *
 * @param {string} name Icon name or alias.
 * @returns {string} Canonical icon name when an alias exists.
 */
export function normalizeIconName(name) {
  const normalized = normalizeKey(name);
  return aliases[normalized] ?? normalized;
}

/**
 * Returns a registered Collection 01 family.
 *
 * @param {string} [packOrStyle] Family ID or supported style alias.
 * @returns {Record<string, unknown>} Registry family record.
 * @throws {RangeError} When the family is not part of Collection 01.
 */
export function getPack(packOrStyle = fallbackPack) {
  const normalized = normalizeKey(packOrStyle);
  const id = packRegistry[normalized]
    ? normalized
    : styleAliases[normalized];

  if (!id || !packRegistry[id]) {
    throw new RangeError(`Unknown icon family "${packOrStyle}".`);
  }

  return packRegistry[id];
}

/**
 * Changes the fallback family used when no family is specified.
 *
 * @param {string} packOrStyle Family ID or supported style alias.
 * @returns {string} Canonical family ID.
 */
export function setDefaultPack(packOrStyle) {
  fallbackPack = getPack(packOrStyle).id;

  for (const icon of liveIcons) {
    icon.refresh();
  }

  return fallbackPack;
}

/**
 * Resolves a path-like value to a directory URL.
 *
 * @param {string | URL | undefined} value Directory value.
 * @param {URL} [baseUrl] Resolution base.
 * @returns {URL} URL with a trailing slash.
 */
function directoryUrl(value, baseUrl = moduleBaseUrl) {
  if (value instanceof URL) {
    return new URL(value.href.endsWith("/") ? value.href : `${value.href}/`);
  }

  const text = String(value ?? "").trim();
  const directory = text ? (text.endsWith("/") ? text : `${text}/`) : "./";

  return new URL(directory, globalThis.document?.baseURI ?? baseUrl);
}

/**
 * Sets the package root used to load SVG artwork.
 *
 * @param {string | URL} value Package-root URL.
 * @returns {string} Normalized absolute URL.
 */
export function setAssetBaseUrl(value) {
  fallbackAssetBaseUrl = directoryUrl(value);

  for (const icon of liveIcons) {
    icon.refresh();
  }

  return fallbackAssetBaseUrl.href;
}

/**
 * Returns the active package-root URL.
 *
 * @returns {string} Absolute asset base URL.
 */
export function getAssetBaseUrl() {
  return fallbackAssetBaseUrl.href;
}

/**
 * Resolves a themed or monochrome SVG URL.
 *
 * @param {string} name Icon name.
 * @param {string} [packOrStyle] Family ID or style alias.
 * @param {string | URL} [baseUrl] Package-root URL.
 * @param {"themed" | "monochrome"} [variant="themed"] Artwork variant.
 * @returns {string} Absolute SVG URL.
 */
export function resolveIconUrl(
  name,
  packOrStyle,
  baseUrl = fallbackAssetBaseUrl,
  variant = "themed"
) {
  const iconName = normalizeIconName(name);
  const pack = getPack(packOrStyle);
  const icon = pack.coreIcons.find((candidate) => candidate.id === iconName);

  if (!icon) {
    throw new RangeError(`Unknown icon "${name}" for family "${pack.id}".`);
  }

  if (!["themed", "monochrome"].includes(variant)) {
    throw new RangeError(`Unknown icon variant "${variant}".`);
  }

  const relativePath = variant === "monochrome" ? icon.monochromeFile : icon.file;
  return new URL(relativePath, directoryUrl(baseUrl)).href;
}

/**
 * Returns the canonical icon names for a family.
 *
 * @param {string} [packOrStyle] Family ID or style alias.
 * @returns {string[]} Canonical icon names in manifest order.
 */
export function iconNames(packOrStyle = fallbackPack) {
  return getPack(packOrStyle).coreIcons.map(({ id }) => id);
}

/**
 * Detects unsafe CSS resource references inside SVG text.
 *
 * @param {string} value CSS or attribute text.
 * @returns {boolean} Whether the text can execute or load an external resource.
 */
function containsUnsafeCssReference(value) {
  if (/@import\b|expression\s*\(/iu.test(value)) {
    return true;
  }

  return [...value.matchAll(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/giu)].some(
    ([, , target]) => !target.trim().startsWith("#")
  );
}

/**
 * Sanitizes supplied SVG markup for insertion into a shadow root.
 *
 * @param {string} svgText Complete SVG document.
 * @returns {string} Sanitized inline SVG markup.
 */
function sanitizeSvg(svgText) {
  const normalized = inlineSvg(svgText);
  const documentNode = new DOMParser().parseFromString(normalized, "image/svg+xml");
  const svg = documentNode.documentElement;

  if (
    svg.nodeName.toLowerCase() !== "svg" ||
    documentNode.querySelector("parsererror")
  ) {
    throw new TypeError("The icon response was not a valid SVG document.");
  }

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
  svg.removeAttribute("aria-label");
  svg.removeAttribute("aria-labelledby");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("part", "svg");

  return svg.outerHTML;
}

/**
 * Loads and caches a sanitized SVG document.
 *
 * @param {string} url SVG URL.
 * @returns {Promise<string>} Sanitized inline SVG markup.
 */
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

/**
 * Installs the shared observer for contextual family and asset-root changes.
 *
 * @returns {void}
 */
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

/**
 * Resolves the closest family scope for an icon element.
 *
 * @param {Element} element Icon element.
 * @returns {Record<string, unknown>} Registry family record.
 */
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

/**
 * Resolves the closest package-root scope for an icon element.
 *
 * @param {Element} element Icon element.
 * @returns {URL} Package-root URL.
 */
function contextualAssetBaseUrl(element) {
  const explicit = element.getAttribute("asset-base");

  if (explicit) {
    return directoryUrl(explicit);
  }

  const scope = element.closest("[data-icon-base]");
  return scope?.dataset.iconBase
    ? directoryUrl(scope.dataset.iconBase)
    : fallbackAssetBaseUrl;
}

const HTMLElementBase = globalThis.HTMLElement ?? class {};

/**
 * Theme-aware custom element for Collection 01 artwork.
 */
export class UiStyleIconElement extends HTMLElementBase {
  static observedAttributes = [
    "name",
    "pack",
    "label",
    "size",
    "asset-base",
    "variant"
  ];

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

  get variant() {
    return this.getAttribute("variant") === "monochrome"
      ? "monochrome"
      : "themed";
  }

  set variant(value) {
    if (!value || value === "themed") {
      this.removeAttribute("variant");
    } else {
      this.setAttribute("variant", value);
    }
  }

  /**
   * Reloads artwork after a public property or contextual scope changes.
   *
   * @returns {void}
   */
  refresh() {
    const renderId = ++this.#renderId;
    const name = normalizeIconName(this.name);
    const variant = this.variant;
    const label = this.getAttribute("label")?.trim();
    const size = this.getAttribute("size")?.trim();
    let pack;
    let url;

    try {
      pack = contextualPack(this);
      url = resolveIconUrl(
        name,
        pack.id,
        contextualAssetBaseUrl(this),
        variant
      );
    } catch (error) {
      this.#renderError(error, name, variant);
      return;
    }

    this.dataset.pack = pack.id;
    this.dataset.variant = variant;
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

    loadSvg(url)
      .then((svg) => {
        if (renderId !== this.#renderId || !this.isConnected) {
          return;
        }

        this.#root.innerHTML = `
          <style>
            :host {
              display: inline-block;
              inline-size: var(--usk-icon-size, 1.25em);
              block-size: var(--usk-icon-size, 1.25em);
              color: inherit;
              line-height: 1;
              vertical-align: -0.125em;
            }
            svg {
              display: block;
              inline-size: 100%;
              block-size: 100%;
              overflow: visible;
            }
          </style>
          ${svg}
        `;
        this.toggleAttribute("data-loading", false);
        this.dispatchEvent(
          new CustomEvent("usk-icon-load", {
            bubbles: true,
            composed: true,
            detail: { name, pack: pack.id, variant, url }
          })
        );
      })
      .catch((error) => this.#renderError(error, name, variant));
  }

  /**
   * Renders an empty fallback and reports a load or contract error.
   *
   * @param {unknown} error Failure value.
   * @param {string} [name] Requested icon name.
   * @param {"themed" | "monochrome"} [variant="themed"] Requested variant.
   * @returns {void}
   */
  #renderError(error, name = this.name, variant = this.variant) {
    this.toggleAttribute("data-loading", false);
    this.setAttribute("data-error", "");
    this.#root.innerHTML = `<style>:host{display:inline-block;inline-size:var(--usk-icon-size,1.25em);block-size:var(--usk-icon-size,1.25em)}</style>`;
    this.dispatchEvent(
      new CustomEvent("usk-icon-error", {
        bubbles: true,
        composed: true,
        detail: { name, pack: this.getAttribute("pack") ?? "", variant, error }
      })
    );
  }
}

/**
 * Registers the UI Style Kit icon custom element once.
 *
 * @param {string} [tagName="usk-icon"] Custom-element tag name.
 * @returns {CustomElementConstructor | undefined} Registered constructor.
 */
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
