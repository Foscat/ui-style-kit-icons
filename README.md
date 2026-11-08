# UI Style Kit Icons

UI Style Kit Icons 2.0.0 publishes 174 canonical icons across 20 theme-aware families.
Every family includes themed and monochrome SVGs on a
24 × 24 grid, for 6,960 source assets in Collection 01.

- Package version: `2.0.0`
- Contract version: `1`
- UI Style Kit CSS compatibility: `ui-style-kit-css >=2.7.1 <3`
- [Interactive demo](https://foscat.github.io/ui-style-kit-icons/)

## Install

```sh
npm install ui-style-kit-icons
```

Import the custom element and the shared paint layer:

```js
import "ui-style-kit-icons/element";
import "ui-style-kit-icons/css.css";
```

```html
<usk-icon name="home" pack="organic-modern"></usk-icon>
<usk-icon name="chart" pack="technical-blueprint"></usk-icon>
<usk-icon name="warehouse" pack="industrial-utility" variant="monochrome"></usk-icon>
```

The runtime resolves supported icon aliases such as `chart` to
`chart-bar`. Unknown icon families fail with a `RangeError` instead of
silently substituting unrelated artwork.

## Public package surface

- `ui-style-kit-icons/element` — runtime and `<usk-icon>` custom element
- `ui-style-kit-icons/registry` — generated ESM registry
- `ui-style-kit-icons/contract.json` — generated semantic contract
- `ui-style-kit-icons/css.css` — combined family paint layer
- `ui-style-kit-icons/inline-svg` — browser-safe inline SVG normalization
- `ui-style-kit-icons/svg/<family>/<icon-id>.svg` — themed artwork
- `ui-style-kit-icons/monochrome/<family>/<icon-id>.svg` — one-ink artwork

The default family is Organic Modern. Use `pack` or `data-icon-pack` to
select another family and `variant="monochrome"` for one-ink artwork.

## Runtime API

The package root and `ui-style-kit-icons/runtime` export the same runtime:

```js
import {
  getPack,
  iconNames,
  normalizeIconName,
  resolveIconUrl,
  setAssetBaseUrl,
  setDefaultPack
} from "ui-style-kit-icons";

setAssetBaseUrl(new URL("/vendor/ui-style-kit-icons/", location.origin));
setDefaultPack("technical-blueprint");

const family = getPack();
const names = iconNames(family.id);
const canonicalName = normalizeIconName("chart");
const iconUrl = resolveIconUrl(canonicalName, family.id);
```

`getAssetBaseUrl()` reads the current asset root. `defineUiStyleIcon()` registers
the custom element under an alternate tag name when an application cannot use
the default `usk-icon` name. Registry constants such as `packs`, `packRegistry`,
`aliases`, and `styleAliases` are also exported for build-time integration.

The custom element accepts these public attributes:

- `name` — canonical icon name or supported alias.
- `pack` — canonical family ID or supported family alias.
- `variant` — `themed` or `monochrome`.
- `label="Accessible name"` — exposes a meaningful icon to assistive technology;
  omit it when adjacent text already names the action.
- `asset-base` — overrides the asset root for one element.

## Families

| Family | ID | Family | ID |
| --- | --- | --- | --- |
| Minimal SaaS | `minimal-saas` | Industrial Utility | `industrial-utility` |
| Bento | `bento` | Technical Blueprint | `technical-blueprint` |
| Maximalist | `maximalist` | Art Deco | `art-deco` |
| Bauhaus | `bauhaus` | Clay | `clay` |
| Tactile | `tactile` | Data Terminal | `data-terminal` |
| Brutalism | `brutalism` | Paper Editorial | `paper-editorial` |
| Cyberpunk | `cyberpunk` | Neo-Noir | `neo-noir` |
| Y2K | `y2k` | Neumorphism | `neumorphism` |
| Retro Glass | `retro-glass` | Retrofuturism | `retrofuturism` |
| Editorial Lux | `editorial-luxe` | Organic Modern | `organic-modern` |

## Assets and compatibility

`manifest.json` is the source of truth for family metadata, canonical icon
names, and supported aliases. `reference/asset-hashes.json` locks all 6,960
SVGs. The paint layer supports 25 palettes in light, dark, and contrast modes.

Theme-aware SVGs use UI Style Kit paint tokens. Monochrome SVGs use
`currentColor`; inline them when they should inherit surrounding text color.
For accessible inline use, keep the SVG label when the icon conveys meaning,
or set `aria-hidden="true"` when adjacent text already provides the label.

The expanded collection adds 94 icons to the approved 80-icon baseline.
`reference/coverage-map.json` records the published-contract, SYS AppIcon,
and sampled Lucide mappings used to shape that expansion.

## Demo and development

```sh
npm run demo
npm run build
npm run contracts:write
npm run assets:check
npm run pages:build
```

The local demo and GitHub Pages artifact are self-contained. Motion Style CSS
is vendored only for the demo's transition choreography.

After changing generated artwork, rebuild and verify the expansion sources:

```sh
npm run coverage:build
npm run coverage:check
npm run demo:build
```

Use `npm run coverage:check -- --usage icon-names.json` to validate a consumer's
canonical icon names and published aliases.

Before release, run `npm run release:verify` and inspect
`npm pack --dry-run --json`. Local verification, package publication,
GitHub Actions, Pages deployment, and live-site acceptance are separate
evidence classes.
