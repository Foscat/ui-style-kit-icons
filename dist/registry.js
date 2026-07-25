export const coreIconIds = [
  "home",
  "dashboard",
  "browser",
  "search",
  "user",
  "users",
  "settings",
  "bell",
  "message",
  "mail",
  "calendar",
  "upload",
  "download",
  "folder",
  "file",
  "image",
  "video",
  "camera",
  "database",
  "server",
  "api",
  "lock",
  "shield",
  "key",
  "chart",
  "activity",
  "credit-card",
  "wallet",
  "cart",
  "invoice",
  "tax",
  "login",
  "logout",
  "edit",
  "trash",
  "plus",
  "minus",
  "filter",
  "menu",
  "code",
  "terminal",
  "rocket",
  "bug",
  "help",
  "link",
  "cloud",
  "globe",
  "warning",
  "scan",
  "network",
  "cpu",
  "layers",
  "eye",
  "grid",
  "module",
  "stack",
  "tile",
  "phone",
  "palette",
  "heart",
  "star",
  "target",
  "megaphone",
  "cursor"
];
export const aliases = {
  "chat": "message",
  "credit": "credit-card",
  "card": "credit-card",
  "media-image": "image",
  "media-video": "video",
  "brush": "palette",
  "sticker": "star",
  "stamp": "target",
  "flag": "target",
  "bolt": "activity",
  "lightning": "activity"
};
export const styleAliases = {
  "": "system",
  "system": "system",
  "default": "system",
  "minimal-saas": "minimal-saas",
  "saas": "minimal-saas",
  "bento": "bento",
  "maximalist": "maximalist",
  "playful": "maximalist",
  "brutalism": "brutalism",
  "brutalist": "brutalism",
  "tactile": "tactile",
  "skeuomorphic": "tactile",
  "skeuomorphism": "tactile",
  "neumorphism": "neumorphism",
  "neomorphic": "neumorphism",
  "soft-ui": "neumorphism",
  "retro-glass": "retro-glass",
  "glassmorphism": "retro-glass",
  "y2k": "y2k",
  "cyberpunk": "cyberpunk",
  "retrofuturism": "synthwave",
  "retro-futurism": "synthwave",
  "synthwave": "synthwave",
  "synthwave-webapp": "synthwave-webapp",
  "webapp-synthwave": "synthwave-webapp",
  "bauhaus": "system"
};
export const packs = [
  {
    "id": "system",
    "label": "System",
    "sourcePath": ".",
    "uiStyle": "minimal-saas",
    "layoutStyle": "minimal-saas",
    "iconClass": "usk-icon",
    "spritePrefix": "usk-icon",
    "description": "The neutral contract reference and fallback pack.",
    "tags": [
      "core",
      "neutral",
      "fallback"
    ],
    "name": "ui-style-kit-icons",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "system",
    "styleSource": "UI Style Kit",
    "iconCount": 64,
    "requiredIconCount": 64,
    "optionalIconCount": 0,
    "css": "dist/ui-style-kit-icons.css",
    "sprite": "dist/ui-style-kit-icons.svg",
    "inlineSprite": "sprite/ui-style-kit-icons.inline.svg",
    "manifest": "manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#usk-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#usk-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#usk-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#usk-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#usk-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#usk-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#usk-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#usk-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#usk-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#usk-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#usk-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#usk-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#usk-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#usk-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#usk-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#usk-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#usk-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#usk-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#usk-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#usk-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#usk-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#usk-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#usk-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#usk-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#usk-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#usk-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#usk-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#usk-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#usk-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#usk-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#usk-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#usk-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#usk-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#usk-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#usk-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#usk-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#usk-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#usk-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#usk-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#usk-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#usk-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#usk-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#usk-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#usk-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#usk-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#usk-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#usk-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#usk-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#usk-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#usk-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#usk-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#usk-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#usk-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#usk-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#usk-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#usk-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#usk-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#usk-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#usk-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#usk-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#usk-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#usk-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#usk-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#usk-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "minimal-saas",
    "label": "Minimal SaaS",
    "sourcePath": "packs/minimal-saas",
    "uiStyle": "minimal-saas",
    "layoutStyle": "minimal-saas",
    "iconClass": "saas-icon",
    "spritePrefix": "saas-icon",
    "description": "Quiet product-console icons with crisp geometry and restrained depth.",
    "tags": [
      "saas",
      "product",
      "minimal"
    ],
    "name": "minimal-saas-ui-style-icons",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "minimal-saas",
    "styleSource": "Quiet Product Console",
    "iconCount": 64,
    "requiredIconCount": 64,
    "optionalIconCount": 0,
    "css": "packs/minimal-saas/dist/minimal-saas-ui-style-icons.css",
    "sprite": "packs/minimal-saas/dist/minimal-saas-ui-style-icons.svg",
    "inlineSprite": "packs/minimal-saas/sprite/minimal-saas-ui-style-icons.inline.svg",
    "manifest": "packs/minimal-saas/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#saas-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#saas-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#saas-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#saas-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#saas-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#saas-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#saas-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#saas-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#saas-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#saas-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#saas-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#saas-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#saas-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#saas-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#saas-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#saas-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#saas-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#saas-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#saas-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#saas-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#saas-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#saas-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#saas-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#saas-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#saas-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#saas-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#saas-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#saas-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#saas-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#saas-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#saas-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#saas-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#saas-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#saas-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#saas-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#saas-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#saas-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#saas-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#saas-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#saas-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#saas-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#saas-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#saas-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#saas-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#saas-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#saas-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#saas-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#saas-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#saas-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#saas-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#saas-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#saas-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#saas-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#saas-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#saas-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#saas-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#saas-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#saas-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#saas-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#saas-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#saas-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#saas-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#saas-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#saas-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "bento",
    "label": "Bento",
    "sourcePath": "packs/bento",
    "uiStyle": "bento",
    "layoutStyle": "bento",
    "iconClass": "bento-icon",
    "spritePrefix": "bento-icon",
    "description": "Modular, tile-minded artwork built for compact bento interfaces.",
    "tags": [
      "bento",
      "modular",
      "dashboard"
    ],
    "name": "bento-ui-style-icons",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "bento",
    "styleSource": "Bento",
    "iconCount": 67,
    "requiredIconCount": 64,
    "optionalIconCount": 3,
    "css": "packs/bento/dist/bento-ui-style-icons.css",
    "sprite": "packs/bento/dist/bento-ui-style-icons.svg",
    "inlineSprite": "packs/bento/sprite/bento-ui-style-icons.inline.svg",
    "manifest": "packs/bento/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#bento-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#bento-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#bento-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#bento-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#bento-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#bento-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#bento-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#bento-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#bento-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#bento-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#bento-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#bento-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#bento-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#bento-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#bento-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#bento-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#bento-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#bento-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#bento-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#bento-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#bento-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#bento-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#bento-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#bento-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#bento-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#bento-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#bento-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#bento-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#bento-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#bento-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#bento-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#bento-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#bento-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#bento-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#bento-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#bento-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#bento-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#bento-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#bento-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#bento-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#bento-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#bento-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#bento-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#bento-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#bento-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#bento-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#bento-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#bento-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#bento-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#bento-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#bento-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#bento-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#bento-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#bento-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#bento-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#bento-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#bento-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#bento-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#bento-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#bento-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#bento-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#bento-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#bento-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#bento-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [
      {
        "id": "mosaic",
        "label": "Mosaic",
        "file": "icons/mosaic.svg",
        "symbol": "#bento-icon-mosaic",
        "meaning": "Optional Bento extension"
      },
      {
        "id": "split",
        "label": "Split",
        "file": "icons/split.svg",
        "symbol": "#bento-icon-split",
        "meaning": "Optional Bento extension"
      },
      {
        "id": "widget",
        "label": "Widget",
        "file": "icons/widget.svg",
        "symbol": "#bento-icon-widget",
        "meaning": "Optional Bento extension"
      }
    ],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "maximalist",
    "label": "Maximalist / Playful",
    "sourcePath": "packs/maximalist",
    "uiStyle": "maximalist",
    "layoutStyle": "maximalist",
    "iconClass": "max-icon",
    "spritePrefix": "max-icon",
    "description": "Loud, layered, color-forward icons for expressive product surfaces.",
    "tags": [
      "maximalist",
      "playful",
      "colorful"
    ],
    "name": "maximalist-ui-style-icons",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "maximalist",
    "styleSource": "Party Dashboard",
    "iconCount": 64,
    "requiredIconCount": 64,
    "optionalIconCount": 0,
    "css": "packs/maximalist/dist/maximalist-ui-style-icons.css",
    "sprite": "packs/maximalist/dist/maximalist-ui-style-icons.svg",
    "inlineSprite": "packs/maximalist/sprite/maximalist-ui-style-icons.inline.svg",
    "manifest": "packs/maximalist/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#max-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#max-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#max-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#max-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#max-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#max-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#max-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#max-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#max-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#max-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#max-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#max-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#max-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#max-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#max-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#max-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#max-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#max-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#max-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#max-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#max-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#max-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#max-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#max-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#max-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#max-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#max-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#max-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#max-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#max-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#max-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#max-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#max-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#max-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#max-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#max-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#max-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#max-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#max-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#max-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#max-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#max-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#max-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#max-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#max-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#max-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#max-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#max-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#max-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#max-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#max-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#max-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#max-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#max-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#max-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#max-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#max-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#max-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#max-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#max-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#max-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#max-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#max-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#max-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "brutalism",
    "label": "Brutalism",
    "sourcePath": "packs/brutalism",
    "uiStyle": "brutalism",
    "layoutStyle": "brutalism",
    "iconClass": "brutal-icon",
    "spritePrefix": "brutal-icon",
    "description": "Hard-edged symbols with heavy outlines, blunt contrast, and offset weight.",
    "tags": [
      "brutalism",
      "bold",
      "graphic"
    ],
    "name": "brutalism-ui-style-icons",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "brutalism",
    "styleSource": "Brutalism",
    "iconCount": 64,
    "requiredIconCount": 64,
    "optionalIconCount": 0,
    "css": "packs/brutalism/dist/brutalism-ui-style-icons.css",
    "sprite": "packs/brutalism/dist/brutalism-ui-style-icons.svg",
    "inlineSprite": "packs/brutalism/sprite/brutalism-ui-style-icons.inline.svg",
    "manifest": "packs/brutalism/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#brutal-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#brutal-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#brutal-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#brutal-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#brutal-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#brutal-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#brutal-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#brutal-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#brutal-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#brutal-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#brutal-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#brutal-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#brutal-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#brutal-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#brutal-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#brutal-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#brutal-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#brutal-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#brutal-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#brutal-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#brutal-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#brutal-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#brutal-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#brutal-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#brutal-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#brutal-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#brutal-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#brutal-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#brutal-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#brutal-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#brutal-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#brutal-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#brutal-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#brutal-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#brutal-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#brutal-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#brutal-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#brutal-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#brutal-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#brutal-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#brutal-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#brutal-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#brutal-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#brutal-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#brutal-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#brutal-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#brutal-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#brutal-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#brutal-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#brutal-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#brutal-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#brutal-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#brutal-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#brutal-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#brutal-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#brutal-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#brutal-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#brutal-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#brutal-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#brutal-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#brutal-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#brutal-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#brutal-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#brutal-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "tactile",
    "label": "Skeuomorphic / Tactile",
    "sourcePath": "packs/tactile",
    "uiStyle": "tactile",
    "layoutStyle": "tactile",
    "iconClass": "tactile-icon",
    "spritePrefix": "tactile-icon",
    "description": "Raised workbench controls with material cues and physical affordance.",
    "tags": [
      "skeuomorphic",
      "tactile",
      "dimensional"
    ],
    "name": "tactile-ui-style-icons",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "tactile",
    "styleSource": "Raised Workbench",
    "iconCount": 64,
    "requiredIconCount": 64,
    "optionalIconCount": 0,
    "css": "packs/tactile/dist/tactile-ui-style-icons.css",
    "sprite": "packs/tactile/dist/tactile-ui-style-icons.svg",
    "inlineSprite": "packs/tactile/sprite/tactile-ui-style-icons.inline.svg",
    "manifest": "packs/tactile/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#tactile-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#tactile-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#tactile-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#tactile-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#tactile-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#tactile-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#tactile-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#tactile-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#tactile-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#tactile-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#tactile-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#tactile-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#tactile-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#tactile-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#tactile-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#tactile-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#tactile-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#tactile-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#tactile-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#tactile-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#tactile-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#tactile-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#tactile-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#tactile-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#tactile-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#tactile-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#tactile-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#tactile-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#tactile-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#tactile-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#tactile-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#tactile-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#tactile-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#tactile-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#tactile-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#tactile-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#tactile-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#tactile-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#tactile-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#tactile-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#tactile-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#tactile-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#tactile-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#tactile-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#tactile-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#tactile-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#tactile-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#tactile-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#tactile-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#tactile-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#tactile-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#tactile-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#tactile-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#tactile-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#tactile-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#tactile-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#tactile-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#tactile-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#tactile-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#tactile-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#tactile-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#tactile-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#tactile-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#tactile-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "neumorphism",
    "label": "Neumorphism",
    "sourcePath": "packs/neumorphism",
    "uiStyle": "neumorphism",
    "layoutStyle": "neumorphism",
    "iconClass": "neo-icon",
    "spritePrefix": "neo-icon",
    "description": "Softly extruded icons shaped by paired light and dark shadows.",
    "tags": [
      "neumorphism",
      "soft-ui",
      "embossed"
    ],
    "name": "neumorphism-ui-style-icons",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "neumorphism",
    "styleSource": "Soft Extrusion",
    "iconCount": 64,
    "requiredIconCount": 64,
    "optionalIconCount": 0,
    "css": "packs/neumorphism/dist/neumorphism-ui-style-icons.css",
    "sprite": "packs/neumorphism/dist/neumorphism-ui-style-icons.svg",
    "inlineSprite": "packs/neumorphism/sprite/neumorphism-ui-style-icons.inline.svg",
    "manifest": "packs/neumorphism/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#neo-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#neo-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#neo-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#neo-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#neo-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#neo-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#neo-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#neo-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#neo-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#neo-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#neo-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#neo-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#neo-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#neo-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#neo-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#neo-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#neo-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#neo-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#neo-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#neo-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#neo-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#neo-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#neo-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#neo-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#neo-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#neo-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#neo-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#neo-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#neo-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#neo-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#neo-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#neo-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#neo-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#neo-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#neo-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#neo-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#neo-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#neo-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#neo-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#neo-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#neo-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#neo-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#neo-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#neo-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#neo-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#neo-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#neo-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#neo-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#neo-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#neo-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#neo-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#neo-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#neo-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#neo-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#neo-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#neo-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#neo-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#neo-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#neo-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#neo-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#neo-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#neo-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#neo-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#neo-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "retro-glass",
    "label": "Retro Glass",
    "sourcePath": "packs/retro-glass",
    "uiStyle": "retro-glass",
    "layoutStyle": "retro-glass",
    "iconClass": "rg-icon",
    "spritePrefix": "rg-icon",
    "description": "Glassmorphic icons with translucent layers, luminous edges, and depth.",
    "tags": [
      "glassmorphism",
      "retro",
      "translucent"
    ],
    "name": "retro-glass-ui-style-icons",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "retro-glass",
    "styleSource": "Retro Glass",
    "iconCount": 73,
    "requiredIconCount": 64,
    "optionalIconCount": 9,
    "css": "packs/retro-glass/dist/retro-glass-ui-style-icons.css",
    "sprite": "packs/retro-glass/dist/retro-glass-ui-style-icons.svg",
    "inlineSprite": "packs/retro-glass/sprite/retro-glass-ui-style-icons.inline.svg",
    "manifest": "packs/retro-glass/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#rg-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#rg-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#rg-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#rg-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#rg-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#rg-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#rg-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#rg-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#rg-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#rg-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#rg-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#rg-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#rg-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#rg-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#rg-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#rg-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#rg-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#rg-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#rg-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#rg-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#rg-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#rg-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#rg-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#rg-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#rg-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#rg-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#rg-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#rg-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#rg-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#rg-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#rg-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#rg-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#rg-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#rg-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#rg-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#rg-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#rg-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#rg-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#rg-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#rg-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#rg-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#rg-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#rg-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#rg-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#rg-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#rg-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#rg-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#rg-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#rg-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#rg-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#rg-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#rg-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#rg-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#rg-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#rg-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#rg-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#rg-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#rg-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#rg-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#rg-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#rg-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#rg-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#rg-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#rg-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [
      {
        "id": "aurora",
        "label": "Aurora",
        "file": "icons/aurora.svg",
        "symbol": "#rg-icon-aurora",
        "meaning": "Optional Retro Glass extension"
      },
      {
        "id": "cube",
        "label": "Cube",
        "file": "icons/cube.svg",
        "symbol": "#rg-icon-cube",
        "meaning": "Optional Retro Glass extension"
      },
      {
        "id": "droplet",
        "label": "Droplet",
        "file": "icons/droplet.svg",
        "symbol": "#rg-icon-droplet",
        "meaning": "Optional Retro Glass extension"
      },
      {
        "id": "lens",
        "label": "Lens",
        "file": "icons/lens.svg",
        "symbol": "#rg-icon-lens",
        "meaning": "Optional Retro Glass extension"
      },
      {
        "id": "orb",
        "label": "Orb",
        "file": "icons/orb.svg",
        "symbol": "#rg-icon-orb",
        "meaning": "Optional Retro Glass extension"
      },
      {
        "id": "pane",
        "label": "Pane",
        "file": "icons/pane.svg",
        "symbol": "#rg-icon-pane",
        "meaning": "Optional Retro Glass extension"
      },
      {
        "id": "prism",
        "label": "Prism",
        "file": "icons/prism.svg",
        "symbol": "#rg-icon-prism",
        "meaning": "Optional Retro Glass extension"
      },
      {
        "id": "sparkle",
        "label": "Sparkle",
        "file": "icons/sparkle.svg",
        "symbol": "#rg-icon-sparkle",
        "meaning": "Optional Retro Glass extension"
      },
      {
        "id": "window-stack",
        "label": "Window Stack",
        "file": "icons/window-stack.svg",
        "symbol": "#rg-icon-window-stack",
        "meaning": "Optional Retro Glass extension"
      }
    ],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "y2k",
    "label": "Y2K",
    "sourcePath": "packs/y2k",
    "uiStyle": "y2k",
    "layoutStyle": "y2k",
    "iconClass": "y2k-icon",
    "spritePrefix": "y2k-icon",
    "description": "Optimistic turn-of-the-millennium chrome, gloss, bubbles, and gadgets.",
    "tags": [
      "y2k",
      "chrome",
      "nostalgic"
    ],
    "name": "y2k-ui-style-icons",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "y2k",
    "styleSource": "Y2K",
    "iconCount": 69,
    "requiredIconCount": 64,
    "optionalIconCount": 5,
    "css": "packs/y2k/dist/y2k-ui-style-icons.css",
    "sprite": "packs/y2k/dist/y2k-ui-style-icons.svg",
    "inlineSprite": "packs/y2k/sprite/y2k-ui-style-icons.inline.svg",
    "manifest": "packs/y2k/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#y2k-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#y2k-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#y2k-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#y2k-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#y2k-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#y2k-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#y2k-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#y2k-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#y2k-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#y2k-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#y2k-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#y2k-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#y2k-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#y2k-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#y2k-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#y2k-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#y2k-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#y2k-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#y2k-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#y2k-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#y2k-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#y2k-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#y2k-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#y2k-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#y2k-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#y2k-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#y2k-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#y2k-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#y2k-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#y2k-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#y2k-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#y2k-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#y2k-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#y2k-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#y2k-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#y2k-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#y2k-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#y2k-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#y2k-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#y2k-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#y2k-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#y2k-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#y2k-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#y2k-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#y2k-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#y2k-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#y2k-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#y2k-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#y2k-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#y2k-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#y2k-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#y2k-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#y2k-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#y2k-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#y2k-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#y2k-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#y2k-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#y2k-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#y2k-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#y2k-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#y2k-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#y2k-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#y2k-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#y2k-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [
      {
        "id": "cd",
        "label": "Cd",
        "file": "icons/cd.svg",
        "symbol": "#y2k-icon-cd",
        "meaning": "Optional Y2K extension"
      },
      {
        "id": "floppy",
        "label": "Floppy",
        "file": "icons/floppy.svg",
        "symbol": "#y2k-icon-floppy",
        "meaning": "Optional Y2K extension"
      },
      {
        "id": "gamepad",
        "label": "Gamepad",
        "file": "icons/gamepad.svg",
        "symbol": "#y2k-icon-gamepad",
        "meaning": "Optional Y2K extension"
      },
      {
        "id": "music",
        "label": "Music",
        "file": "icons/music.svg",
        "symbol": "#y2k-icon-music",
        "meaning": "Optional Y2K extension"
      },
      {
        "id": "sparkle",
        "label": "Sparkle",
        "file": "icons/sparkle.svg",
        "symbol": "#y2k-icon-sparkle",
        "meaning": "Optional Y2K extension"
      }
    ],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "cyberpunk",
    "label": "Cyberpunk",
    "sourcePath": "packs/cyberpunk",
    "uiStyle": "cyberpunk",
    "layoutStyle": "cyberpunk",
    "iconClass": "cp-icon",
    "spritePrefix": "cp-icon",
    "description": "Dense neon interface glyphs with gritty terminal and HUD influence.",
    "tags": [
      "cyberpunk",
      "neon",
      "hud"
    ],
    "name": "cyberpunk-icon-pack",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "cyberpunk",
    "styleSource": "Cyberpunk",
    "iconCount": 64,
    "requiredIconCount": 64,
    "optionalIconCount": 0,
    "css": "packs/cyberpunk/dist/cyberpunk-icon-pack.css",
    "sprite": "packs/cyberpunk/dist/cyberpunk-icon-pack.svg",
    "inlineSprite": "packs/cyberpunk/sprite/cyberpunk-icon-pack.inline.svg",
    "manifest": "packs/cyberpunk/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#cp-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#cp-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#cp-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#cp-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#cp-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#cp-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#cp-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#cp-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#cp-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#cp-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#cp-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#cp-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#cp-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#cp-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#cp-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#cp-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#cp-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#cp-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#cp-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#cp-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#cp-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#cp-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#cp-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#cp-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#cp-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#cp-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#cp-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#cp-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#cp-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#cp-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#cp-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#cp-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#cp-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#cp-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#cp-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#cp-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#cp-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#cp-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#cp-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#cp-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#cp-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#cp-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#cp-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#cp-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#cp-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#cp-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#cp-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#cp-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#cp-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#cp-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#cp-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#cp-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#cp-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#cp-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#cp-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#cp-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#cp-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#cp-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#cp-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#cp-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#cp-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#cp-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#cp-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#cp-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "synthwave",
    "label": "Synthwave",
    "sourcePath": "packs/synthwave",
    "uiStyle": "retrofuturism",
    "layoutStyle": "synthwave",
    "iconClass": "sw-icon",
    "spritePrefix": "sw-icon",
    "description": "Bright retro-future symbols inspired by 1980s computing optimism.",
    "tags": [
      "synthwave",
      "retrofuturism",
      "neon"
    ],
    "name": "synthwave-icon-pack",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "synthwave",
    "styleSource": "Synthwave",
    "iconCount": 78,
    "requiredIconCount": 64,
    "optionalIconCount": 14,
    "css": "packs/synthwave/dist/synthwave-icon-pack.css",
    "sprite": "packs/synthwave/dist/synthwave-icon-pack.svg",
    "inlineSprite": "packs/synthwave/sprite/synthwave-icon-pack.inline.svg",
    "manifest": "packs/synthwave/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#sw-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#sw-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#sw-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#sw-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#sw-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#sw-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#sw-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#sw-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#sw-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#sw-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#sw-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#sw-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#sw-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#sw-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#sw-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#sw-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#sw-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#sw-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#sw-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#sw-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#sw-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#sw-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#sw-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#sw-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#sw-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#sw-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#sw-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#sw-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#sw-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#sw-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#sw-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#sw-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#sw-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#sw-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#sw-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#sw-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#sw-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#sw-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#sw-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#sw-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#sw-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#sw-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#sw-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#sw-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#sw-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#sw-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#sw-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#sw-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#sw-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#sw-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#sw-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#sw-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#sw-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#sw-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#sw-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#sw-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#sw-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#sw-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#sw-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#sw-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#sw-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#sw-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#sw-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#sw-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [
      {
        "id": "cassette",
        "label": "Cassette",
        "file": "icons/cassette.svg",
        "symbol": "#sw-icon-cassette",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "chrome-palm",
        "label": "Chrome Palm",
        "file": "icons/chrome-palm.svg",
        "symbol": "#sw-icon-chrome-palm",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "circuit",
        "label": "Circuit",
        "file": "icons/circuit.svg",
        "symbol": "#sw-icon-circuit",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "crystal",
        "label": "Crystal",
        "file": "icons/crystal.svg",
        "symbol": "#sw-icon-crystal",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "headphones",
        "label": "Headphones",
        "file": "icons/headphones.svg",
        "symbol": "#sw-icon-headphones",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "horizon-grid",
        "label": "Horizon Grid",
        "file": "icons/horizon-grid.svg",
        "symbol": "#sw-icon-horizon-grid",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "keyboard",
        "label": "Keyboard",
        "file": "icons/keyboard.svg",
        "symbol": "#sw-icon-keyboard",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "lens",
        "label": "Lens",
        "file": "icons/lens.svg",
        "symbol": "#sw-icon-lens",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "neon-sunset",
        "label": "Neon Sunset",
        "file": "icons/neon-sunset.svg",
        "symbol": "#sw-icon-neon-sunset",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "night-drive",
        "label": "Night Drive",
        "file": "icons/night-drive.svg",
        "symbol": "#sw-icon-night-drive",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "orbit",
        "label": "Orbit",
        "file": "icons/orbit.svg",
        "symbol": "#sw-icon-orbit",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "skyline",
        "label": "Skyline",
        "file": "icons/skyline.svg",
        "symbol": "#sw-icon-skyline",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "starburst",
        "label": "Starburst",
        "file": "icons/starburst.svg",
        "symbol": "#sw-icon-starburst",
        "meaning": "Optional Synthwave extension"
      },
      {
        "id": "wave",
        "label": "Wave",
        "file": "icons/wave.svg",
        "symbol": "#sw-icon-wave",
        "meaning": "Optional Synthwave extension"
      }
    ],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  },
  {
    "id": "synthwave-webapp",
    "label": "Synthwave Web App",
    "sourcePath": "packs/synthwave-webapp",
    "uiStyle": "retrofuturism",
    "layoutStyle": "synthwave",
    "iconClass": "sw-icon",
    "spritePrefix": "sw-icon",
    "description": "A focused synthwave treatment for dashboards and common web workflows.",
    "tags": [
      "synthwave",
      "web-app",
      "dashboard"
    ],
    "name": "webapp-synthwave-icon-pack",
    "version": "0.2.0",
    "contractVersion": "0.1.0",
    "style": "synthwave",
    "styleSource": "Synthwave Web App",
    "iconCount": 64,
    "requiredIconCount": 64,
    "optionalIconCount": 0,
    "css": "packs/synthwave-webapp/dist/webapp-synthwave-icon-pack.css",
    "sprite": "packs/synthwave-webapp/dist/webapp-synthwave-icon-pack.svg",
    "inlineSprite": "packs/synthwave-webapp/sprite/webapp-synthwave-icon-pack.inline.svg",
    "manifest": "packs/synthwave-webapp/manifest.json",
    "coreIcons": [
      {
        "id": "home",
        "label": "Home",
        "file": "icons/home.svg",
        "symbol": "#sw-icon-home",
        "meaning": "Primary landing or app home destination"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "file": "icons/dashboard.svg",
        "symbol": "#sw-icon-dashboard",
        "meaning": "Main overview, admin home, metrics hub"
      },
      {
        "id": "browser",
        "label": "Browser",
        "file": "icons/browser.svg",
        "symbol": "#sw-icon-browser",
        "meaning": "Web page, app shell, external web surface"
      },
      {
        "id": "search",
        "label": "Search",
        "file": "icons/search.svg",
        "symbol": "#sw-icon-search",
        "meaning": "Find, query, inspect"
      },
      {
        "id": "user",
        "label": "User",
        "file": "icons/user.svg",
        "symbol": "#sw-icon-user",
        "meaning": "Single account, profile, member"
      },
      {
        "id": "users",
        "label": "Users",
        "file": "icons/users.svg",
        "symbol": "#sw-icon-users",
        "meaning": "Audience, team, members, group"
      },
      {
        "id": "settings",
        "label": "Settings",
        "file": "icons/settings.svg",
        "symbol": "#sw-icon-settings",
        "meaning": "Configuration and preferences"
      },
      {
        "id": "bell",
        "label": "Notifications",
        "file": "icons/bell.svg",
        "symbol": "#sw-icon-bell",
        "meaning": "Alerts, reminders, updates"
      },
      {
        "id": "message",
        "label": "Message",
        "file": "icons/message.svg",
        "symbol": "#sw-icon-message",
        "meaning": "Chat, comments, support conversation"
      },
      {
        "id": "mail",
        "label": "Email",
        "file": "icons/mail.svg",
        "symbol": "#sw-icon-mail",
        "meaning": "Email, inbox, message delivery"
      },
      {
        "id": "calendar",
        "label": "Calendar",
        "file": "icons/calendar.svg",
        "symbol": "#sw-icon-calendar",
        "meaning": "Dates, schedule, publishing plan"
      },
      {
        "id": "upload",
        "label": "Upload",
        "file": "icons/upload.svg",
        "symbol": "#sw-icon-upload",
        "meaning": "Send local content into the app"
      },
      {
        "id": "download",
        "label": "Download",
        "file": "icons/download.svg",
        "symbol": "#sw-icon-download",
        "meaning": "Export or retrieve content"
      },
      {
        "id": "folder",
        "label": "Folder",
        "file": "icons/folder.svg",
        "symbol": "#sw-icon-folder",
        "meaning": "Collection, directory, grouped files"
      },
      {
        "id": "file",
        "label": "File",
        "file": "icons/file.svg",
        "symbol": "#sw-icon-file",
        "meaning": "Single document or generic file"
      },
      {
        "id": "image",
        "label": "Image",
        "file": "icons/image.svg",
        "symbol": "#sw-icon-image",
        "meaning": "Photo, visual asset, thumbnail"
      },
      {
        "id": "video",
        "label": "Video",
        "file": "icons/video.svg",
        "symbol": "#sw-icon-video",
        "meaning": "Video media, player, reel"
      },
      {
        "id": "camera",
        "label": "Camera",
        "file": "icons/camera.svg",
        "symbol": "#sw-icon-camera",
        "meaning": "Capture, photo/video source"
      },
      {
        "id": "database",
        "label": "Database",
        "file": "icons/database.svg",
        "symbol": "#sw-icon-database",
        "meaning": "Persistent data store"
      },
      {
        "id": "server",
        "label": "Server",
        "file": "icons/server.svg",
        "symbol": "#sw-icon-server",
        "meaning": "Backend service or infrastructure"
      },
      {
        "id": "api",
        "label": "API",
        "file": "icons/api.svg",
        "symbol": "#sw-icon-api",
        "meaning": "Integration, endpoint, developer interface"
      },
      {
        "id": "lock",
        "label": "Lock",
        "file": "icons/lock.svg",
        "symbol": "#sw-icon-lock",
        "meaning": "Private, secured, restricted"
      },
      {
        "id": "shield",
        "label": "Shield",
        "file": "icons/shield.svg",
        "symbol": "#sw-icon-shield",
        "meaning": "Safety, moderation, protection"
      },
      {
        "id": "key",
        "label": "Key",
        "file": "icons/key.svg",
        "symbol": "#sw-icon-key",
        "meaning": "Credentials, access keys, permissions"
      },
      {
        "id": "chart",
        "label": "Chart",
        "file": "icons/chart.svg",
        "symbol": "#sw-icon-chart",
        "meaning": "Analytics, reports, graph"
      },
      {
        "id": "activity",
        "label": "Activity",
        "file": "icons/activity.svg",
        "symbol": "#sw-icon-activity",
        "meaning": "Pulse, usage, live status"
      },
      {
        "id": "credit-card",
        "label": "Credit Card",
        "file": "icons/credit-card.svg",
        "symbol": "#sw-icon-credit-card",
        "meaning": "Payment card, billing method"
      },
      {
        "id": "wallet",
        "label": "Wallet",
        "file": "icons/wallet.svg",
        "symbol": "#sw-icon-wallet",
        "meaning": "Balance, payouts, money account"
      },
      {
        "id": "cart",
        "label": "Cart",
        "file": "icons/cart.svg",
        "symbol": "#sw-icon-cart",
        "meaning": "Checkout cart, purchase flow"
      },
      {
        "id": "invoice",
        "label": "Invoice",
        "file": "icons/invoice.svg",
        "symbol": "#sw-icon-invoice",
        "meaning": "Receipt, billing document"
      },
      {
        "id": "tax",
        "label": "Tax",
        "file": "icons/tax.svg",
        "symbol": "#sw-icon-tax",
        "meaning": "Tax document, compliance finance"
      },
      {
        "id": "login",
        "label": "Login",
        "file": "icons/login.svg",
        "symbol": "#sw-icon-login",
        "meaning": "Sign in, enter account"
      },
      {
        "id": "logout",
        "label": "Logout",
        "file": "icons/logout.svg",
        "symbol": "#sw-icon-logout",
        "meaning": "Sign out, leave account"
      },
      {
        "id": "edit",
        "label": "Edit",
        "file": "icons/edit.svg",
        "symbol": "#sw-icon-edit",
        "meaning": "Modify, compose, revise"
      },
      {
        "id": "trash",
        "label": "Trash",
        "file": "icons/trash.svg",
        "symbol": "#sw-icon-trash",
        "meaning": "Delete, remove, discard"
      },
      {
        "id": "plus",
        "label": "Plus",
        "file": "icons/plus.svg",
        "symbol": "#sw-icon-plus",
        "meaning": "Add, create, increase"
      },
      {
        "id": "minus",
        "label": "Minus",
        "file": "icons/minus.svg",
        "symbol": "#sw-icon-minus",
        "meaning": "Remove, decrease, collapse"
      },
      {
        "id": "filter",
        "label": "Filter",
        "file": "icons/filter.svg",
        "symbol": "#sw-icon-filter",
        "meaning": "Refine visible results"
      },
      {
        "id": "menu",
        "label": "Menu",
        "file": "icons/menu.svg",
        "symbol": "#sw-icon-menu",
        "meaning": "Navigation menu, list"
      },
      {
        "id": "code",
        "label": "Code",
        "file": "icons/code.svg",
        "symbol": "#sw-icon-code",
        "meaning": "Source code, embed, developer"
      },
      {
        "id": "terminal",
        "label": "Terminal",
        "file": "icons/terminal.svg",
        "symbol": "#sw-icon-terminal",
        "meaning": "Console, command line, logs"
      },
      {
        "id": "rocket",
        "label": "Rocket",
        "file": "icons/rocket.svg",
        "symbol": "#sw-icon-rocket",
        "meaning": "Launch, publish, deploy"
      },
      {
        "id": "bug",
        "label": "Bug",
        "file": "icons/bug.svg",
        "symbol": "#sw-icon-bug",
        "meaning": "Issue, defect, debug"
      },
      {
        "id": "help",
        "label": "Help",
        "file": "icons/help.svg",
        "symbol": "#sw-icon-help",
        "meaning": "Question, support, guidance"
      },
      {
        "id": "link",
        "label": "Link",
        "file": "icons/link.svg",
        "symbol": "#sw-icon-link",
        "meaning": "URL, connection, relationship"
      },
      {
        "id": "cloud",
        "label": "Cloud",
        "file": "icons/cloud.svg",
        "symbol": "#sw-icon-cloud",
        "meaning": "Cloud sync, hosted storage"
      },
      {
        "id": "globe",
        "label": "Globe",
        "file": "icons/globe.svg",
        "symbol": "#sw-icon-globe",
        "meaning": "Public web, world, domain"
      },
      {
        "id": "warning",
        "label": "Warning",
        "file": "icons/warning.svg",
        "symbol": "#sw-icon-warning",
        "meaning": "Caution, risk, validation issue"
      },
      {
        "id": "scan",
        "label": "Scan",
        "file": "icons/scan.svg",
        "symbol": "#sw-icon-scan",
        "meaning": "Scan, detect, verify, focus target"
      },
      {
        "id": "network",
        "label": "Network",
        "file": "icons/network.svg",
        "symbol": "#sw-icon-network",
        "meaning": "Connected nodes, graph, distributed system"
      },
      {
        "id": "cpu",
        "label": "CPU",
        "file": "icons/cpu.svg",
        "symbol": "#sw-icon-cpu",
        "meaning": "Compute, processor, AI/system resource"
      },
      {
        "id": "layers",
        "label": "Layers",
        "file": "icons/layers.svg",
        "symbol": "#sw-icon-layers",
        "meaning": "Stacked layers, versions, z-order"
      },
      {
        "id": "eye",
        "label": "Eye",
        "file": "icons/eye.svg",
        "symbol": "#sw-icon-eye",
        "meaning": "View, visibility, preview"
      },
      {
        "id": "grid",
        "label": "Grid",
        "file": "icons/grid.svg",
        "symbol": "#sw-icon-grid",
        "meaning": "Grid view, layout matrix"
      },
      {
        "id": "module",
        "label": "Module",
        "file": "icons/module.svg",
        "symbol": "#sw-icon-module",
        "meaning": "Component, widget, reusable block"
      },
      {
        "id": "stack",
        "label": "Stack",
        "file": "icons/stack.svg",
        "symbol": "#sw-icon-stack",
        "meaning": "Stacked cards, queue, layered set"
      },
      {
        "id": "tile",
        "label": "Tile",
        "file": "icons/tile.svg",
        "symbol": "#sw-icon-tile",
        "meaning": "Bento tile, card tile, app block"
      },
      {
        "id": "phone",
        "label": "Phone",
        "file": "icons/phone.svg",
        "symbol": "#sw-icon-phone",
        "meaning": "Mobile device, call, responsive preview"
      },
      {
        "id": "palette",
        "label": "Palette",
        "file": "icons/palette.svg",
        "symbol": "#sw-icon-palette",
        "meaning": "Theme, color, visual style"
      },
      {
        "id": "heart",
        "label": "Heart",
        "file": "icons/heart.svg",
        "symbol": "#sw-icon-heart",
        "meaning": "Favorite, like, affinity"
      },
      {
        "id": "star",
        "label": "Star",
        "file": "icons/star.svg",
        "symbol": "#sw-icon-star",
        "meaning": "Featured, rating, saved item"
      },
      {
        "id": "target",
        "label": "Target",
        "file": "icons/target.svg",
        "symbol": "#sw-icon-target",
        "meaning": "Goal, campaign, precision"
      },
      {
        "id": "megaphone",
        "label": "Megaphone",
        "file": "icons/megaphone.svg",
        "symbol": "#sw-icon-megaphone",
        "meaning": "Announcement, marketing, broadcast"
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "file": "icons/cursor.svg",
        "symbol": "#sw-icon-cursor",
        "meaning": "Pointer, click, interaction"
      }
    ],
    "optionalIcons": [],
    "aliases": {
      "chat": "message",
      "credit": "credit-card",
      "card": "credit-card",
      "media-image": "image",
      "media-video": "video",
      "brush": "palette",
      "sticker": "star",
      "stamp": "target",
      "flag": "target",
      "bolt": "activity",
      "lightning": "activity"
    }
  }
];
export const packRegistry = Object.fromEntries(packs.map((pack) => [pack.id, pack]));
