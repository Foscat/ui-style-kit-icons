#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const packageJson = await readJson("package.json");
const contract = await readJson("contract/icon-contract.json");
const version = packageJson.version;
const contractVersion = contract.schemaVersion;

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(version)) {
  throw new Error(`Invalid package version: ${version}`);
}

await updateJson("package-lock.json", (lock) => {
  lock.version = version;
  lock.packages[""].version = version;
});
await updateJson("manifest.json", (manifest) => {
  manifest.version = version;
  manifest.contractVersion = contractVersion;
});

await replaceText(
  "README.md",
  /- Package version: `[^`]+`/u,
  `- Package version: \`${version}\``
);
await replaceText(
  "README.md",
  /- Contract version: `[^`]+`/u,
  `- Contract version: \`${contractVersion}\``
);
await replaceText(
  "contract/icon-contract.md",
  /Contract version: `[^`]+`/u,
  `Contract version: \`${contractVersion}\``
);
await replaceText(
  "llms.txt",
  /Source version: [^\r\n]+/u,
  `Source version: ${version}`
);
await replaceText(
  "llms.txt",
  /Contract version: [^\r\n]+/u,
  `Contract version: ${contractVersion}`
);
console.log(
  `Synchronized package ${version} and icon contract ${contractVersion}.`
);

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
 * Updates a JSON document while preserving the repository's formatting policy.
 *
 * @param {string} relativePath Repository-relative file path.
 * @param {(value: Record<string, any>) => void} mutate Mutating callback.
 * @returns {Promise<void>}
 */
async function updateJson(relativePath, mutate) {
  const value = await readJson(relativePath);

  mutate(value);
  await writeFile(
    join(root, relativePath),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8"
  );
}

/**
 * Replaces one required version marker in a text document.
 *
 * @param {string} relativePath Repository-relative file path.
 * @param {RegExp} pattern Required marker pattern.
 * @param {string} replacement Replacement text.
 * @returns {Promise<void>}
 */
async function replaceText(relativePath, pattern, replacement) {
  const file = join(root, relativePath);
  const source = await readFile(file, "utf8");

  if (!pattern.test(source)) {
    throw new Error(`${relativePath} is missing its version marker.`);
  }

  await writeFile(file, source.replace(pattern, replacement), "utf8");
}
