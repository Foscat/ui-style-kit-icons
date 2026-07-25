#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "output/github-pages");
const siteFiles = [
  ".nojekyll",
  "404.html",
  "browserconfig.xml",
  "demo.css",
  "demo.js",
  "humans.txt",
  "index.html",
  "llms.txt",
  "manifest.json",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest"
];
const siteDirs = [
  ".well-known",
  "assets",
  "contract",
  "dist",
  "icons",
  "packs",
  "sprite",
  "style-source"
];

await assertInsideRoot(outDir);
await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });

for (const file of siteFiles) {
  await copyPath(file);
}

for (const dir of siteDirs) {
  await copyPath(dir);
}

console.log(`Built GitHub Pages artifact at ${path.relative(root, outDir).replaceAll(path.sep, "/")}.`);

async function copyPath(relativePath) {
  const from = path.join(root, relativePath);
  const to = path.join(outDir, relativePath);

  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.cp(from, to, { recursive: true });
}

async function assertInsideRoot(target) {
  const rootReal = await fs.realpath(root);
  const parent = path.dirname(target);

  await fs.mkdir(parent, { recursive: true });

  const resolvedParent = await fs.realpath(parent);

  if (!resolvedParent.startsWith(rootReal)) {
    throw new Error(`Refusing to write Pages artifact outside this repository: ${target}`);
  }
}
