#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const manifest = await readJson("manifest.json");
const assetHashes = await readJson("reference/asset-hashes.json");
const approval = await readJson("reference/organic-modern-approval-lock.json");
const styleIds = Object.keys(manifest.styles);
const iconIds = Object.keys(manifest.icons);
const expectedPaths = [];

assert.equal(manifest.name, "ui-style-kit-icons");
assert.equal(manifest.iconsPerStyle, iconIds.length);
assert.equal(manifest.styleCount, styleIds.length);
assert.equal(manifest.themeCount, 25);
assert.deepEqual(manifest.modes, ["light", "dark", "contrast"]);

for (const styleId of styleIds) {
  for (const variant of ["svg", "monochrome"]) {
    const relativeDirectory = `${variant}/${styleId}`;
    const files = (await readdir(path.join(root, relativeDirectory)))
      .filter((file) => file.endsWith(".svg"))
      .sort();

    assert.deepEqual(
      files,
      iconIds.map((iconId) => `${iconId}.svg`).sort(),
      `${relativeDirectory} must contain the canonical icon set`
    );

    for (const file of files) {
      const relativePath = `${relativeDirectory}/${file}`;
      const source = await readFile(path.join(root, relativePath), "utf8");

      assert.match(source, /^<svg\b/u, `${relativePath} must be an SVG document`);
      assert.match(source, /\bviewBox="0 0 24 24"/u, relativePath);
      if (variant === "svg") {
        assert.match(
          source,
          new RegExp(`data-icon-style="${styleId}"`, "u"),
          relativePath
        );
      } else {
        assert.match(source, /currentColor/u, relativePath);
      }
      assert.doesNotMatch(
        source,
        /<(?:foreignObject|iframe|image|script)\b|\bon\w+=/iu,
        `${relativePath} must not contain executable or remote-resource surfaces`
      );
      expectedPaths.push(relativePath);
    }
  }
}

assert.equal(expectedPaths.length, styleIds.length * iconIds.length * 2);
assert.deepEqual(Object.keys(assetHashes).sort(), expectedPaths.sort());

for (const relativePath of expectedPaths) {
  assert.equal(await sha256(relativePath), assetHashes[relativePath], relativePath);
}

assert.equal(approval.status, "approved-artwork-baseline");
assert.equal(approval.style, "organic-modern");
assert.ok(
  approval.iconsPerStyle <= manifest.iconsPerStyle,
  "The approved baseline cannot contain more icons than the current collection."
);

for (const [relativePath, expectedHash] of Object.entries(approval.files)) {
  const repositoryPath = /^(?:svg|monochrome)\//u.test(relativePath)
    ? relativePath
    : `paint/${relativePath}`;

  assert.equal(await sha256(repositoryPath), expectedHash, repositoryPath);
}

for (const retiredPath of ["icons", "packs", "style-source"]) {
  await assertMissing(retiredPath);
}

console.log(
  `Verified ${expectedPaths.length} locked SVG assets across ${styleIds.length} Collection 01 families.`
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

/**
 * Returns a repository file's SHA-256 digest.
 *
 * @param {string} relativePath Repository-relative file path.
 * @returns {Promise<string>} Lowercase hexadecimal digest.
 */
async function sha256(relativePath) {
  const source = await readFile(path.join(root, relativePath));
  return createHash("sha256").update(source).digest("hex");
}

/**
 * Verifies that a retired repository path no longer exists.
 *
 * @param {string} relativePath Repository-relative path.
 * @returns {Promise<void>}
 */
async function assertMissing(relativePath) {
  await assert.rejects(
    access(path.join(root, relativePath)),
    (error) => error?.code === "ENOENT",
    `Retired asset path still exists: ${relativePath}`
  );
}
