import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const markdownDocuments = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "contract/icon-contract.md",
  "style-source/system-style-source.md"
].map((file) => join(root, file));

test("published docs describe the supported library and demo surfaces", async () => {
  const readme = await readFile(join(root, "README.md"), "utf8");
  const llms = await readFile(join(root, "llms.txt"), "utf8");
  const html = await readFile(join(root, "index.html"), "utf8");

  for (const text of [readme, llms, html]) {
    assert.match(text, /0\.2\.0/u);
    assert.match(text, /12/u);
    assert.doesNotMatch(text, /0\.3\.0/u);
  }

  for (const subpath of [
    "ui-style-kit-icons/element",
    "ui-style-kit-icons/registry",
    "ui-style-kit-icons/registry.json",
    "ui-style-kit-icons/contract.json",
    "ui-style-kit-icons/css.css",
    "ui-style-kit-icons/sprite.svg",
    "ui-style-kit-icons/packs/<pack-id>/icons/<icon-id>.svg"
  ]) {
    assert.match(readme, new RegExp(escapeRegExp(subpath), "u"));
  }

  assert.match(readme, /npm run demo/u);
  assert.match(readme, /npm run pages:build/u);
  assert.match(llms, /npm run demo/u);
  assert.match(html, /fileProtocolNotice/u);
});

test("local Markdown links resolve without requiring a separate wiki checkout", async () => {
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
