import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const packageJson = JSON.parse(
  await readFile(join(root, "package.json"), "utf8")
);
const contract = JSON.parse(
  await readFile(join(root, "contract", "icon-contract.json"), "utf8")
);
const markdownDocuments = [
  "CHANGELOG.md",
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "contract/icon-contract.md",
  "reference/organic-modern-approval.md"
].map((file) => join(root, file));

test("published docs describe Collection 01 and the supported package surface", async () => {
  const readme = await readFile(join(root, "README.md"), "utf8");
  const llms = await readFile(join(root, "llms.txt"), "utf8");
  const html = await readFile(join(root, "docs", "index.html"), "utf8");

  for (const text of [readme, llms]) {
    assert.match(text, new RegExp(escapeRegExp(packageJson.version), "u"));
    assert.match(text, /20 (?:families|theme-aware families)/u);
    assert.match(text, /174 semantic icons|174 canonical icons/u);
    assert.match(
      text,
      new RegExp(
        `Contract version: \`?${escapeRegExp(contract.schemaVersion)}\`?`,
        "u"
      )
    );
  }

  for (const subpath of [
    "ui-style-kit-icons/element",
    "ui-style-kit-icons/registry",
    "ui-style-kit-icons/contract.json",
    "ui-style-kit-icons/css.css",
    "ui-style-kit-icons/inline-svg",
    "ui-style-kit-icons/svg/<family>/<icon-id>.svg",
    "ui-style-kit-icons/monochrome/<family>/<icon-id>.svg"
  ]) {
    assert.match(readme, new RegExp(escapeRegExp(subpath), "u"));
  }

  assert.match(readme, /ui-style-kit-css >=2\.7\.1 <3/u);
  for (const publicApi of [
    "getPack",
    "setDefaultPack",
    "setAssetBaseUrl",
    "resolveIconUrl",
    "iconNames"
  ]) {
    assert.match(readme, new RegExp(`\\b${publicApi}\\b`, "u"));
  }
  assert.match(readme, /label="[^"]+"/u);
  assert.match(readme, /asset-base/u);
  assert.match(readme, /npm run demo/u);
  assert.match(readme, /npm run pages:build/u);
  assert.doesNotMatch(readme, /ui-style-kit-icons\/packs\//u);
  assert.doesNotMatch(readme, /ui-style-kit-icons\/icons\//u);
  assert.match(html, /https:\/\/github\.com\/Foscat\/ui-style-kit-icons/u);
  assert.doesNotMatch(html, /ui-style-kit-css-icons/u);
});

test("local Markdown links resolve within the repository", async () => {
  for (const documentPath of markdownDocuments) {
    const markdown = await readFile(documentPath, "utf8");
    const links = [...markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/gu)].map(
      ([, target]) => target
    );

    for (const target of links) {
      if (/^(?:https?:|mailto:|#)/u.test(target)) {
        continue;
      }

      const localTarget = target.split("#")[0];

      if (!localTarget) {
        continue;
      }

      const resolved = resolve(dirname(documentPath), localTarget);

      assert.ok(
        resolved.startsWith(root),
        `${documentPath} links outside the repository: ${target}`
      );
      await access(resolved);
    }
  }
});

/**
 * Escapes a literal value for use in a regular expression.
 *
 * @param {string} value Literal value.
 * @returns {string} Escaped pattern text.
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
