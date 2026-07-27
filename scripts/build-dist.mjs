#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const distDir = path.join(root, "dist");
const packageJson = await readJson("package.json");
const contract = await readJson("contract/icon-contract.json");
const { UI_STYLE_KIT_CSS_COMPATIBILITY } = await import(
  pathToFileURL(path.join(root, "src/ecosystem.mjs"))
);
const { PACK_DEFINITIONS, STYLE_ALIASES } = await import(
  pathToFileURL(path.join(root, "src/packs.mjs"))
);
const coreIconIds = contract.icons.map((icon) => icon.id);
const iconContract = new Map(contract.icons.map((icon) => [icon.id, icon]));

await fs.mkdir(distDir, { recursive: true });

const packs = [];

for (const definition of PACK_DEFINITIONS) {
  const manifest = await readJson(path.join(definition.sourcePath, "manifest.json"));
  const sourcePath = normalizePath(definition.sourcePath);
  const pack = buildPackRecord(definition, manifest, sourcePath);

  packs.push(pack);
  await buildSprites(pack);
}

const registry = {
  name: packageJson.name,
  version: packageJson.version,
  contractVersion: contract.schemaVersion,
  requiredIconCount: contract.requiredIconCount,
  packCount: packs.length,
  coreIconIds,
  aliases: contract.aliases,
  styleAliases: STYLE_ALIASES,
  uiStyleKitCssCompatibility: UI_STYLE_KIT_CSS_COMPATIBILITY,
  packs
};

await fs.copyFile(
  path.join(root, "src/ui-style-kit-icons.js"),
  path.join(root, "dist/ui-style-kit-icons.js")
);
await writeFile("dist/registry.json", JSON.stringify(registry, null, 2));
await writeFile("dist/registry.js", registryModule(registry));
await writeFile("dist/ui-style-kit-icons.d.ts", typeDefinitions(registry));
await writeFile("dist/ui-style-kit-icons.all.css", allPackCss(registry.packs));

console.log(`Built runtime, registry, types, and sprites for ${packs.length} packs.`);

function buildPackRecord(definition, manifest, sourcePath) {
  const coreIcons = coreIconIds.map((id) => {
    const manifestIcon = manifest.coreIcons.find((icon) => icon.id === id);
    const contractIcon = iconContract.get(id);

    if (!manifestIcon || !contractIcon) {
      throw new Error(`${definition.id} is missing required icon "${id}".`);
    }

    return {
      id,
      label: contractIcon.label,
      file: manifestIcon.file,
      symbol: manifestIcon.symbol,
      meaning: contractIcon.meaning
    };
  });
  const optionalIcons = (manifest.optionalIcons ?? []).map((icon) => ({
    id: icon.id,
    label: titleCase(icon.label ?? icon.id),
    file: icon.file,
    symbol: icon.symbol,
    meaning: `Optional ${definition.label} extension`
  }));
  const outputBase =
    sourcePath === "."
      ? "dist/ui-style-kit-icons"
      : `${sourcePath}/dist/${manifest.name}`;
  const inlineBase =
    sourcePath === "."
      ? "sprite/ui-style-kit-icons.inline.svg"
      : `${sourcePath}/sprite/${manifest.name}.inline.svg`;

  return {
    ...definition,
    sourcePath,
    name: manifest.name,
    version: packageJson.version,
    contractVersion: contract.schemaVersion,
    style: manifest.style,
    styleSource: manifest.styleSource,
    iconCount: coreIcons.length + optionalIcons.length,
    requiredIconCount: contract.requiredIconCount,
    optionalIconCount: optionalIcons.length,
    css: `${outputBase}.css`,
    sprite: `${outputBase}.svg`,
    inlineSprite: inlineBase,
    manifest: sourcePath === "." ? "manifest.json" : `${sourcePath}/manifest.json`,
    coreIcons,
    optionalIcons,
    aliases: contract.aliases
  };
}

async function buildSprites(pack) {
  const icons = [...pack.coreIcons, ...pack.optionalIcons];
  const symbols = [];
  const styles = new Set();

  for (const icon of icons) {
    const svgPath = path.join(root, pack.sourcePath, icon.file);
    const source = normalizeText(await fs.readFile(svgPath, "utf8"));
    const parts = extractSvgParts(source, svgPath);

    if (parts.style.trim()) {
      // Mixed-generation packs can use more than one authored SVG style layer.
      styles.add(parts.style.trim());
    }

    symbols.push(`<symbol id="${icon.symbol.slice(1)}" viewBox="${parts.viewBox}">
  <title>${escapeHtml(icon.label)}</title>
${indent(parts.inner, "  ")}
</symbol>`);
  }

  const sharedStyle = [...styles, spriteContrastStyle(pack)].join("\n");
  const external = `<svg xmlns="http://www.w3.org/2000/svg">
<style>
${sharedStyle}
</style>
<defs>
${symbols.join("\n")}
</defs>
</svg>`;
  const inline = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
<style>
${sharedStyle}
</style>
${symbols.join("\n")}
</svg>`;

  await writeFile(pack.sprite, external);
  await writeFile(pack.inlineSprite, inline);
}

function extractSvgParts(source, svgPath) {
  const openMatch = source.match(/<svg\b([^>]*)>/iu);
  const closeIndex = source.lastIndexOf("</svg>");

  if (!openMatch || closeIndex === -1) {
    throw new Error(`${svgPath} is not a complete SVG document.`);
  }

  const viewBox = openMatch[1].match(/\bviewBox="([^"]+)"/u)?.[1] ?? "0 0 256 256";
  const inner = source
    .slice((openMatch.index ?? 0) + openMatch[0].length, closeIndex)
    .replace(/<style\b[\s\S]*?<\/style>/iu, "")
    .replace(/<title\b[\s\S]*?<\/title>/iu, "")
    .replace(/<desc\b[\s\S]*?<\/desc>/iu, "")
    .trim();
  const style = source.match(/<style\b[^>]*>([\s\S]*?)<\/style>/iu)?.[1] ?? "";

  return {
    viewBox,
    inner,
    style
  };
}

function registryModule(registry) {
  return `export const packageName = ${JSON.stringify(registry.name)};
export const packageVersion = ${JSON.stringify(registry.version)};
export const contractVersion = ${JSON.stringify(registry.contractVersion)};
export const requiredIconCount = ${registry.requiredIconCount};
export const packCount = ${registry.packCount};
export const coreIconIds = ${JSON.stringify(registry.coreIconIds, null, 2)};
export const aliases = ${JSON.stringify(registry.aliases, null, 2)};
export const styleAliases = ${JSON.stringify(registry.styleAliases, null, 2)};
export const uiStyleKitCssCompatibility = ${JSON.stringify(registry.uiStyleKitCssCompatibility, null, 2)};
export const packs = ${JSON.stringify(registry.packs, null, 2)};
export const packRegistry = Object.fromEntries(packs.map((pack) => [pack.id, pack]));`;
}

function typeDefinitions(registry) {
  const iconNames = registry.coreIconIds.map((id) => JSON.stringify(id)).join(" | ");
  const packIds = registry.packs.map(({ id }) => JSON.stringify(id)).join(" | ");
  const themes = registry.uiStyleKitCssCompatibility.themes
    .map((theme) => JSON.stringify(theme))
    .join(" | ");
  const modes = registry.uiStyleKitCssCompatibility.modes
    .map((mode) => JSON.stringify(mode))
    .join(" | ");

  return `export type IconName = ${iconNames};
export type IconPack = ${packIds};
export type IconFrame = "auto" | "none" | "soft";
export type UiStyleKitCssTheme = ${themes};
export type UiStyleKitCssMode = ${modes};
export interface IconRecord {
  id: string;
  label: string;
  file: string;
  symbol: string;
  meaning: string;
}
export interface PackRecord {
  id: IconPack;
  label: string;
  sourcePath: string;
  uiStyle: string;
  layoutStyle: string;
  iconClass: string;
  spritePrefix: string;
  description: string;
  tags: string[];
  name: string;
  version: string;
  contractVersion: string;
  style: string;
  styleSource: string;
  iconCount: number;
  requiredIconCount: number;
  optionalIconCount: number;
  css: string;
  sprite: string;
  inlineSprite: string;
  manifest: string;
  coreIcons: IconRecord[];
  optionalIcons: IconRecord[];
  aliases: Record<string, IconName>;
}
export interface UiStyleKitCssCompatibility {
  packageName: "ui-style-kit-css";
  versionRange: string;
  themes: UiStyleKitCssTheme[];
  modes: UiStyleKitCssMode[];
  requiredRgbTokens: string[];
}
export interface IconLoadDetail {
  name: string;
  pack: IconPack;
  url: string;
}
export interface IconErrorDetail {
  name: string;
  pack: IconPack;
  error: unknown;
}
export declare const packageName: ${JSON.stringify(registry.name)};
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
export declare function resolveIconUrl(name: string, packOrStyle?: string, baseUrl?: string | URL): string;
export declare function iconNames(packOrStyle?: string, options?: { includeOptional?: boolean }): string[];
export declare class UiStyleIconElement extends HTMLElement { name: string; readonly pack: IconPack; frame: IconFrame; refresh(): void; }
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

function allPackCss(packsToImport) {
  const imports = [
    `@import url("./ui-style-kit-icons.css");`,
    ...packsToImport
      .filter((pack) => pack.id !== "system")
      .map((pack) => `@import url("../${pack.css}");`)
  ];

  return `/* UI Style Kit Icons: all pack token layers */\n${imports.join("\n")}`;
}

function spriteContrastStyle(pack) {
  const paintPrefixes = {
    system: "usk-i",
    "minimal-saas": "saas-i",
    bento: "bi",
    maximalist: "max-i",
    brutalism: "brutal-i",
    tactile: "tactile-i",
    neumorphism: "neo-i",
    "retro-glass": "rg-i",
    y2k: "y2k-i",
    cyberpunk: "cp-i",
    synthwave: "sw-i",
    "synthwave-webapp": "sw-i"
  };
  const paintPrefix = paintPrefixes[pack.id];
  const tokenPrefix = pack.iconClass.replace(/-icon$/u, "");
  const lineRoles =
    pack.id === "brutalism"
      ? [
          ["line", "border", "border", 28],
          ["line-2", "accent", "accent", 52],
          ["line-3", "secondary", "secondary", 52]
        ]
      : [
          ["line", "primary", "primary", 58],
          ["line-2", "secondary", "secondary", 52],
          ["line-3", "accent", "accent", 52]
        ];
  const fillRoles = [
    ["primary", "primary", 58],
    ["secondary", "secondary", 52],
    ["accent", "accent", 52],
    ["success", "success", 52],
    ["warning", "warning", 52],
    ["danger", "danger", 52]
  ];
  const rgbFallbacks = {
    primary: "37 99 235",
    secondary: "100 116 139",
    accent: "14 165 233",
    success: "22 163 74",
    warning: "202 138 4",
    danger: "220 38 38",
    border: "100 116 139",
    muted: "100 116 139"
  };
  const colorRule = (className, tokenRole, rgbRole, percentage, additions = []) => {
    const roleFallback = rgbFallbacks[rgbRole];
    const token = `--${tokenPrefix}-icon-${tokenRole}`;
    const rgbToken =
      rgbRole === "border"
        ? "--usk-border-rgb"
        : rgbRole === "muted"
          ? "--usk-text-muted-rgb"
          : `--usk-${rgbRole}-rgb`;
    const declarations = [
      `stroke:var(${token},rgb(var(${rgbToken},${roleFallback})))`,
      `stroke:color-mix(in srgb,var(${token},rgb(var(${rgbToken},${roleFallback}))) ${percentage}%,currentColor ${100 - percentage}%)`,
      ...additions
    ];

    return `.${paintPrefix}-${className}{${declarations.join(";")}}`;
  };
  const lineRules = lineRoles.map(([className, tokenRole, rgbRole, percentage]) =>
    colorRule(className, tokenRole, rgbRole, percentage)
  );
  const fillWidth =
    pack.id === "brutalism"
      ? []
      : [
          "stroke-width:var(--usk-icon-fill-keyline-width,3.5)",
          "stroke-linejoin:round"
        ];
  const fillRules = fillRoles.map(([className, role, percentage]) =>
    colorRule(className, role, role, percentage, fillWidth)
  );
  const mutedRule = colorRule("muted", "muted", "muted", 38);
  const bgStrongRule = colorRule("bg-strong", "border", "border", 28, [
    "stroke-width:var(--usk-icon-keyline-width,3.5)",
    "stroke-linejoin:round"
  ]);

  return `/* UI Style Kit Icons: generated sprite contrast guard */
${[...lineRules, ...fillRules, mutedRule, bgStrongRule].join("\n")}`;
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function writeFile(relativePath, text) {
  const file = path.join(root, relativePath);

  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${normalizeText(text)}\n`);
}

function normalizePath(value) {
  return value.replaceAll("\\", "/");
}

function normalizeText(value) {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function indent(value, prefix) {
  return value
    .split("\n")
    .map((line) => (line ? `${prefix}${line}` : ""))
    .join("\n");
}

function titleCase(value) {
  return String(value)
    .split(/[-\s]+/u)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
