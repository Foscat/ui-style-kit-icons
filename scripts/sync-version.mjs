#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PACK_DEFINITIONS } from "../src/packs.mjs";

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

for (const { sourcePath } of PACK_DEFINITIONS.filter(
  ({ sourcePath }) => sourcePath !== "."
)) {
  await updateJson(join(sourcePath, "package.json"), (manifest) => {
    manifest.version = version;
  });
  await updateJson(join(sourcePath, "manifest.json"), (manifest) => {
    manifest.version = version;
    manifest.contractVersion = contractVersion;
  });
  await replaceText(
    join(sourcePath, "README.md"),
    /- Contract version: `[^`]+`/u,
    `- Contract version: \`${contractVersion}\``
  );
}

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
  /- Package version: [^\r\n]+/u,
  `- Package version: ${version}`
);
await replaceText(
  "llms.txt",
  /- Contract version: [^\r\n]+/u,
  `- Contract version: ${contractVersion}`
);
await replaceText(
  "index.html",
  /"version": "[^"]+"/u,
  `"version": "${version}"`
);
await replaceText(
  "index.html",
  /UI Style Kit Icons \d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)? &middot; MIT/u,
  `UI Style Kit Icons ${version} &middot; MIT`
);
await replaceText(
  "index.html",
  /<div><dt>Contract<\/dt><dd>[^<]+<\/dd><\/div>/u,
  `<div><dt>Contract</dt><dd>${contractVersion.replace(/\.0$/u, "")}</dd></div>`
);

console.log(
  `Synchronized package ${version} and icon contract ${contractVersion}.`
);

async function readJson(relativePath) {
  return JSON.parse(await readFile(join(root, relativePath), "utf8"));
}

async function updateJson(relativePath, mutate) {
  const value = await readJson(relativePath);

  mutate(value);
  await writeFile(
    join(root, relativePath),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8"
  );
}

async function replaceText(relativePath, pattern, replacement) {
  const file = join(root, relativePath);
  const source = await readFile(file, "utf8");

  if (!pattern.test(source)) {
    throw new Error(`${relativePath} is missing its version marker.`);
  }

  await writeFile(file, source.replace(pattern, replacement), "utf8");
}
