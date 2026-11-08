import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = await readJson("manifest.json");
const registry = await readJson("dist/registry.json");
const assetHashes = await readJson("reference/asset-hashes.json");
const styleIds = Object.keys(manifest.styles);
const iconIds = Object.keys(manifest.icons);

/**
 * Reads a repository JSON document.
 *
 * @param {string} relativePath Repository-relative file path.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON document.
 */
async function readJson(relativePath) {
  return JSON.parse(await readFile(join(root, relativePath), "utf8"));
}

/**
 * Returns the SHA-256 digest for a repository file.
 *
 * @param {string} relativePath Repository-relative file path.
 * @returns {Promise<string>} Lowercase hexadecimal digest.
 */
async function sha256(relativePath) {
  const source = await readFile(join(root, relativePath));
  return createHash("sha256").update(source).digest("hex");
}

test("the public registry exposes the complete expanded Collection 01", () => {
  assert.equal(manifest.iconsPerStyle, 174);
  assert.equal(styleIds.length, 20);
  assert.equal(iconIds.length, 174);
  assert.equal(registry.packCount, styleIds.length);
  assert.equal(registry.requiredIconCount, iconIds.length);
  assert.deepEqual(registry.aliases, manifest.aliases);
  assert.deepEqual(
    registry.packs.map(({ id }) => id),
    styleIds
  );

  for (const pack of registry.packs) {
    assert.deepEqual(
      pack.coreIcons.map(({ id }) => id),
      iconIds,
      `${pack.id} publishes the canonical icon order`
    );
    assert.equal(pack.optionalIcons.length, 0, pack.id);
    assert.equal(pack.iconCount, iconIds.length, pack.id);

    for (const icon of pack.coreIcons) {
      assert.equal(icon.file, `svg/${pack.id}/${icon.id}.svg`);
      assert.equal(
        icon.monochromeFile,
        `monochrome/${pack.id}/${icon.id}.svg`
      );
    }
  }
});

test("the supplied artwork matches the locked expanded asset inventory", async () => {
  const expectedPaths = [];

  for (const styleId of styleIds) {
    for (const variant of ["svg", "monochrome"]) {
      const directory = join(root, variant, styleId);
      const files = (await readdir(directory))
        .filter((file) => file.endsWith(".svg"))
        .sort();

      assert.deepEqual(
        files,
        iconIds.map((iconId) => `${iconId}.svg`).sort(),
        `${variant}/${styleId} contains the canonical icon set`
      );

      for (const file of files) {
        expectedPaths.push(`${variant}/${styleId}/${file}`);
      }
    }
  }

  assert.equal(expectedPaths.length, 6960);
  assert.deepEqual(Object.keys(assetHashes).sort(), expectedPaths.sort());

  for (const relativePath of expectedPaths) {
    assert.equal(await sha256(relativePath), assetHashes[relativePath], relativePath);
  }
});
