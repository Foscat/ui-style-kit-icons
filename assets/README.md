# Brand Assets

These files are the production favicon, app-icon, and social-preview assets for
the GitHub Pages demo.

Regenerate them from the package version, homepage, and current icon artwork:

```sh
npm run assets:build
```

The generator uses the repository's pinned Playwright version and writes only
to `assets/` plus the ignored `output/brand-assets/` working directory.
