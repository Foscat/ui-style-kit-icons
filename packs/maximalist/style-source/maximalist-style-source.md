# Maximalist / Playful Style Source Workshop

Working name: **Party Dashboard**

Maximalist should feel like a joyful product interface with no fear of color, shape, or volume. It is bold enough to be memorable, but still structured enough to support app semantics and repeatable UI system usage.

## Visual Ingredients

| Layer | Direction |
| --- | --- |
| Surfaces | Oversized rounded tiles, sticker badges, soft candy fills |
| Borders | Thick dark or high-contrast outlines that make shapes pop |
| Shadows | Offset print-like shadows, intentionally visible |
| Color | Saturated primary, secondary, and accent colors all active at once |
| Shape | Pills, blobs, large-radius rectangles, angled accent chips |
| Icons | Chunky linework, filled symbol blocks, confetti details, playful imbalance |

## Token Hooks

The icon pack maps into `--usk-*` variables first and borrows `--max-*` personality alphas when `data-ui="maximalist"` is active.

| Icon token | Source |
| --- | --- |
| `--max-icon-bg` | `--usk-surface-rgb` |
| `--max-icon-border` | `--usk-border-rgb` |
| `--max-icon-primary` | `--usk-primary-rgb` |
| `--max-icon-secondary` | `--usk-secondary-rgb` |
| `--max-icon-accent` | `--usk-accent-rgb` |
| `--max-icon-shadow` | `--usk-border-rgb` plus `--max-shadow-alpha` |

## Things To Avoid

- Thin monoline marks that feel too neutral for the style
- Pastel-only palettes without contrast or edge
- Decorative icons that break the shared semantic contract
- Overly complex interior illustration that fails below 24px
- Treating playful as random; the system still needs predictable names and exports

## Open Workshop Questions

1. Should Maximalist support a frameless variant for dense sidebars?
2. Should icon shadows always use border color, or should themes choose a dedicated sticker-shadow token?
3. Should layout-style-css expose a shared confetti density token for maximalist surfaces and icons?
