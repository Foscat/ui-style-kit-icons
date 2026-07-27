#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const packageJson = await readJson(join(root, "package.json"));
const registry = await readJson(join(root, "dist", "registry.json"));
const uiPackage = await readJson(require.resolve("ui-style-kit-css/package.json"));
const uiManifest = await readJson(require.resolve("ui-style-kit-css/manifest.json"));
const interactivePackage = await readJson(
  require.resolve("interactive-surface-css/package.json")
);
const layoutPackage = await readJson(
  require.resolve("layout-style-css/package.json")
);
const uiVisualPath = require.resolve("ui-style-kit-css/visual.min.css");
const uiBridgePath = require.resolve(
  "ui-style-kit-css/interactive-surface-theme.css"
);
const interactiveCorePath = require.resolve(
  "interactive-surface-css/state-core.css"
);
const layoutCssPath = require.resolve("layout-style-css/min.css");
const uiVisualCss = await readFile(uiVisualPath, "utf8");
const indexHtml = await readFile(join(root, "index.html"), "utf8");
const compatibility = registry.uiStyleKitCssCompatibility;
const packIds = new Set(registry.packs.map(({ id }) => id));
const presetIds = new Set(uiManifest.presets.map(({ id }) => id));
const stylesheetFixtures = [
  {
    name: "UI Style Kit visual CSS",
    url: `https://unpkg.com/ui-style-kit-css@${uiPackage.version}/dist/ui-style-kit.visual.min.css`,
    path: uiVisualPath
  },
  {
    name: "UI Style Kit Interactive Surface theme bridge",
    url: `https://unpkg.com/ui-style-kit-css@${uiPackage.version}/styles/interactive-surface-theme.css`,
    path: uiBridgePath
  },
  {
    name: "Interactive Surface state core",
    url: `https://unpkg.com/interactive-surface-css@${interactivePackage.version}/state-core.css`,
    path: interactiveCorePath
  },
  {
    name: "Layout Style core",
    url: `https://unpkg.com/layout-style-css@${layoutPackage.version}/dist/layout-style-css.min.css`,
    path: layoutCssPath
  }
];

assert.equal(compatibility.packageName, "ui-style-kit-css");
assert.equal(
  packageJson.peerDependencies?.["ui-style-kit-css"],
  compatibility.versionRange
);
assert.equal(
  packageJson.peerDependenciesMeta?.["ui-style-kit-css"]?.optional,
  true
);
assert.equal(packageJson.devDependencies?.["ui-style-kit-css"], uiPackage.version);
assert.equal(
  packageJson.devDependencies?.["interactive-surface-css"],
  interactivePackage.version
);
assert.equal(
  packageJson.devDependencies?.["layout-style-css"],
  layoutPackage.version
);
assert.equal(uiPackage.version, "2.1.0");
assert.equal(interactivePackage.version, "1.5.0");
assert.equal(layoutPackage.version, "2.1.0");
for (const demoOnlyPackage of [
  "interactive-surface-css",
  "layout-style-css"
]) {
  assert.equal(packageJson.dependencies?.[demoOnlyPackage], undefined);
  assert.equal(packageJson.peerDependencies?.[demoOnlyPackage], undefined);
}
assert.deepEqual(uiManifest.themes, compatibility.themes);
assert.deepEqual(uiManifest.modes, compatibility.modes);

for (const preset of uiManifest.presets) {
  const mappedPack = registry.styleAliases[preset.id];

  assert.ok(mappedPack, `No icon pack mapping exists for data-ui="${preset.id}".`);
  assert.ok(
    packIds.has(mappedPack),
    `data-ui="${preset.id}" maps to missing pack "${mappedPack}".`
  );
}

for (const pack of registry.packs) {
  assert.ok(
    presetIds.has(pack.uiStyle),
    `${pack.id} declares unsupported uiStyle "${pack.uiStyle}".`
  );
}

for (const token of compatibility.requiredRgbTokens) {
  assert.match(
    uiVisualCss,
    new RegExp(`${escapeRegExp(token)}\\s*:`, "u"),
    `ui-style-kit-css is missing ${token}.`
  );
}

assert.match(indexHtml, /@layer\s+demo\s*,\s*ui-style-kit\s*,\s*ly\s*;/u);

const stylesheetHrefs = [
  ...indexHtml.matchAll(
    /<link\s+[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/gu
  )
].map((match) => match[1]);
assert.deepEqual(stylesheetHrefs, [
  ...stylesheetFixtures.map(({ url }) => url),
  "./dist/ui-style-kit-icons.css",
  "./demo.css"
]);

for (const fixture of stylesheetFixtures) {
  const tag = indexHtml.match(
    new RegExp(
      `<link\\s+[^>]*href="${escapeRegExp(fixture.url)}"[^>]*>`,
      "u"
    )
  )?.[0];

  assert.ok(tag, `${fixture.name} is missing from the demo.`);
  assert.match(tag, /\scrossorigin="anonymous"/u);

  const declaredIntegrity = tag.match(/\sintegrity="([^"]+)"/u)?.[1];
  const actualIntegrity = `sha384-${createHash("sha384")
    .update(await readFile(fixture.path))
    .digest("base64")}`;

  // CDN pins must match the installed fixtures exercised by browser checks.
  assert.equal(
    declaredIntegrity,
    actualIntegrity,
    `${fixture.name} has a stale SRI hash.`
  );
}

console.log(
  `Validated ${registry.packs.length} icon packs against ui-style-kit-css@${uiPackage.version}, interactive-surface-css@${interactivePackage.version}, and layout-style-css@${layoutPackage.version}.`
);

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
