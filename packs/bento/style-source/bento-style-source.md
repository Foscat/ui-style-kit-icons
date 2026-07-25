# Bento Style Source Workshop

Working name: **Modular App Tiles**

The Bento style should feel like a polished product dashboard: modular, spacious, scannable, and quietly dimensional. The icon pack treats every glyph as a tiny reusable tile system, with the symbol sitting inside a soft rounded module instead of floating loose.

## Core Feeling

Bento should feel organized, premium, calm, and practical. It is less expressive than Brutalism or Y2K, less atmospheric than Retro Glass, and more layout-native than Minimal SaaS.

## Visual Ingredients

| Layer | Direction |
| --- | --- |
| Surfaces | Rounded cards, tile modules, subtle gradients, soft elevation |
| Borders | Quiet 1px borders using theme border tokens |
| Shadows | Gentle product-card depth, never dramatic |
| Color | One primary accent, one secondary support color, one warm/highlight accent |
| Shape | Rounded rectangles, pills, nested modules, asymmetric grid spans |
| Layout | Six-column bento rhythm, occasional 2x tile emphasis, dense but breathable |
| Icons | Main symbol plus miniature tile context, no thin hairline-only icons |

## Draft CSS Source Tokens

```css
[data-ui="bento"][data-theme][data-mode] {
  --bento-tile-gap: var(--bento-space-5);
  --bento-tile-radius: var(--bento-radius-lg);
  --bento-tile-radius-lg: var(--bento-radius-xl);
  --bento-tile-border: rgb(var(--bento-border-rgb) / var(--bento-border-alpha));
  --bento-tile-shadow:
    0 16px 40px rgb(0 0 0 / var(--bento-shadow-alpha));
  --bento-tile-bg:
    linear-gradient(135deg, rgb(var(--bento-primary-rgb) / .08), transparent 38%),
    linear-gradient(180deg, rgb(255 255 255 / .08), transparent),
    var(--bento-surface);
}
```

## Things To Avoid

- Unframed outline icons that ignore the tile language
- Overly playful sticker icons
- Random varied colors on every tile
- Dense inner detail that breaks at 16-24px
- Sharp corners unless the wider style source adds a deliberate contrast utility
- Heavy shadows or glossy glass effects

## Open Workshop Questions

1. Should Bento use stronger asymmetry in component layouts, or stay mostly uniform?
2. Should icon tiles be allowed to span wider shapes in UI, or remain square-only?
3. Should warm accent chips be part of the default identity or purely theme-driven?
4. Do we want utilities like `.bento-tile`, `.bento-module`, `.bento-mosaic`, and `.bento-metric`?
