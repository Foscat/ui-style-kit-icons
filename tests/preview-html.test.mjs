import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const packsDirectory = join(root, "packs");
const packDirectories = (await readdir(packsDirectory, {
  withFileTypes: true
}))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

test("standalone pack previews use one document-level stylesheet", async () => {
  for (const pack of packDirectories) {
    const path = join(packsDirectory, pack, "index.html");
    const html = await readFile(path, "utf8");
    const styles = html.match(/<style(?:\s[^>]*)?>/giu) ?? [];
    const firstSvg = html.search(/<svg\b/iu);
    const lastStyle = html.lastIndexOf("<style");

    assert.match(html, /^\s*<!doctype html>/iu, pack);
    assert.match(html, /<html\b[^>]*\blang="en"/iu, pack);
    assert.match(html, /<head>[\s\S]*<title>[^<]+<\/title>[\s\S]*<\/head>/iu, pack);
    assert.equal(styles.length, 1, `${pack} stylesheet count`);
    assert.ok(lastStyle < firstSvg, `${pack} stylesheet must precede its SVGs`);
    assert.doesNotMatch(
      html,
      /^,\s*\[data-|^--(?:xs|sm|md|lg|xl)\s*\{/mu,
      `${pack} contains a truncated selector`
    );
    assert.doesNotMatch(
      html,
      /<\/?(?:clipPath|feColorMatrix|feGaussianBlur|feMerge|feMergeNode|linearGradient)\b/u,
      `${pack} contains camel-cased SVG tags in HTML`
    );

    for (const [, attributes] of html.matchAll(/<stop\b([^>]*)>/giu)) {
      assert.match(attributes, /\boffset="/iu, `${pack} gradient stop offset`);
    }
  }
});
