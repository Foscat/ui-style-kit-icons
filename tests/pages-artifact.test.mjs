import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const pages = join(root, "output", "github-pages");
const pagesUrl = "https://foscat.github.io/ui-style-kit-icons/";

test("Pages artifact publishes the self-contained Collection 01 studio", async () => {
  for (const relativePath of [
    ".nojekyll",
    "index.html",
    "404.html",
    "robots.txt",
    "sitemap.xml",
    "site.webmanifest",
    "assets/catalog.js",
    "assets/demo.js",
    "assets/icon-paint.css",
    "assets/inline-svg.js",
    "assets/brand/favicon.svg",
    "assets/brand/ui-style-kit-icons-social-preview.png",
    "assets/vendor/ui-style-kit-css/visual.css",
    "assets/vendor/motion-style-css/motion.js"
  ]) {
    await access(join(pages, relativePath));
  }

  await assert.rejects(access(join(pages, "packs")));
  await assert.rejects(access(join(pages, "icons")));
  await assert.rejects(access(join(pages, "style-source")));
});

test("Pages metadata and catalog match the renamed repository and new collection", async () => {
  const html = await readFile(join(pages, "index.html"), "utf8");
  const catalog = await readFile(join(pages, "assets", "catalog.js"), "utf8");
  const robots = await readFile(join(pages, "robots.txt"), "utf8");
  const sitemap = await readFile(join(pages, "sitemap.xml"), "utf8");
  const webManifest = JSON.parse(
    await readFile(join(pages, "site.webmanifest"), "utf8")
  );

  assert.match(html, new RegExp(escapeRegExp(pagesUrl), "u"));
  assert.match(html, /174 UI symbols across 20 icon families/u);
  assert.match(html, /property="og:image"/u);
  assert.doesNotMatch(html, /ui-style-kit-css-icons/u);
  assert.match(catalog, /"organic-modern"/u);
  assert.match(catalog, /"editorial-luxe"/u);
  assert.match(catalog, /"retrofuturism"/u);
  assert.match(catalog, /"ste-workforce"/u);
  assert.match(catalog, /"icons":\{"home"/u);
  assert.match(robots, new RegExp(escapeRegExp(`${pagesUrl}sitemap.xml`), "u"));
  assert.match(sitemap, new RegExp(escapeRegExp(pagesUrl), "u"));
  assert.equal(webManifest.id, "/ui-style-kit-icons/");
  assert.equal(webManifest.start_url, "/ui-style-kit-icons/");
  assert.equal(webManifest.scope, "/ui-style-kit-icons/");
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
