# Retro Glass Style Source Workshop

Working name: **Frosted Aurora Interface**

This direction is meant to complement the existing `retro-glass.css` personality in `ui-style-kit-css`. The current source already has the right idea: translucent panels, blur/saturation, radial atmosphere, glowing edges, and stepped layout. This pack pushes the asset language into clearer glassmorphism.

## Core Feeling

Retro Glass should feel premium, luminous, calm, layered, and dimensional. It is futuristic without becoming cyberpunk, playful without becoming Y2K, and polished without becoming sterile SaaS.

## Visual Ingredients

| Layer | Direction |
| --- | --- |
| Surfaces | Frosted panes, translucent cards, cloudy glass, soft acrylic sheets |
| Borders | Thin luminous rims, white top-left highlights, subtle colored edges |
| Shadows | Soft depth shadows plus faint colored glow |
| Background | Aurora blooms, bokeh-like color fields, optional faint grid behind glass |
| Texture | Avoid noisy texture; use gentle refraction bands and inner shine |
| Controls | Glass chips, pill controls, floating segmented panels |
| Layout | Wide stage, stepped rail, stacked panes, floating overlays |
| Icons | Semi-transparent fills, rim strokes, internal highlights, soft glow |

## Draft CSS Source Tokens

```css
[data-ui="retro-glass"][data-theme][data-mode] {
  --rg-glass-alpha: .46;
  --rg-glass-strong-alpha: .64;
  --rg-glass-border-alpha: .48;
  --rg-glass-rim-alpha: .62;
  --rg-glass-blur: 18px;
  --rg-glass-saturate: 155%;
  --rg-glass-shadow:
    0 1px 0 rgb(255 255 255 / .38) inset,
    0 18px 44px rgb(0 0 0 / calc(var(--rg-shadow-alpha) + .04)),
    0 0 34px rgb(var(--rg-primary-rgb) / var(--rg-glow-alpha));
  --rg-glass-surface:
    linear-gradient(135deg, rgb(255 255 255 / .2), rgb(255 255 255 / .04)),
    linear-gradient(135deg, rgb(var(--rg-primary-rgb) / .08), rgb(var(--rg-accent-rgb) / .045)),
    rgb(var(--rg-surface-rgb) / var(--rg-glass-alpha));
}
```

## Things To Avoid

- Transparent panels with no readable contrast
- Blurry background soup
- Neon HUD lines
- Heavy black outlines
- Flat solid cards
- Too many decorative blobs competing with content
- White-on-glass text without contrast checks

## Open Workshop Questions

1. Should Retro Glass lean more Apple Vision / acrylic, or more retrofuturist glass cockpit?
2. Should dark mode be deep-space glass or nightclub glass?
3. How much grid should remain visible behind frosted panels?
4. Do we want glass-specific utilities like `.rg-frost`, `.rg-pane`, `.rg-rim`, and `.rg-orb`?
