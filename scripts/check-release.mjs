#!/usr/bin/env node
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const packageJson = await readJson("package.json");
const packageLock = await readJson("package-lock.json");
const contract = await readJson("contract/icon-contract.json");
const manifest = await readJson("manifest.json");
const registry = await readJson("dist/registry.json");
const version = packageJson.version;
const repositoryUrl = "https://github.com/Foscat/ui-style-kit-icons";
const pagesUrl = "https://foscat.github.io/ui-style-kit-icons/";
const publicTextFiles = [
  ".well-known/security.txt",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "README.md",
  "SECURITY.md",
  "docs/404.html",
  "docs/index.html",
  "docs/robots.txt",
  "docs/site.webmanifest",
  "docs/sitemap.xml",
  "llms.txt",
  "package.json"
];
const pagesWorkflow = await readFile(
  join(root, ".github/workflows/pages.yml"),
  "utf8"
);
const ciWorkflow = await readFile(
  join(root, ".github/workflows/ci.yml"),
  "utf8"
);

assert.match(version, /^\d+\.\d+\.\d+$/u, "Release version must be stable semver.");
assert.equal(packageJson.engines?.node, ">=20");
assert.equal(packageJson.repository?.url, `git+${repositoryUrl}.git`);
assert.equal(packageJson.homepage, pagesUrl);
assert.equal(packageJson.publishConfig?.access, "public");
assert.equal(packageJson.dependencies, undefined);
assert.equal(packageLock.version, version);
assert.equal(packageLock.packages?.[""]?.version, version);
assert.equal(manifest.version, version);
assert.equal(manifest.contractVersion, contract.schemaVersion);
assert.equal(Object.keys(manifest.styles).length, 20);
assert.equal(Object.keys(manifest.icons).length, 174);
assert.equal(registry.version, version);
assert.equal(registry.contractVersion, contract.schemaVersion);
assert.equal(registry.packCount, Object.keys(manifest.styles).length);
assert.equal(registry.requiredIconCount, Object.keys(manifest.icons).length);
assert.equal(registry.packs.length, Object.keys(manifest.styles).length);
assert.deepEqual(registry.aliases, manifest.aliases);

for (const pack of registry.packs) {
  assert.equal(pack.version, version, `${pack.id} registry version`);
  assert.equal(pack.iconCount, manifest.iconsPerStyle, `${pack.id} icon count`);
}

const changelog = await readFile(join(root, "CHANGELOG.md"), "utf8");
assert.match(
  changelog,
  new RegExp(
    `^## \\[${escapeRegExp(version)}\\] - \\d{4}-\\d{2}-\\d{2}$`,
    "mu"
  ),
  `CHANGELOG.md has no dated ${version} release entry.`
);

for (const relativePath of publicTextFiles) {
  const source = await readFile(join(root, relativePath), "utf8");

  assert.doesNotMatch(source, /github\.com\/Foscat\/ui-style-kit-css-icons/u);
  assert.doesNotMatch(source, /foscat\.github\.io\/ui-style-kit-css-icons/u);
  assert.doesNotMatch(source, /Â/u);
}

for (const relativePath of [
  "assets/docs",
  "assets/head-tags.html",
  "assets/ui-style-kit-icons-mark.png",
  "docs/assets/brand/ui-style-kit-icons-mark.png",
  "icons",
  "packs",
  "style-source"
]) {
  await assertMissing(relativePath);
}

for (const [relativePath, width, height] of [
  ["assets/favicon-16x16.png", 16, 16],
  ["assets/favicon-32x32.png", 32, 32],
  ["assets/favicon-48x48.png", 48, 48],
  ["assets/apple-touch-icon.png", 180, 180],
  ["assets/icon-192.png", 192, 192],
  ["assets/icon-512.png", 512, 512],
  ["assets/icon-maskable-512.png", 512, 512],
  ["assets/ui-style-kit-icons-social-preview.png", 1200, 630],
  ["docs/assets/brand/ui-style-kit-icons-social-preview.png", 1200, 630]
]) {
  assert.deepEqual(await pngDimensions(relativePath), { width, height }, relativePath);
}

for (const relativePath of [
  "assets/favicon.ico",
  "assets/favicon.svg",
  "docs/assets/brand/favicon.ico",
  "docs/assets/brand/favicon.svg",
  "output/github-pages/index.html",
  "output/github-pages/assets/brand/ui-style-kit-icons-social-preview.png"
]) {
  await access(join(root, relativePath));
}

assert.deepEqual(
  await readFile(join(root, "assets", "ui-style-kit-icons-social-preview.png")),
  await readFile(
    join(
      root,
      "docs",
      "assets",
      "brand",
      "ui-style-kit-icons-social-preview.png"
    )
  ),
  "The source and Pages social previews must be byte-identical."
);
assert.match(pagesWorkflow, /run: npm run release:verify/u);
assert.match(pagesWorkflow, /actions\/checkout@v7/u);
assert.match(pagesWorkflow, /actions\/setup-node@v7/u);
assert.match(pagesWorkflow, /actions\/upload-pages-artifact@v5/u);
assert.match(pagesWorkflow, /actions\/deploy-pages@v5/u);
assert.match(ciWorkflow, /node-version: \[20, 22, 24\]/u);
assert.match(ciWorkflow, /run: npm run release:verify/u);

console.log(`Release surfaces are synchronized for ui-style-kit-icons@${version}.`);

/**
 * Reads a repository JSON document.
 *
 * @param {string} relativePath Repository-relative file path.
 * @returns {Promise<Record<string, any>>} Parsed JSON value.
 */
async function readJson(relativePath) {
  return JSON.parse(await readFile(join(root, relativePath), "utf8"));
}

/**
 * Proves that a retired repository path is absent.
 *
 * @param {string} relativePath Repository-relative path.
 * @returns {Promise<void>}
 */
async function assertMissing(relativePath) {
  try {
    await access(join(root, relativePath));
    assert.fail(`Stale duplicate path exists: ${relativePath}`);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}

/**
 * Reads the width and height from a PNG IHDR chunk.
 *
 * @param {string} relativePath Repository-relative PNG path.
 * @returns {Promise<{width: number, height: number}>} Image dimensions.
 */
async function pngDimensions(relativePath) {
  const source = await readFile(join(root, relativePath));
  const signature = source.subarray(0, 8).toString("hex");

  assert.equal(signature, "89504e470d0a1a0a", `${relativePath} is not a PNG.`);
  return {
    width: source.readUInt32BE(16),
    height: source.readUInt32BE(20)
  };
}

/**
 * Escapes user-controlled text for a regular expression.
 *
 * @param {string} value Raw text.
 * @returns {string} Escaped regular-expression source.
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
