#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const packageJson = await readJson("package.json");
const manifest = await readJson("manifest.json");
const contract = await readJson("contract/icon-contract.json");
const registry = await readJson("dist/registry.json");
const iconIds = Object.keys(manifest.icons);
const styleIds = Object.keys(manifest.styles);

assert.equal(manifest.version, packageJson.version);
assert.equal(manifest.contractVersion, contract.schemaVersion);
assert.equal(contract.packageVersion, packageJson.version);
assert.equal(contract.collection, manifest.collection);
assert.equal(contract.requiredIconCount, iconIds.length);
assert.equal(contract.styleCount, styleIds.length);
assert.deepEqual(contract.aliases, manifest.aliases);
assert.deepEqual(
  contract.icons.map(({ id }) => id),
  iconIds,
  "The generated contract must preserve manifest icon order."
);
assert.equal(registry.version, packageJson.version);
assert.equal(registry.contractVersion, contract.schemaVersion);
assert.equal(registry.requiredIconCount, contract.requiredIconCount);
assert.equal(registry.packCount, contract.styleCount);
assert.deepEqual(registry.coreIconIds, iconIds);
assert.deepEqual(registry.aliases, manifest.aliases);
assert.deepEqual(registry.styleAliases, manifest.styleAliases);
assert.deepEqual(
  registry.packs.map(({ id }) => id),
  styleIds
);

for (const pack of registry.packs) {
  assert.equal(pack.version, packageJson.version, pack.id);
  assert.equal(pack.contractVersion, contract.schemaVersion, pack.id);
  assert.equal(pack.iconCount, contract.requiredIconCount, pack.id);
  assert.equal(pack.optionalIconCount, 0, pack.id);
  assert.deepEqual(
    pack.coreIcons.map(({ id }) => id),
    iconIds,
    pack.id
  );
}

console.log(
  `Validated the ${contract.requiredIconCount}-icon contract across ${registry.packCount} families.`
);

/**
 * Reads a repository JSON document.
 *
 * @param {string} relativePath Repository-relative file path.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON document.
 */
async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}
