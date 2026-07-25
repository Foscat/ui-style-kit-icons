# Skeuomorphic / Tactile Style Source Workshop

Working name: **Raised Workbench**

Skeuomorphic / Tactile should feel like a modern product interface made from physical controls. It is not nostalgic leather-and-metal skeuomorphism; it is a restrained, usable, touchable system with raised panels, inset wells, beveled edges, and soft material lighting.

## Visual Ingredients

| Layer | Direction |
| --- | --- |
| Surfaces | Raised panels with subtle gradients and physical edge light |
| Borders | Moderate contrast, rounded, integrated into the surface |
| Shadows | Soft cast shadow plus inner highlight or lowlight |
| Color | Token-driven accents, less loud than maximalist, more dimensional than minimal |
| Shape | Rounded rectangles, inset slots, pressable pills, molded controls |
| Icons | Product symbols sitting inside tactile controls with bevel and depth cues |

## Token Hooks

The icon pack maps into `--usk-*` variables first and borrows `--tactile-*` personality alphas when `data-ui="tactile"` is active.

| Icon token | Source |
| --- | --- |
| `--tactile-icon-bg` | `--usk-surface-rgb` |
| `--tactile-icon-border` | `--usk-border-rgb` |
| `--tactile-icon-primary` | `--usk-primary-rgb` |
| `--tactile-icon-highlight` | `--usk-surface-strong-rgb` |
| `--tactile-icon-lowlight` | `--usk-border-rgb` |
| `--tactile-icon-shadow` | `--usk-border-rgb` plus `--tactile-shadow-alpha` |

## Things To Avoid

- Photo-realistic materials that fight the theme tokens
- Heavy nostalgia tropes such as leather, brushed metal, or wood grain
- Flat monoline icons without depth cues
- Excessive gloss that overlaps with retro-glass
- Style-specific icon names that break the shared semantic contract

## Open Workshop Questions

1. Should tactile icons include an optional pressed state class for active controls?
2. Should the style kit expose dedicated `--tactile-highlight-rgb` and `--tactile-lowlight-rgb` tokens?
3. Should layout-style-css include tactile depth scales for rails, toolbars, and icon buttons?
