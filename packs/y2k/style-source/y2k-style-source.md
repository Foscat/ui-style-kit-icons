# Y2K Style Source Workshop

Working name: **Aqua Candy Desktop**

This is a proposed direction for the Y2K personality in `ui-style-kit-css`. It is deliberately not copied from the current `y2k.css`; it uses the existing token contract, but pushes the visual language toward a clearer early-2000s source.

## Core Feeling

Y2K should feel like consumer technology became fashion: translucent plastic, candy shell gradients, glossy beveled widgets, web stickers, CD-ROM shine, tiny pixel decorations, AIM-era chat windows, browser chrome, and optimistic gadget energy.

It should not feel like cyberpunk, terminal HUD, military sci-fi, or generic neon dashboards.

## Visual Ingredients

| Layer | Direction |
| --- | --- |
| Surfaces | Jelly plastic, semi-translucent cards, pill capsules, pearl/aqua glass |
| Borders | Soft bevels, double highlights, inner shine, rounded outlines |
| Shadows | Candy-colored glow and soft plastic depth, not heavy realism |
| Backgrounds | Bubble gradients, radial gloss spots, subtle pixel/checker details |
| Typography | Rounded geometric or friendly techno; avoid hard sci-fi display fonts |
| Texture | Sparkles, sticker dots, tiny pixel ticks, CD rainbow glints |
| Controls | Capsule buttons, glossy tabs, toy-like toggles, badge stickers |
| Layout | Dock, sidebar stickers, floating browser/chat panes, collectible cards |

## Proposed CSS Source Tokens

```css
[data-ui="y2k"][data-theme][data-mode] {
  --y2k-gloss-alpha: .72;
  --y2k-jelly-alpha: .74;
  --y2k-chrome-alpha: .36;
  --y2k-bubble-alpha: .22;
  --y2k-sticker-border-alpha: .88;
  --y2k-highlight: rgb(255 255 255 / var(--y2k-gloss-alpha));
  --y2k-jelly-surface:
    linear-gradient(180deg,
      rgb(255 255 255 / var(--y2k-gloss-alpha)),
      rgb(var(--y2k-surface-strong-rgb) / var(--y2k-jelly-alpha)) 38%,
      rgb(var(--y2k-surface-rgb) / var(--y2k-panel-alpha)));
  --y2k-bubble-bg:
    radial-gradient(circle at 20% 15%, rgb(255 255 255 / .55), transparent 18%),
    radial-gradient(circle at 85% 5%, rgb(var(--y2k-accent-rgb) / var(--y2k-bubble-alpha)), transparent 28rem),
    radial-gradient(circle at 8% 92%, rgb(var(--y2k-secondary-rgb) / .18), transparent 26rem),
    var(--y2k-bg);
  --y2k-sticker-shadow:
    0 1px 0 rgb(255 255 255 / .7) inset,
    0 .75rem 1.8rem rgb(var(--y2k-secondary-rgb) / .18);
}
```

## Component Bias

- Buttons should be pill-like, glossy, and slightly raised.
- Cards should feel like plastic stickers or translucent windows.
- Tabs can look like browser tabs or capsule nav chips.
- Badges should lean playful: rounded stickers, starbursts, jelly dots.
- Inputs should feel like white/aqua plastic wells, not dark terminals.
- Focus rings should be bright and bubbly, with visible contrast.

## Things To Avoid

- Hard angular HUD frames
- Matrix/code rain associations
- Mostly black panels
- Overuse of Orbitron or sharp techno fonts
- Brutalist borders
- Cyberpunk warning stripes
- Purple-only vapor gradients

## Open Workshop Questions

1. Should Y2K lean more **Aqua/iMac**, **web dollz/sticker**, or **club/fashion tech**?
2. Should dark mode stay playful, or become more nightclub/blacklight?
3. Do we want layout-style Y2K to become a dock/window desktop instead of right-rail workspace?
4. Should icon shapes be framed tiles by default, or should the library also include unframed glyph variants?
