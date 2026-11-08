#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const manifest = await readJson("manifest.json");
const icons = Object.entries(manifest.icons).map(([id, icon]) => ({
  id,
  label: icon.label,
  category: icon.category,
  keywords: icon.keywords,
  meaning: icon.label
}));
const contract = {
  schemaVersion: manifest.contractVersion,
  packageVersion: manifest.version,
  collection: manifest.collection,
  requiredIconCount: icons.length,
  styleCount: Object.keys(manifest.styles).length,
  variants: ["themed", "monochrome"],
  sourcePatterns: [
    "svg/<family>/<icon-id>.svg",
    "monochrome/<family>/<icon-id>.svg"
  ],
  icons,
  aliases: manifest.aliases
};
const categoryCounts = new Map();

for (const { category } of icons) {
  categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
}

const categoryRows = [...categoryCounts]
  .map(([category, count]) => `| ${category} | ${count} |`)
  .join("\n");
const iconRows = icons
  .map(
    ({ id, label, category, keywords }) =>
      `| \`${id}\` | ${label} | ${category} | ${keywords.join(", ") || "-"} |`
  )
  .join("\n");
const markdown = `# UI Style Kit Icons contract

- Contract version: \`${contract.schemaVersion}\`
- Package version: \`${contract.packageVersion}\`
- Collection: \`${contract.collection}\`
- Families: **${contract.styleCount}**
- Required icons per family: **${contract.requiredIconCount}**
- Artwork variants: **themed** and **monochrome**

Every registered family must provide one SVG for every canonical icon in both
source patterns. Family order and icon order come from \`manifest.json\`.

## Categories

| Category | Icons |
| --- | ---: |
${categoryRows}

## Canonical icons

| ID | Label | Category | Search keywords |
| --- | --- | --- | --- |
${iconRows}
`;

await writeFile(
  path.join(root, "contract/icon-contract.json"),
  `${JSON.stringify(contract, null, 2)}\n`
);
await writeFile(path.join(root, "contract/icon-contract.md"), markdown);

console.log(`Synchronized the ${icons.length}-icon Collection 01 contract.`);

/**
 * Reads a repository JSON document.
 *
 * @param {string} relativePath Repository-relative file path.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON document.
 */
async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}
