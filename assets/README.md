# Brand assets

This directory is the source of truth for the library's favicon, app icons, and 1200 × 630 social preview.

| File | Use |
| --- | --- |
| `favicon.svg` | Scalable browser and header mark |
| `favicon.ico` | 16, 32, and 48 px browser icon |
| `favicon-{16,32,48}x{16,32,48}.png` | Individual PNG sizes |
| `apple-touch-icon.png` | 180 px Apple touch icon |
| `icon-192.png`, `icon-512.png` | Web app icons |
| `icon-maskable-512.png` | Maskable web app icon |
| `ui-style-kit-icons-social-preview.png` | Open Graph and Twitter image |

The deployable copies live in `docs/assets/brand/`. The source and hosted social preview are generated together by:

```bash
npm run assets:build
```

The preview describes Collection 01 accurately: 20 families, 174 semantic glyphs per family, and 6,960 verified theme-aware and monochrome SVG files.

The hosted metadata uses `https://foscat.github.io/ui-style-kit-icons/`. If another deployment uses these files, its canonical, Open Graph, Twitter, and manifest URLs must be changed to that deployment's public address.
