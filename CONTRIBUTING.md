# Contributing

This package is a public icon library for the UI Style Kit CSS ecosystem. Keep
changes focused on icon assets, the shared semantic contract, package exports,
and the demo that proves those surfaces work.

When changing the catalog, update `manifest.json` first, refresh the generated
contract, and preserve the locked asset inventory:

```sh
npm run contracts:write
npm run build
npm run assets:check
npm run coverage:check
npm run demo:build
```

Add or update one focused test before changing runtime behavior. Run that test
again after the implementation, then continue through the remaining checks.

Before opening a pull request, run:

```sh
npm run release:verify
npm pack --dry-run --json
```

Do not bump versions, publish to npm, create tags, or deploy GitHub Pages from a cleanup branch unless that release work is explicitly requested.
