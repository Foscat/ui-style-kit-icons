#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const contractDir = path.dirname(fileURLToPath(import.meta.url));
const contractPath =
  process.argv[2] || path.join(contractDir, "icon-contract.json");
const packRoot = process.argv[3];

if (!packRoot) {
  console.error("Usage: node validate-icon-pack.js <contract.json> <pack-root>");
  process.exit(2);
}

const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const iconDir = path.join(packRoot, "icons");
const manifestPath = path.join(packRoot, "manifest.json");
const cssDir = path.join(packRoot, "dist");

const errors = [];
const warnings = [];

if (!fs.existsSync(iconDir)) errors.push("Missing icons directory");
if (!fs.existsSync(manifestPath)) errors.push("Missing manifest.json");
if (!fs.existsSync(cssDir)) errors.push("Missing dist directory");

const files = fs.existsSync(iconDir)
  ? fs.readdirSync(iconDir).filter((file) => file.endsWith(".svg")).sort()
  : [];
const ids = files.map((file) => file.replace(/\.svg$/, ""));
const idSet = new Set(ids);
const required = contract.icons.map((icon) => icon.id);

for (const id of required) {
  if (!idSet.has(id)) errors.push(`Missing required icon: ${id}`);
}

for (const [alias, canonical] of Object.entries(contract.aliases || {})) {
  if (idSet.has(alias)) warnings.push(`Alias icon should be renamed or duplicated as canonical: ${alias} -> ${canonical}`);
}

for (const file of files) {
  const svg = fs.readFileSync(path.join(iconDir, file), "utf8");
  if (!svg.includes("<title")) errors.push(`${file}: missing <title>`);
  if (!svg.includes("<desc")) errors.push(`${file}: missing <desc>`);
  if (!/--usk-[a-z-]+-rgb/.test(svg)) warnings.push(`${file}: no UI Style Kit rgb variable found`);
}

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.contractVersion !== contract.schemaVersion) warnings.push("manifest.contractVersion does not match the icon contract");
  if (manifest.requiredIconCount !== contract.requiredIconCount) warnings.push("manifest.requiredIconCount does not match the icon contract");
}

console.log(JSON.stringify({
  packRoot,
  requiredIconCount: contract.requiredIconCount,
  iconCount: ids.length,
  errors,
  warnings
}, null, 2));

process.exit(errors.length ? 1 : 0);
