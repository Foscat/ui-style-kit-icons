#!/usr/bin/env node
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PACK_DEFINITIONS } from "../src/packs.mjs";

const root = process.cwd();
const packageJson = await readJson("package.json");
const packageLock = await readJson("package-lock.json");
const contract = await readJson("contract/icon-contract.json");
const manifest = await readJson("manifest.json");
const registry = await readJson("dist/registry.json");
const version = packageJson.version;
const repositoryUrl = "https://github.com/Foscat/ui-style-kit-css-icons";
const pagesUrl = "https://foscat.github.io/ui-style-kit-css-icons/";
const publicTextFiles = [
  ".well-known/security.txt",
  "404.html",
  "CONTRIBUTING.md",
  "README.md",
  "SECURITY.md",
  "demo.js",
  "index.html",
  "llms.txt",
  "package.json",
  "robots.txt",
  "site.webmanifest",
  "sitemap.xml"
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
assert.equal(packageLock.version, version);
assert.equal(packageLock.packages?.[""]?.version, version);
assert.equal(manifest.version, version);
assert.equal(manifest.contractVersion, contract.schemaVersion);
assert.equal(registry.version, version);
assert.equal(registry.contractVersion, contract.schemaVersion);
assert.equal(registry.packs.length, 12);
assert.equal(packageJson.dependencies, undefined);

for (const pack of registry.packs) {
  assert.equal(pack.version, version, `${pack.id} registry version`);
}

for (const { id, sourcePath } of PACK_DEFINITIONS.filter(
  ({ sourcePath }) => sourcePath !== "."
)) {
  const packPackage = await readJson(join(sourcePath, "package.json"));
  const packManifest = await readJson(join(sourcePath, "manifest.json"));
  const packReadme = await readFile(join(root, sourcePath, "README.md"), "utf8");

  assert.equal(packPackage.version, version, `${id} package version`);
  assert.equal(packManifest.version, version, `${id} manifest version`);
  assert.equal(
    packManifest.contractVersion,
    contract.schemaVersion,
    `${id} contract version`
  );
  assert.match(
    packReadme,
    new RegExp(
      `- Contract version: \`${escapeRegExp(contract.schemaVersion)}\``,
      "u"
    ),
    `${id} README contract version`
  );
}

const changelog = await readFile(join(root, "CHANGELOG.md"), "utf8");
assert.match(
  changelog,
  new RegExp(`^## \\[${escapeRegExp(version)}\\]`, "mu"),
  `CHANGELOG.md has no ${version} release entry.`
);

for (const relativePath of publicTextFiles) {
  const source = await readFile(join(root, relativePath), "utf8");

  assert.doesNotMatch(
    source,
    /github\.com\/Foscat\/ui-style-kit-icons/u
  );
  assert.doesNotMatch(source, /foscat\.github\.io\/ui-style-kit-icons/u);
  assert.doesNotMatch(source, /Â/u);
}

for (const relativePath of ["assets/demo", "assets/scripts", "packs/tactile-ui-style-icons"]) {
  await assertMissing(relativePath);
}

for (const [relativePath, width, height] of [
  ["assets/favicon-16x16.png", 16, 16],
  ["assets/favicon-32x32.png", 32, 32],
  ["assets/favicon-48x48.png", 48, 48],
  ["assets/apple-touch-icon.png", 180, 180],
  ["assets/icon-192.png", 192, 192],
  ["assets/icon-512.png", 512, 512],
  ["assets/social-card.png", 1200, 630]
]) {
  const dimensions = await pngDimensions(relativePath);

  assert.deepEqual(dimensions, { width, height }, relativePath);
}

for (const relativePath of [
  "assets/favicon.ico",
  "assets/favicon.svg",
  "output/github-pages/index.html",
  "output/github-pages/assets/social-card.png"
]) {
  await access(join(root, relativePath));
}

assert.match(pagesWorkflow, /run: npm run release:verify/u);
assert.match(pagesWorkflow, /actions\/checkout@v7/u);
assert.match(pagesWorkflow, /actions\/setup-node@v7/u);
assert.match(pagesWorkflow, /actions\/upload-pages-artifact@v5/u);
assert.match(pagesWorkflow, /actions\/deploy-pages@v5/u);
assert.match(ciWorkflow, /node-version: \[20, 22, 24\]/u);
assert.match(ciWorkflow, /run: npm run release:verify/u);

const indexHtml = await readFile(join(root, "index.html"), "utf8");
assert.match(indexHtml, /https:\/\/foscat\.github\.io\/Layout-Style-CSS\//u);
assert.match(
  indexHtml,
  /https:\/\/foscat\.github\.io\/Interactive-Surface-CSS\//u
);
assert.doesNotMatch(
  indexHtml,
  /https:\/\/foscat\.github\.io\/(?:layout-style-css|interactive-surface-css)\//u
);

console.log(`Release surfaces are synchronized for ui-style-kit-icons@${version}.`);

async function readJson(relativePath) {
  return JSON.parse(await readFile(join(root, relativePath), "utf8"));
}

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

async function pngDimensions(relativePath) {
  const source = await readFile(join(root, relativePath));
  const signature = source.subarray(0, 8).toString("hex");

  assert.equal(signature, "89504e470d0a1a0a", `${relativePath} is not a PNG.`);
  return {
    width: source.readUInt32BE(16),
    height: source.readUInt32BE(20)
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
