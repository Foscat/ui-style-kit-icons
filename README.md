# UI Style Kit Icons

Theme-aware SVG icon library for the UI Style Kit CSS ecosystem. The package owns icon runtime and assets; `ui-style-kit-css` owns visual theme paint, `layout-style-css` owns layout primitives, and `interactive-surface-css` owns interaction affordances.

- Package version: `0.2.0`
- Contract version: `0.1.0`
- Required semantic icons: `64`
- Selectable packs: `12`
- Runtime dependencies: `0`

Use the same semantic icon name across every visual pack. Change `data-icon-pack` or `data-ui` to change the icon language without changing application markup.

## Install

```sh
npm i ui-style-kit-icons
```

## Use The Web Component

```js
import "ui-style-kit-icons/element";
```

```html
<body data-icon-pack="minimal-saas" data-theme="arctic-indigo" data-mode="dark">
  <usk-icon name="dashboard" label="Dashboard"></usk-icon>
</body>
```

The custom element resolves the nearest `data-icon-pack` first, then the nearest `data-ui`. Set `label` when the icon conveys meaning; omit it when adjacent text already labels the action.

## Use CSS Or Sprites

```html
<link rel="stylesheet" href="node_modules/ui-style-kit-icons/css.css">

<svg class="usk-icon" role="img" aria-label="Dashboard">
  <use href="node_modules/ui-style-kit-icons/sprite.svg#usk-icon-dashboard"></use>
</svg>
```

Useful public subpaths:

- `ui-style-kit-icons/element`
- `ui-style-kit-icons/registry`
- `ui-style-kit-icons/registry.json`
- `ui-style-kit-icons/contract.json`
- `ui-style-kit-icons/css.css`
- `ui-style-kit-icons/sprite.svg`
- `ui-style-kit-icons/icons/<icon-id>.svg`
- `ui-style-kit-icons/packs/<pack-id>/icons/<icon-id>.svg`

## Demo

The live sidebar and pack switching require an HTTP server because browsers block ES modules from `file://` pages.

```sh
npm run demo
```

Then open the printed localhost URL.

## Verify

```sh
npm run build
npm run verify
npm pack --dry-run --json
```

For browser smoke testing, run:

```sh
npm run check:demo
npm run check:svg
```

`check:svg` renders every registered icon pack across all supported color
schemes and modes, then checks sizing, clipping, and graphical contrast.

For GitHub Pages artifact verification, run:

```sh
npm run pages:build
node --test tests/*.test.mjs
```
