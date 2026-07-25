# Contributing

This package is a public icon library for the UI Style Kit CSS ecosystem. Keep changes focused on icon assets, the shared semantic contract, package exports, and the demo that proves those surfaces work.

Before opening a pull request, run:

```sh
npm run verify
npm run check:demo
npm pack --dry-run --json
```

Do not bump versions, publish to npm, create tags, or deploy GitHub Pages from a cleanup branch unless that release work is explicitly requested.
