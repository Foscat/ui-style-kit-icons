# Skeuomorphic / Tactile UI Style Icons

Theme-aware SVG icon pack for the `tactile` personality in `ui-style-kit-css` and `layout-style-css`.

This pack follows the **Raised Workbench** direction: soft physical panels, beveled highlights, inset wells, muted material shadows, and app symbols that feel pressable without becoming decorative props.

## Contract

- Contract version: `1.0.0`
- Required core icons: `64`
- Included icons: `64`
- Optional extras: `0`

## Usage

```html
<link rel="stylesheet" href="dist/tactile-ui-style-icons.css">

<body data-ui="tactile" data-theme="midnight-gold" data-mode="light">
  <svg class="tactile-icon tactile-icon--lg" aria-hidden="true">
    <use href="#tactile-icon-dashboard"></use>
  </svg>
</body>
```

Inline SVG or inline sprite usage is recommended because page CSS variables do not cascade into external `<img>` SVGs.
