# Maximalist / Playful UI Style Icons

Theme-aware SVG icon pack for the `maximalist` personality in `ui-style-kit-css` and `layout-style-css`.

This pack follows the **Party Dashboard** direction: chunky sticker surfaces, big rounded shapes, offset shadows, saturated token-driven fills, playful confetti marks, and expressive product UI silhouettes.

## Contract

- Contract version: `1.0.0`
- Required core icons: `64`
- Included icons: `64`
- Optional extras: `0`

## Usage

```html
<link rel="stylesheet" href="dist/maximalist-ui-style-icons.css">

<body data-ui="maximalist" data-theme="candy-console" data-mode="light">
  <svg class="max-icon max-icon--lg" aria-hidden="true">
    <use href="#max-icon-dashboard"></use>
  </svg>
</body>
```

Inline SVG or inline sprite usage is recommended because page CSS variables do not cascade into external `<img>` SVGs.
