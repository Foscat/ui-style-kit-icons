export type IconName = "home" | "dashboard" | "browser" | "search" | "user" | "users" | "settings" | "bell" | "message" | "mail" | "calendar" | "upload" | "download" | "folder" | "file" | "image" | "video" | "camera" | "database" | "server" | "api" | "lock" | "shield" | "key" | "chart" | "activity" | "credit-card" | "wallet" | "cart" | "invoice" | "tax" | "login" | "logout" | "edit" | "trash" | "plus" | "minus" | "filter" | "menu" | "code" | "terminal" | "rocket" | "bug" | "help" | "link" | "cloud" | "globe" | "warning" | "scan" | "network" | "cpu" | "layers" | "eye" | "grid" | "module" | "stack" | "tile" | "phone" | "palette" | "heart" | "star" | "target" | "megaphone" | "cursor";
export type IconPack = "system" | "minimal-saas" | "bento" | "maximalist" | "brutalism" | "tactile" | "neumorphism" | "retro-glass" | "y2k" | "cyberpunk" | "synthwave" | "synthwave-webapp";
export type IconFrame = "auto" | "none" | "soft";
export interface IconRecord { id: string; label: string; file: string; symbol: string; meaning: string; optional?: boolean; }
export interface PackRecord { id: IconPack; label: string; description: string; sourcePath: string; uiStyle: string; layoutStyle: string; iconClass: string; spritePrefix: string; iconCount: number; requiredIconCount: number; optionalIconCount: number; coreIcons: IconRecord[]; optionalIcons: IconRecord[]; }
export declare const coreIconIds: IconName[];
export declare const aliases: Record<string, IconName>;
export declare const styleAliases: Record<string, IconPack>;
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
