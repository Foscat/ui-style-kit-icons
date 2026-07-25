#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const npmExecPath = process.env.npm_execpath;
const command = npmExecPath ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm";
const args = npmExecPath
  ? [npmExecPath, "pack", "--dry-run", "--json"]
  : ["pack", "--dry-run", "--json"];
const result = spawnSync(command, args, {
  cwd: process.cwd(),
  encoding: "utf8"
});

if (result.status !== 0) {
  process.stderr.write(result.error?.message ?? result.stderr ?? result.stdout ?? "");
  process.exit(result.status ?? 1);
}

const [{ files }] = JSON.parse(result.stdout);
const names = files.map((file) => file.path).sort();
const required = [
  "LICENSE",
  "README.md",
  "contract/icon-contract.json",
  "contract/pack-audit.json",
  "dist/registry.js",
  "dist/registry.json",
  "dist/ui-style-kit-icons.css",
  "dist/ui-style-kit-icons.d.ts",
  "dist/ui-style-kit-icons.js",
  "dist/ui-style-kit-icons.svg",
  "icons/home.svg",
  "manifest.json",
  "packs/synthwave/icons/cassette.svg",
  "sprite/ui-style-kit-icons.inline.svg",
  "style-source/system-style-source.md"
];
const excludedPrefixes = [
  ".github/",
  ".well-known/",
  "assets/",
  "demo/",
  "output/",
  "scripts/",
  "src/",
  "test-results/",
  "tests/",
  "tmp/",
  "packs/tactile-ui-style-icons/"
];
const excludedFiles = [
  ".nojekyll",
  "404.html",
  "browserconfig.xml",
  "demo.css",
  "demo.js",
  "humans.txt",
  "index.html",
  "llms.txt",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest"
];
const missing = required.filter((file) => !names.includes(file));
const unexpected = names.filter(
  (file) =>
    excludedFiles.includes(file) ||
    excludedPrefixes.some((prefix) => file.startsWith(prefix))
);

if (missing.length > 0 || unexpected.length > 0) {
  if (missing.length > 0) {
    console.error(`Missing package files:\n${missing.map((file) => `- ${file}`).join("\n")}`);
  }

  if (unexpected.length > 0) {
    console.error(
      `Unexpected package files:\n${unexpected.map((file) => `- ${file}`).join("\n")}`
    );
  }

  process.exit(1);
}

console.log(`Package dry-run surface passed with ${names.length} files.`);
