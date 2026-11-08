export type IconName = "home" | "search" | "user" | "folder" | "settings" | "bell" | "mail" | "calendar" | "download" | "trash" | "warning" | "link" | "menu" | "more-horizontal" | "plus" | "minus" | "check" | "close" | "arrow-left" | "arrow-right" | "arrow-up" | "arrow-down" | "chevron-left" | "chevron-right" | "chevron-up" | "chevron-down" | "edit" | "upload" | "filter" | "grid" | "eye" | "lock" | "info" | "success" | "error" | "help" | "checkbox" | "checkbox-checked" | "checkbox-indeterminate" | "radio" | "radio-selected" | "eye-off" | "refresh" | "external-link" | "undo" | "redo" | "toggle-off" | "toggle-on" | "file" | "copy" | "save" | "image" | "camera" | "play" | "pause" | "stop" | "skip-back" | "skip-forward" | "volume" | "volume-off" | "microphone" | "attachment" | "print" | "share" | "cart" | "credit-card" | "receipt" | "tag" | "package" | "warehouse" | "truck" | "map-pin" | "car" | "wrench" | "barcode" | "clipboard" | "chart-bar" | "users" | "briefcase" | "building" | "dashboard" | "list" | "table" | "sort" | "clock" | "history" | "spinner" | "log-in" | "log-out" | "shield-check" | "key" | "phone" | "map" | "layers" | "locate" | "shelf" | "bin-location" | "vin-scan" | "shift" | "timesheet" | "payroll" | "calendar-range" | "invoice" | "refund" | "payout" | "wallet" | "browser" | "message" | "video" | "database" | "server" | "api" | "shield" | "activity" | "tax" | "code" | "terminal" | "rocket" | "bug" | "cloud" | "globe" | "scan" | "network" | "cpu" | "module" | "stack" | "tile" | "palette" | "heart" | "star" | "target" | "megaphone" | "cursor" | "expand" | "archive" | "keyboard" | "move" | "send" | "hand" | "zoom-in" | "zoom-out" | "wifi-off" | "unlock" | "paint-brush" | "door-open" | "paint-bucket" | "pen-tool" | "rectangle" | "clipboard-check" | "package-check" | "package-x" | "boxes" | "gauge" | "images" | "recycle" | "contrast" | "moon" | "sun" | "replace" | "shopping-bag" | "image-off" | "sparkles" | "file-text" | "ban" | "banknote" | "parking" | "scale" | "shield-alert" | "signpost" | "monitor" | "smartphone" | "tablet" | "ste-workforce" | "ste-payments";
export type IconPack = "minimal-saas" | "bento" | "maximalist" | "bauhaus" | "tactile" | "brutalism" | "cyberpunk" | "y2k" | "retro-glass" | "editorial-luxe" | "organic-modern" | "industrial-utility" | "technical-blueprint" | "art-deco" | "clay" | "data-terminal" | "paper-editorial" | "neo-noir" | "neumorphism" | "retrofuturism";
export type IconVariant = "themed" | "monochrome";
export type UiStyleKitCssTheme = "midnight-gold" | "ocean-steel" | "forest-moss" | "sunset-ember" | "royal-plum" | "graphite-cyan" | "desert-sage" | "rose-quartz" | "cyber-lime" | "arctic-indigo" | "chrome-navy" | "recycled-emerald" | "industrial-orange" | "performance-red" | "heritage-brass" | "service-blue-red" | "newsprint-crimson" | "foundry-amber" | "soft-orchid" | "electric-noir" | "signal-yellow" | "botanical-green" | "cobalt-electric" | "stone-graphite" | "walnut-clay";
export type UiStyleKitCssMode = "light" | "dark" | "contrast";
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
}
