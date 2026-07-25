#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const contractPath = path.join(root, "contract/icon-contract.json");
const { PACK_DEFINITIONS } = await import(pathToFileURL(path.join(root, "src/packs.mjs")));
// Contract validation is scoped to registered public packs, not local drop-in folders.
const packRoots = [
  ...PACK_DEFINITIONS.map((definition) => definition.sourcePath)
].sort((a, b) => (a === "." ? -1 : b === "." ? 1 : a.localeCompare(b)));

const requiredRootFiles = [
  "dist/ui-style-kit-icons.css",
  "dist/ui-style-kit-icons.js",
  "dist/ui-style-kit-icons.d.ts",
  "dist/registry.js",
  "dist/registry.json",
  "sprite/ui-style-kit-icons.inline.svg",
  "style-source/system-style-source.md",
  "contract/icon-contract.json",
  "contract/pack-audit.json",
  "contract/pack-audit.md"
];

const missing = requiredRootFiles.filter((file) => !fs.existsSync(path.join(root, file)));

for (const packRoot of packRoots.filter((packRoot) => packRoot !== ".")) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, packRoot, "manifest.json"), "utf8")
  );
  const styleSourcePath = path.join(
    root,
    packRoot,
    "style-source",
    `${manifest.style}-style-source.md`
  );

  if (!fs.existsSync(styleSourcePath)) {
    missing.push(path.relative(root, styleSourcePath).replaceAll(path.sep, "/"));
  }
}

if (missing.length > 0) {
  console.error(`Missing required public files:\n${missing.map((file) => `- ${file}`).join("\n")}`);
  process.exit(1);
}

for (const packRoot of packRoots) {
  const result = spawnSync(
    process.execPath,
    ["contract/validate-icon-pack.js", contractPath, packRoot],
    { cwd: root, encoding: "utf8" }
  );

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
}

const registry = JSON.parse(fs.readFileSync(path.join(root, "dist/registry.json"), "utf8"));

if (registry.packCount !== registry.packs.length) {
  console.error("dist/registry.json packCount does not match packs.length.");
  process.exit(1);
}

console.log(`Validated ${packRoots.length} icon pack roots and ${registry.packs.length} registry packs.`);
