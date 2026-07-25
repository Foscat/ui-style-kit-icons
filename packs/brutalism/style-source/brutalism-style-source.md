# Brutalism Style Source Workshop

Working name: **Protest Poster UI**

This direction is meant to complement the existing `brutalism.css` personality in `ui-style-kit-css`, which already has thick borders, grid atmosphere, and offset shadows. The icon pack pushes the same language further so the style has a stronger, instantly recognizable asset vocabulary.

## Core Feeling

Brutalism should feel blunt, loud, functional, and slightly confrontational. It is not trying to be smooth, luxurious, futuristic, or charming. It should feel like a poster slapped onto a wall, a photocopied zine, a chunky admin tool, and a high-contrast web primitive had a productive argument.

## Visual Ingredients

| Layer | Direction |
| --- | --- |
| Shapes | Rectangles, blocks, chunky circles, hard corners, occasional crude diagonals |
| Lines | Thick black/foreground outlines, square caps, miter joins |
| Color | Flat fills from active theme roles; no subtle gradients |
| Shadow | Hard offset slabs using primary/accent colors |
| Texture | Grid paper, stamps, labels, overprint blocks, simple hatch fields |
| Typography | Heavy grotesk, condensed grotesk, mono labels; avoid sci-fi display fonts |
| Controls | Big targets, bordered panels, obvious tabs, poster badges |
| Layout | Broad primary plane, right rail, asymmetrical card spans, hard dividers |

## Draft CSS Source Tokens

```css
[data-ui="brutalism"][data-theme][data-mode] {
  --brutal-border-width: 3px;
  --brutal-border-width-heavy: 5px;
  --brutal-offset-x: .35rem;
  --brutal-offset-y: .35rem;
  --brutal-radius-xs: .125rem;
  --brutal-radius-sm: .25rem;
  --brutal-radius-md: .375rem;
  --brutal-block-shadow: var(--brutal-offset-x) var(--brutal-offset-y) 0 var(--brutal-primary);
  --brutal-stamp-shadow: .16rem .16rem 0 var(--brutal-accent);
  --brutal-panel-border: var(--brutal-border-width-heavy) solid var(--brutal-border);
  --brutal-zine-bg:
    linear-gradient(90deg, rgb(var(--brutal-border-rgb) / .08) 1px, transparent 1px),
    linear-gradient(rgb(var(--brutal-border-rgb) / .08) 1px, transparent 1px),
    var(--brutal-bg);
}
```

## Things To Avoid

- Jelly/glass highlights
- Soft shadows
- Rounded pill-heavy UI
- Neon HUD language
- Delicate line icons
- Over-polished gradients
- Faux material realism

## Open Workshop Questions

1. Should brutalism stay theme-aware and colorful, or default to black/white/yellow?
2. Should cards and buttons keep small radii, or go fully square?
3. Should the layout personality lean more zine/editorial or admin-dashboard?
4. Do we want stamped text utilities like `.brutal-label`, `.brutal-stamp`, and `.brutal-slab`?
