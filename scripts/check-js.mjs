#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const ignoredDirs = new Set([
  ".agents",
  ".codex",
  ".git",
  ".github",
  ".tmp",
  "coverage",
  "node_modules",
  "output",
  "playwright-report",
  "test-results",
  "tmp"
]);
const files = collectJavaScriptFiles(root).sort();

let failed = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    cwd: root,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    failed = true;
    process.stderr.write(result.stderr || result.stdout);
  }
}

if (failed) {
  process.exit(1);
}

const runtime = await import(pathToFileURL(path.join(root, "dist/ui-style-kit-icons.js")));
const registry = await import(pathToFileURL(path.join(root, "dist/registry.js")));
const publicSubpaths = [
  "ui-style-kit-icons",
  "ui-style-kit-icons/element",
  "ui-style-kit-icons/registry",
  "ui-style-kit-icons/registry.json",
  "ui-style-kit-icons/contract.json",
  "ui-style-kit-icons/css.css",
  "ui-style-kit-icons/sprite.svg",
  "ui-style-kit-icons/icons/home.svg",
  "ui-style-kit-icons/packs/synthwave/icons/cassette.svg"
];

for (const specifier of publicSubpaths) {
  import.meta.resolve(specifier);
}

if (typeof runtime.defineUiStyleIcon !== "function" || registry.packs.length !== 12) {
  throw new Error("Package runtime or registry exports are incomplete.");
}

console.log(`Checked ${files.length} JavaScript files and package ESM imports.`);

function collectJavaScriptFiles(dir) {
  const discovered = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        discovered.push(...collectJavaScriptFiles(path.join(dir, entry.name)));
      }
      continue;
    }

    if (![".js", ".mjs"].includes(path.extname(entry.name))) {
      continue;
    }

    discovered.push(path.relative(root, path.join(dir, entry.name)).replaceAll(path.sep, "/"));
  }

  return discovered;
}
