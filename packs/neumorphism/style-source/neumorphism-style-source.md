# Neumorphism Style Source Workshop

Working name: **Soft Extrusion**

Neumorphism should feel calm, molded, and low-contrast. The icons should appear pressed out of the same material as the interface through paired light and dark shadows, soft rounded geometry, and inset grooves. Compared with tactile, neumorphism is smoother and quieter; compared with minimal-saas, it has more physical depth.

## Visual Ingredients

| Layer | Direction |
| --- | --- |
| Surfaces | Same-material rounded tiles with soft extrusion |
| Borders | Very subtle, mostly used to hold contrast on dark or contrast modes |
| Shadows | Paired light and dark offsets, plus small inset grooves |
| Color | Restrained token accents; avoid loud fills |
| Shape | Large radii, soft pills, sunken slots, molded inner marks |
| Icons | Clear app symbols nested into low-relief physical controls |

## Token Hooks

The icon pack maps into `--usk-*` variables first and borrows `--neo-*` personality alphas when `data-ui="neumorphism"` is active.

| Icon token | Source |
| --- | --- |
| `--neo-icon-bg` | `--usk-surface-rgb` |
| `--neo-icon-border` | `--usk-border-rgb` |
| `--neo-icon-primary` | `--usk-primary-rgb` |
| `--neo-icon-nm-light` | `--usk-surface-strong-rgb` |
| `--neo-icon-nm-dark` | `--usk-border-rgb` |
| `--neo-icon-bg-soft` | `--usk-surface-soft-rgb` |

## Things To Avoid

- Hard outlines that make the pack feel brutalist or tactile
- Glass transparency or high-gloss highlights
- Excessively pale contrast that harms 16-24px readability
- Saturated sticker color that overlaps with maximalist
- Style-specific icon IDs that break the shared semantic contract

## Open Workshop Questions

1. Should the style kit expose `--neo-nm-light` and `--neo-nm-dark` as first-class tokens?
2. Should active nav icons use a `neo-icon--pressed` state by default?
3. Should contrast mode automatically strengthen the icon border and accent strokes?
