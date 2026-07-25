# UI Style Kit Icons

Theme-aware SVG icons for the UI Style Kit CSS ecosystem, with a zero runtime
dependency standalone path. This package owns icon semantics, artwork, sprites,
and the `<usk-icon>` runtime. `ui-style-kit-css` owns visual theme paint,
`layout-style-css` owns layout primitives, and `interactive-surface-css` owns
interaction affordances.

- Package version: `1.0.0`
- Contract version: `1.0.0`
- Required semantic icons: `64`
- Selectable packs: `12`
- Runtime dependencies: `0`
- Build requirement: Node.js `>=20`

## Install

Install only the icon package for standalone use:

```sh
npm i ui-style-kit-icons
```

Install the optional visual companion for the complete ecosystem theme matrix:

```sh
npm i ui-style-kit-icons ui-style-kit-css@2.1.0
```

The package supports `ui-style-kit-css >=2.1.0 <3` and verifies the current
`2.1.0` release during development. The peer is optional, so installing the icon
library by itself does not add or require a stylesheet runtime.

## Web Component

```js
import "ui-style-kit-icons/element";
```

```html
<button type="button">
  <usk-icon name="dashboard" label="Dashboard"></usk-icon>
  Dashboard
</button>
```

The component inherits `currentColor`, ships readable fallback paint, and loads
its SVG assets from the package. Set `label` when an icon conveys meaning. Omit
it when adjacent text already names the action.

Use `setAssetBaseUrl()` when assets are hosted somewhere other than the package
root:

```js
import {
  setAssetBaseUrl
} from "ui-style-kit-icons/element";

setAssetBaseUrl(new URL("/vendor/ui-style-kit-icons/", location.origin));
```

## UI Style Kit CSS

Load the companion theme layer before using the icon component:

```js
import "ui-style-kit-css/visual.css";
import "ui-style-kit-icons/element";
```

```html
<body
  data-ui="bento"
  data-theme="arctic-indigo"
  data-mode="dark"
>
  <usk-icon name="dashboard" label="Dashboard"></usk-icon>
</body>
```

The closest `data-icon-pack` takes priority. Without an explicit override, the
runtime resolves the closest `data-ui`:

| `ui-style-kit-css` preset | Icon pack |
| --- | --- |
| `minimal-saas` | `minimal-saas` |
| `bento` | `bento` |
| `maximalist` | `maximalist` |
| `bauhaus` | `system` |
| `tactile` | `tactile` |
| `neumorphism` | `neumorphism` |
| `retrofuturism` | `synthwave` |
| `brutalism` | `brutalism` |
| `cyberpunk` | `cyberpunk` |
| `y2k` | `y2k` |
| `retro-glass` | `retro-glass` |

`bauhaus` uses the neutral system artwork because the current 12-pack collection
does not claim a separate Bauhaus pack. Select `synthwave-webapp` explicitly
with `data-icon-pack` when that focused extension is preferred.

```html
<section data-ui="retrofuturism" data-icon-pack="synthwave-webapp">
  <usk-icon name="browser"></usk-icon>
</section>
```

## Frame Control

Every icon exposes authored frame hooks:

```html
<usk-icon name="video"></usk-icon>
<usk-icon name="video" frame="soft"></usk-icon>
<usk-icon name="video" frame="none"></usk-icon>
```

The demo presents the bordered and border-free options. `frame="auto"` is the
default, `soft` reduces frame emphasis, and `none` keeps only the icon glyph.

## CSS And Sprites

Import the system layer or every pack token layer:

```css
@import "ui-style-kit-icons/css.css";
/* Or: @import "ui-style-kit-icons/css/all.css"; */
```

```html
<svg class="usk-icon" role="img" aria-label="Dashboard">
  <use href="/node_modules/ui-style-kit-icons/sprite.svg#usk-icon-dashboard"></use>
</svg>
```

Useful public subpaths:

- `ui-style-kit-icons/element`
- `ui-style-kit-icons/runtime`
- `ui-style-kit-icons/registry`
- `ui-style-kit-icons/registry.json`
- `ui-style-kit-icons/contract.json`
- `ui-style-kit-icons/css.css`
- `ui-style-kit-icons/css/all.css`
- `ui-style-kit-icons/sprite.svg`
- `ui-style-kit-icons/icons/<icon-id>.svg`
- `ui-style-kit-icons/packs/<pack-id>/icons/<icon-id>.svg`

## Demo

The live controls require an HTTP server because browsers block ES modules from
`file://` pages.

```sh
npm run demo
```

Build the exact GitHub Pages artifact with:

```sh
npm run pages:build
```

The deployable output is `output/github-pages/`.

## Verification

```sh
npm run verify
npm run check:demo
```

`check:svg` renders every registered pack across all 10 companion color schemes,
all three modes, and standalone light/dark surfaces. It checks icon sizing,
clipping, and graphical contrast. `check:ecosystem` validates the installed
companion manifests, shared RGB tokens, preset mappings, CDN versions, and SRI.

Before an npm release:

```sh
npm run release:verify
npm pack --dry-run --json
```

Publishing, tagging, and GitHub Pages deployment remain separate explicit
release actions.

## Project Links

- [Demo](https://foscat.github.io/ui-style-kit-css-icons/)
- [Repository](https://github.com/Foscat/ui-style-kit-css-icons)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
