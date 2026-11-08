#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const packageJson = await readJson("package.json");
const manifest = await readJson("manifest.json");
const { UI_STYLE_KIT_CSS_COMPATIBILITY } = await import(
  pathToFileURL(path.join(root, "src/ecosystem.mjs"))
);
const iconIds = Object.keys(manifest.icons);

assertCollectionContract();

const packs = [];

for (const [styleId, style] of Object.entries(manifest.styles)) {
  const pack = buildPackRecord(styleId, style);
  packs.push(pack);
  await buildSprites(pack);
}

const registry = {
  name: packageJson.name,
  version: packageJson.version,
  contractVersion: String(manifest.schemaVersion),
  collection: "01",
  requiredIconCount: iconIds.length,
  packCount: packs.length,
  coreIconIds: iconIds,
  aliases: manifest.aliases,
  styleAliases: manifest.styleAliases,
  uiStyleKitCssCompatibility: UI_STYLE_KIT_CSS_COMPATIBILITY,
  packs
};

await fs.mkdir(path.join(root, "dist"), { recursive: true });
await fs.copyFile(
  path.join(root, "src/ui-style-kit-icons.js"),
  path.join(root, "dist/ui-style-kit-icons.js")
);
const paintCss = await fs.readFile(path.join(root, "paint/all.css"), "utf8");

await writeFile("dist/ui-style-kit-icons.css", paintCss);
await writeFile("dist/ui-style-kit-icons.all.css", paintCss);
await fs.copyFile(
  path.join(root, "dist/sprites/organic-modern.svg"),
  path.join(root, "dist/ui-style-kit-icons.svg")
);
await fs.copyFile(
  path.join(root, "sprite/organic-modern.inline.svg"),
  path.join(root, "sprite/ui-style-kit-icons.inline.svg")
);
await writeFile("dist/registry.json", JSON.stringify(registry, null, 2));
await writeFile("dist/registry.js", registryModule(registry));
await writeFile("dist/ui-style-kit-icons.d.ts", typeDefinitions(registry));

console.log(
  `Built Collection 01 runtime and ${packs.length} families with ${iconIds.length} icons each.`
);

/**
 * Verifies that the supplied collection manifest and package metadata agree.
 *
 * @returns {void}
 */
function assertCollectionContract() {
  const styleIds = Object.keys(manifest.styles);

  if (manifest.iconsPerStyle !== iconIds.length) {
    throw new Error(
      `manifest.iconsPerStyle is ${manifest.iconsPerStyle}; found ${iconIds.length} icon records.`
    );
  }

  if (manifest.styleCount !== styleIds.length) {
    throw new Error(
      `manifest.styleCount is ${manifest.styleCount}; found ${styleIds.length} style records.`
    );
  }

  for (const [alias, styleId] of Object.entries(manifest.styleAliases)) {
    if (!manifest.styles[styleId]) {
      throw new Error(
        `Style alias "${alias}" targets unknown family "${styleId}".`
      );
    }
  }

  for (const [alias, iconId] of Object.entries(manifest.aliases)) {
    if (!manifest.icons[iconId]) {
      throw new Error(
        `Icon alias "${alias}" targets unknown icon "${iconId}".`
      );
    }
  }
}

/**
 * Creates one public family record from the canonical manifest.
 *
 * @param {string} styleId Canonical family ID.
 * @param {{label: string, description: string}} style Manifest style metadata.
 * @returns {Record<string, unknown>} Public registry record.
 */
function buildPackRecord(styleId, style) {
  const coreIcons = iconIds.map((id) => {
    const icon = manifest.icons[id];

    return {
      id,
      label: icon.label,
      category: icon.category,
      keywords: icon.keywords,
      meaning: icon.category,
      file: `svg/${styleId}/${id}.svg`,
      monochromeFile: `monochrome/${styleId}/${id}.svg`,
      symbol: `#usk-icon-${id}`
    };
  });

  return {
    id: styleId,
    label: style.label,
    description: style.description,
    sourcePath: ".",
    uiStyle: styleId,
    layoutStyle: styleId,
    tags: [styleId, "collection-01"],
    name: `${packageJson.name}-${styleId}`,
    version: packageJson.version,
    contractVersion: String(manifest.schemaVersion),
    style: styleId,
    styleSource: "UI Style Kit Icons Collection 01",
    iconCount: coreIcons.length,
    requiredIconCount: coreIcons.length,
    optionalIconCount: 0,
    css: "dist/ui-style-kit-icons.css",
    sprite: `dist/sprites/${styleId}.svg`,
    monochromeSprite: `dist/sprites/${styleId}.monochrome.svg`,
    inlineSprite: `sprite/${styleId}.inline.svg`,
    monochromeInlineSprite: `sprite/${styleId}.monochrome.inline.svg`,
    manifest: "manifest.json",
    coreIcons,
    optionalIcons: [],
    aliases: manifest.aliases
  };
}

/**
 * Builds themed and one-ink sprite documents for a family.
 *
 * @param {Record<string, unknown>} pack Public family record.
 * @returns {Promise<void>}
 */
async function buildSprites(pack) {
  const variants = [
    ["themed", "file", pack.sprite, pack.inlineSprite],
    [
      "monochrome",
      "monochromeFile",
      pack.monochromeSprite,
      pack.monochromeInlineSprite
    ]
  ];

  for (const [variant, fileProperty, externalPath, inlinePath] of variants) {
    const symbols = [];

    for (const icon of pack.coreIcons) {
      const svgPath = path.join(root, icon[fileProperty]);
      const source = normalizeText(await fs.readFile(svgPath, "utf8"));
      const { inner, viewBox } = extractSvgParts(source, svgPath);

      symbols.push(`<symbol id="${icon.symbol.slice(1)}" viewBox="${viewBox}">
  <title>${escapeHtml(icon.label)}</title>
${indent(inner, "  ")}
</symbol>`);
    }

    const external = `<svg xmlns="http://www.w3.org/2000/svg" data-icon-family="${pack.id}" data-icon-variant="${variant}">
<defs>
${symbols.join("\n")}
</defs>
</svg>`;
    const inline = `<svg xmlns="http://www.w3.org/2000/svg" data-icon-family="${pack.id}" data-icon-variant="${variant}" style="display:none">
${symbols.join("\n")}
</svg>`;

    await writeFile(externalPath, external);
    await writeFile(inlinePath, inline);
  }
}

/**
 * Extracts portable sprite content from a complete SVG document.
 *
 * @param {string} source SVG source.
 * @param {string} svgPath Source path used in validation errors.
 * @returns {{inner: string, viewBox: string}} Sprite-ready SVG parts.
 */
function extractSvgParts(source, svgPath) {
  const openMatch = source.match(/<svg\b([^>]*)>/iu);
  const closeIndex = source.lastIndexOf("</svg>");

  if (!openMatch || closeIndex === -1) {
    throw new Error(`${svgPath} is not a complete SVG document.`);
  }

  const viewBox = openMatch[1].match(/\bviewBox="([^"]+)"/u)?.[1];

  if (viewBox !== "0 0 24 24") {
    throw new Error(`${svgPath} must use the Collection 01 24-unit viewport.`);
  }

  const inner = source
    .slice((openMatch.index ?? 0) + openMatch[0].length, closeIndex)
    .replace(/<title\b[\s\S]*?<\/title>/iu, "")
    .replace(/<desc\b[\s\S]*?<\/desc>/iu, "")
    .trim();

  return { inner, viewBox };
}

/**
 * Serializes the JSON registry as an ESM module.
 *
 * @param {Record<string, unknown>} registryValue Public registry.
 * @returns {string} JavaScript module source.
 */
function registryModule(registryValue) {
  return `export const packageName = ${JSON.stringify(registryValue.name)};
export const packageVersion = ${JSON.stringify(registryValue.version)};
export const contractVersion = ${JSON.stringify(registryValue.contractVersion)};
export const requiredIconCount = ${registryValue.requiredIconCount};
export const packCount = ${registryValue.packCount};
export const coreIconIds = ${JSON.stringify(registryValue.coreIconIds, null, 2)};
export const aliases = ${JSON.stringify(registryValue.aliases, null, 2)};
export const styleAliases = ${JSON.stringify(registryValue.styleAliases, null, 2)};
export const uiStyleKitCssCompatibility = ${JSON.stringify(registryValue.uiStyleKitCssCompatibility, null, 2)};
export const packs = ${JSON.stringify(registryValue.packs, null, 2)};
export const packRegistry = Object.fromEntries(packs.map((pack) => [pack.id, pack]));`;
}

/**
 * Creates the public TypeScript declarations from the generated registry.
 *
 * @param {Record<string, unknown>} registryValue Public registry.
 * @returns {string} Type declaration source.
 */
function typeDefinitions(registryValue) {
  const iconNames = registryValue.coreIconIds
    .map((id) => JSON.stringify(id))
    .join(" | ");
  const packIds = registryValue.packs
    .map(({ id }) => JSON.stringify(id))
    .join(" | ");
  const themes = registryValue.uiStyleKitCssCompatibility.themes
    .map((theme) => JSON.stringify(theme))
    .join(" | ");
  const modes = registryValue.uiStyleKitCssCompatibility.modes
    .map((mode) => JSON.stringify(mode))
    .join(" | ");

  return `export type IconName = ${iconNames};
export type IconPack = ${packIds};
export type IconVariant = "themed" | "monochrome";
export type UiStyleKitCssTheme = ${themes};
export type UiStyleKitCssMode = ${modes};
export interface IconRecord {
  id: IconName;
  label: string;
  category: string;
  keywords: string[];
  file: string;
  monochromeFile: string;
  symbol: string;
  meaning: string;
}
export interface PackRecord {
  id: IconPack;
  label: string;
  sourcePath: ".";
  uiStyle: string;
  layoutStyle: string;
  description: string;
  tags: string[];
  name: string;
  version: string;
  contractVersion: string;
  style: string;
  styleSource: string;
  iconCount: number;
  requiredIconCount: number;
  optionalIconCount: 0;
  css: string;
  sprite: string;
  monochromeSprite: string;
  inlineSprite: string;
  monochromeInlineSprite: string;
  manifest: "manifest.json";
  coreIcons: IconRecord[];
  optionalIcons: [];
  aliases: Record<string, IconName>;
}
export interface UiStyleKitCssCompatibility {
  packageName: "ui-style-kit-css";
  versionRange: string;
  themes: UiStyleKitCssTheme[];
  modes: UiStyleKitCssMode[];
  requiredPaintTokens: string[];
}
export interface IconLoadDetail {
  name: IconName;
  pack: IconPack;
  variant: IconVariant;
  url: string;
}
export interface IconErrorDetail {
  name: string;
  pack: IconPack;
  variant: IconVariant;
  error: unknown;
}
export declare const packageName: ${JSON.stringify(registryValue.name)};
export declare const packageVersion: string;
export declare const contractVersion: string;
export declare const requiredIconCount: number;
export declare const packCount: number;
export declare const coreIconIds: IconName[];
export declare const aliases: Record<string, IconName>;
export declare const styleAliases: Record<string, IconPack>;
export declare const uiStyleKitCssCompatibility: UiStyleKitCssCompatibility;
export declare const packs: PackRecord[];
export declare const packRegistry: Record<IconPack, PackRecord>;
export declare function normalizeIconName(name: string): IconName | string;
export declare function getPack(packOrStyle?: string): PackRecord;
export declare function setDefaultPack(packOrStyle: string): IconPack;
export declare function setAssetBaseUrl(value: string | URL): string;
export declare function getAssetBaseUrl(): string;
export declare function resolveIconUrl(name: string, packOrStyle?: string, baseUrl?: string | URL, variant?: IconVariant): string;
export declare function iconNames(packOrStyle?: string): IconName[];
export declare class UiStyleIconElement extends HTMLElement { name: string; readonly pack: IconPack; variant: IconVariant; refresh(): void; }
export declare function defineUiStyleIcon(tagName?: string): typeof UiStyleIconElement;
declare global {
  interface HTMLElementTagNameMap {
    "usk-icon": UiStyleIconElement;
  }
  interface HTMLElementEventMap {
    "usk-icon-load": CustomEvent<IconLoadDetail>;
    "usk-icon-error": CustomEvent<IconErrorDetail>;
  }
}`;
}

/**
 * Reads a repository JSON file.
 *
 * @param {string} relativePath Repository-relative path.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON value.
 */
async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

/**
 * Writes normalized generated text and creates its parent directory.
 *
 * @param {string} relativePath Repository-relative output path.
 * @param {string} text Output text.
 * @returns {Promise<void>}
 */
async function writeFile(relativePath, text) {
  const file = path.join(root, relativePath);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${normalizeText(text)}\n`);
}

/**
 * Normalizes generated text for stable cross-platform diffs.
 *
 * @param {string} value Source text.
 * @returns {string} LF-only text without trailing spaces or blank lines.
 */
function normalizeText(value) {
  return value
    .replace(/\r\n?/gu, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n+$/u, "")
    .trim();
}

/**
 * Indents generated markup without changing blank lines.
 *
 * @param {string} value Multiline source.
 * @param {string} prefix Indentation prefix.
 * @returns {string} Indented text.
 */
function indent(value, prefix) {
  return value
    .split("\n")
    .map((line) => (line ? `${prefix}${line}` : ""))
    .join("\n");
}

/**
 * Escapes text for an SVG title element.
 *
 * @param {unknown} value Text value.
 * @returns {string} XML-safe text.
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
