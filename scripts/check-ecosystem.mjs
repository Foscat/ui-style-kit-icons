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
const layoutPackage = await readJson(
  require.resolve("layout-style-css/package.json")
);
const uiVisualPath = require.resolve("ui-style-kit-css/visual.min.css");
const layoutCssPath = require.resolve("layout-style-css/min.css");
const uiVisualCss = await readFile(uiVisualPath, "utf8");
const indexHtml = await readFile(join(root, "index.html"), "utf8");
const compatibility = registry.uiStyleKitCssCompatibility;
const packIds = new Set(registry.packs.map(({ id }) => id));
const presetIds = new Set(uiManifest.presets.map(({ id }) => id));

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
assert.equal(packageJson.devDependencies?.["layout-style-css"], layoutPackage.version);
assert.equal(uiPackage.version, "2.1.0");
assert.equal(layoutPackage.version, "2.1.0");
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

assert.match(
  indexHtml,
  new RegExp(
    `https://unpkg\\.com/ui-style-kit-css@${escapeRegExp(uiPackage.version)}/`,
    "u"
  )
);
assert.match(
  indexHtml,
  new RegExp(
    `https://unpkg\\.com/layout-style-css@${escapeRegExp(layoutPackage.version)}/`,
    "u"
  )
);

const declaredUiIntegrity = indexHtml.match(
  /href="https:\/\/unpkg\.com\/ui-style-kit-css@[^"]+" integrity="([^"]+)"/u
)?.[1];
const declaredLayoutIntegrity = indexHtml.match(
  /href="https:\/\/unpkg\.com\/layout-style-css@[^"]+" integrity="([^"]+)"/u
)?.[1];
const actualUiIntegrity = `sha384-${createHash("sha384")
  .update(await readFile(uiVisualPath))
  .digest("base64")}`;
const actualLayoutIntegrity = `sha384-${createHash("sha384")
  .update(await readFile(layoutCssPath))
  .digest("base64")}`;

// CDN pins must match the exact release fixtures exercised by browser tests.
assert.equal(declaredUiIntegrity, actualUiIntegrity);
assert.equal(declaredLayoutIntegrity, actualLayoutIntegrity);

console.log(
  `Validated ${registry.packs.length} icon packs against ui-style-kit-css@${uiPackage.version} and layout-style-css@${layoutPackage.version}.`
);

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
