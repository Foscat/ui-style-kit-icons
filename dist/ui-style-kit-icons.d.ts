export type IconName = "home" | "dashboard" | "browser" | "search" | "user" | "users" | "settings" | "bell" | "message" | "mail" | "calendar" | "upload" | "download" | "folder" | "file" | "image" | "video" | "camera" | "database" | "server" | "api" | "lock" | "shield" | "key" | "chart" | "activity" | "credit-card" | "wallet" | "cart" | "invoice" | "tax" | "login" | "logout" | "edit" | "trash" | "plus" | "minus" | "filter" | "menu" | "code" | "terminal" | "rocket" | "bug" | "help" | "link" | "cloud" | "globe" | "warning" | "scan" | "network" | "cpu" | "layers" | "eye" | "grid" | "module" | "stack" | "tile" | "phone" | "palette" | "heart" | "star" | "target" | "megaphone" | "cursor";
export type IconPack = "system" | "minimal-saas" | "bento" | "maximalist" | "brutalism" | "tactile" | "neumorphism" | "retro-glass" | "y2k" | "cyberpunk" | "synthwave" | "synthwave-webapp";
export type IconFrame = "auto" | "none" | "soft";
export type UiStyleKitCssTheme = "midnight-gold" | "ocean-steel" | "forest-moss" | "sunset-ember" | "royal-plum" | "graphite-cyan" | "desert-sage" | "rose-quartz" | "cyber-lime" | "arctic-indigo";
export type UiStyleKitCssMode = "light" | "dark" | "contrast";
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
export declare const packageName: "ui-style-kit-icons";
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
}
