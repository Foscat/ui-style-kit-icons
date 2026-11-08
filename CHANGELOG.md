# Changelog

All notable changes to UI Style Kit Icons are documented in this file.

## [2.0.0] - 2026-11-08

### Added

- Collection 01 with 174 canonical icons across 20 theme-aware families.
- Matching monochrome artwork for every family and icon, for 6,960 locked SVG
  assets in total.
- Consumer coverage mappings, legacy icon aliases, and deterministic expansion
  generators for the published contract and sampled STE application surfaces.
- Twenty-five-palette paint snapshots, browser-safe inline SVG normalization,
  family-specific themed and monochrome sprites, and a self-contained Icon
  Studio demo.

### Changed

- Made `manifest.json` the authoritative asset catalog and generate the public
  registry, declarations, sprites, and semantic contract from it.
- Updated the package paint contract to `ui-style-kit-css >=2.7.1 <3`.
- Added a `variant="monochrome"` custom-element option and direct `svg/`,
  `monochrome/`, `paint/`, and sprite package exports.
- Replaced the legacy Pages gallery with the supplied Collection 01 studio.

### Removed

- Retired the legacy `icons/`, `packs/`, and `style-source/` trees, including
  the system, Neumorphism, Synthwave, and Synthwave Web App families.
- Removed frame-specific tests and generation tools that described the former
  256-unit artwork rather than the new 24-unit collection.

## [1.0.0] - 2026-07-25

### Added

- Public ESM custom-element runtime, typed registry, JSON contract, CSS layers,
  standalone SVGs, external sprites, and inline sprites.
- Twelve selectable visual packs sharing the stable `1.0.0` 64-icon semantic
  contract.
- Frame controls, optional pack extras, self-hosted asset-base support, and
  sanitized SVG loading.
- Deterministic npm, GitHub Pages, ecosystem, browser, package, and visual
  release checks.
- Node.js 20, 22, and 24 compatibility CI plus a browser-backed SVG sanitizer
  regression check.

### Changed

- Aligned color roles, themes, modes, and `data-ui` aliases with
  `ui-style-kit-css >=2.1.0 <3`.
- Made inherited `currentColor` the standalone contrast context while retaining
  live `--usk-*` companion tokens.
- Hardened caller-configured SVG loading against executable elements, root and
  descendant event attributes, embedded media, and external URL references.
- Made transient icon fetch failures retryable instead of retaining rejected
  cache entries for the lifetime of the page.
- Reduced the npm tarball to consumer-facing runtime, contract, icon, sprite,
  style-source, and pack files.
- Established standalone SVGs as canonical artwork and removed generated
  signature layers that created superficial borderless variation.
- Added the reference-led eight-icon approval gate across all twelve packs,
  including paired frame states, small and gallery sizes, all themes and modes,
  pack-specific construction checks, and rendered edge-mask comparisons.
- Integrated the GitHub Pages demo with exact UI Style Kit, Interactive Surface,
  and Layout Style releases while preserving the icon package's zero-dependency
  standalone contract.

### Fixed

- Reworked low-contrast and clipped icon artwork across all packs, including a
  clear video-player silhouette.
- Rebuilt Network, Bug, Megaphone, Link, Cloud, and Users across all twelve
  packs with explicit semantic topology, safer alignment, and clearer
  small-size silhouettes.
- Reduced frame competition by separating structural surfaces from optional
  decoration, simplifying Cyberpunk and Synthwave scenery, and repairing Bento
  Activity, Retro Glass and Y2K Sparkle, and the Y2K Star highlight.
- Normalized Y2K icon scaling and safe areas, centered complex glyphs, and made
  its decorative guide marks honor borderless rendering.
- Prevented embedded standalone SVG titles from obscuring interactive icon
  previews with native hover labels.
- Repaired the demo sidebar, frame controls, light modes, URL state, icon
  dialog, direct-file warning, and GitHub Pages metadata.
- Removed stale duplicate pack and favicon drop-in folders.

[2.0.0]: https://github.com/Foscat/ui-style-kit-icons/releases/tag/v2.0.0
[1.0.0]: https://github.com/Foscat/ui-style-kit-icons/releases/tag/v1.0.0
