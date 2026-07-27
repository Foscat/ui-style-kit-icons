# Minimal SaaS UI Style Icons

Theme-aware SVG icon pack for the `minimal-saas` personality in `ui-style-kit-css` and `layout-style-css`.

This pack follows the **Quiet Product Console** direction: restrained monoline marks, low-contrast fills, compact product surfaces, soft borders, and minimal elevation.

## Contract

- Contract version: `1.0.0`
- Required core icons: `64`
- Included icons: `64`
- Optional extras: `0`

## Usage

```html
<link rel="stylesheet" href="dist/minimal-saas-ui-style-icons.css">

<body data-ui="minimal-saas" data-theme="midnight-gold" data-mode="light">
  <svg class="saas-icon saas-icon--lg" aria-hidden="true">
    <use href="#saas-icon-dashboard"></use>
  </svg>
</body>
```

Inline SVG or inline sprite usage is recommended because page CSS variables do not cascade into external `<img>` SVGs.
