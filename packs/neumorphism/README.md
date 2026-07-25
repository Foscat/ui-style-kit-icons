# Neumorphism UI Style Icons

Theme-aware SVG icon pack for the `neumorphism` personality in `ui-style-kit-css` and `layout-style-css`.

This pack follows the **Soft Extrusion** direction: low-contrast molded surfaces, paired light and dark shadows, inset grooves, restrained accents, and app symbols that feel pressed out of the same material as the UI.

## Contract

- Contract version: `0.1.0`
- Required core icons: `64`
- Included icons: `64`
- Optional extras: `0`

## Usage

```html
<link rel="stylesheet" href="dist/neumorphism-ui-style-icons.css">

<body data-ui="neumorphism" data-theme="arctic-indigo" data-mode="light">
  <svg class="neo-icon neo-icon--lg" aria-hidden="true">
    <use href="#neo-icon-dashboard"></use>
  </svg>
</body>
```

Inline SVG or inline sprite usage is recommended because page CSS variables do not cascade into external `<img>` SVGs.
