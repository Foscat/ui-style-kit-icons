# Reference-Led Icon Grammar

Status: **1.0.0 artwork contract**

The standalone SVGs are the canonical artwork for all 64 shared semantics and
31 optional icons. Build and refinement scripts may normalize markup, validate
metadata, apply known migrations, and package those sources. They must not
invent or replace semantic geometry.

The supplied reference images establish construction language, not artwork to
copy. Their visual direction takes precedence where older style-source prose
describes generic decoration instead of an object-specific design.

## Shared Quality Rules

- Preserve an immediately recognizable semantic silhouette.
- Keep every essential shape inside the 12-unit SVG safe area.
- Design for both the default 20px size and the 76px gallery size.
- Maintain at least 3:1 graphical contrast in light and dark modes and 4.5:1
  in contrast mode.
- Keep essential geometry inside one authored
  `data-icon-glyph="semantic"` group.
- Use meaningful `data-icon-part` hooks for topology and containment checks.
- Never make a frame, detached badge, floating shine, or background responsible
  for identifying an icon.
- Keep `auto`, `soft`, and `none` frame states semantically identical across
  web-component, inline SVG, and sprite rendering.

## Pack Grammar

| Pack | Required borderless construction |
| --- | --- |
| System | Neutral, balanced, literal glyphs without decorative personality. |
| Minimal SaaS | Sparse 5-6 unit monoline forms, rounded joins, minimal fills, and no more than two paint roles. |
| Bento | Rounded hand-inked object illustrations with semantic-specific interior detail. Bento tiles remain frame-only. |
| Maximalist | Thick dark keylines, two to four saturated flat fills, playful proportions, and object-attached highlights. |
| Brutalism | Literal pictograms built from chunky geometric color blocks, square cuts, and no gradients or soft shadows. Contrast mode is monochrome. |
| Tactile | Recognizable skeuomorphic objects with attached body, highlight, lowlight, and restrained cast-shadow layers. The public pack ID remains `tactile`. |
| Neumorphism | Low-relief semantic forms with paired attached light and dark edges plus inset grooves. Contrast mode adds a strong keyline. |
| Retro Glass | Translucent semantic silhouettes with attached refracted rims and inner highlights, without detached bubbles or smudges. |
| Y2K | Inflated gadget-like geometry, chrome edges, and contour-following shine. Floating gloss ellipses are prohibited. |
| Cyberpunk | Angular clipped silhouettes, segmented cutouts, and circuit terminals integrated into the object rather than surrounding HUD decoration. |
| Synthwave | Semantic silhouettes constructed from faceted neon bands, cyan, magenta, and warm gradients, dark keylines, and tightly bounded glow. |
| Synthwave Web App | A quieter operational Synthwave language using one neon split, stronger silhouettes, and minimal attached status detail. |

## Prototype Approval Gate

The first approval set is Home, Users, Video, Link, Cloud, Network, Megaphone,
and Palette across all twelve packs. Each source is marked
`data-icon-prototype="reference-led-v1"` until the direction is approved.

The review command renders those icons at 20px and 76px in every supported
theme and light, dark, and contrast mode. Each matrix pairs complete frames
with the `none` state:

```sh
npm run visual:prototype
```

Bulk redraw work must not begin until every pack direction in this set is
visually approved.

## Verification Contract

- Source tests verify pack-specific stroke, fill, palette, material, relief,
  gradient, filter, and prohibited-effect rules.
- Rendered tests verify safe areas, clipping, contrast, occupancy, frame
  invariance, and consumption paths.
- A normalized 76px edge-mask comparison rejects two non-System versions of
  the same semantic when their similarity is `0.985` or greater.
- Existing topology tests remain authoritative for Users, Link, Cloud, Network,
  Bug, Megaphone, Video, Sparkle, Activity, and Star.
- Package sprites and distribution assets are regenerated only through
  `npm run build`.

## Research Basis

The construction rules combine the supplied visual references with established
icon guidance for simple metaphors, small-size simplification, optical
alignment, and accessible graphical contrast:

- [Apple Human Interface Guidelines: Icons](https://developer.apple.com/design/human-interface-guidelines/icons)
- [Fluent 2: Iconography](https://fluent2.microsoft.design/iconography)
- [Carbon Design System: Icons](https://carbondesignsystem.com/elements/icons/usage/)
- [Figma: What is skeuomorphism?](https://www.figma.com/resource-library/what-is-skeuomorphism/)
- [Microsoft: Acrylic material](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic)
- [AIGA Eye on Design: The Y2K Aesthetic](https://eyeondesign.aiga.org/the-y2k-aesthetic-is-fully-back-but-can-it-stick-around/)
- [Cyberpunk 2077: Visual styles](https://www.cyberpunk.net/en/news/28441/c-usb-01-backup-concept-art-cp-visual-styles)
