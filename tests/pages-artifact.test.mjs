import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const pages = join(root, "output", "github-pages");
const pagesUrl = "https://foscat.github.io/ui-style-kit-css-icons/";

test("Pages artifact has a deployable root", async () => {
  for (const path of [
    ".nojekyll",
    "index.html",
    "404.html",
    "demo.css",
    "demo.js",
    "robots.txt",
    "sitemap.xml",
    "site.webmanifest",
    "llms.txt",
    "assets/favicon.svg",
    "assets/social-card.png",
    "contract/icon-contract.json",
    "dist/ui-style-kit-icons.js",
    "dist/registry.json",
    "icons/home.svg",
    "packs/neumorphism/icons/home.svg"
  ]) {
    await access(join(pages, path));
  }

  await assert.rejects(access(join(pages, "assets", "demo")));
  await assert.rejects(access(join(pages, "assets", "scripts")));
});

test("Pages index contains SEO and pre-rendered icon content", async () => {
  const html = await readFile(join(pages, "index.html"), "utf8");

  assert.match(html, /<link rel="canonical"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="twitter:card"/);
  assert.match(html, /name="robots"/);
  assert.match(html, /UI Style Kit CSS/);
  assert.match(html, /Layout Style CSS/);
  assert.match(html, /Interactive Surface CSS/);
  assert.match(html, new RegExp(escapeRegExp(pagesUrl), "u"));
  assert.doesNotMatch(html, /foscat\.github\.io\/ui-style-kit-icons/u);
  assert.equal((html.match(/class="icon-card"/g) ?? []).length, 64);
  assert.doesNotMatch(html, /\.\.\/dist\//);
  assert.doesNotMatch(html, /0\.3\.0/);
});

test("Pages metadata uses the repository deployment base", async () => {
  const robots = await readFile(join(pages, "robots.txt"), "utf8");
  const sitemap = await readFile(join(pages, "sitemap.xml"), "utf8");
  const manifest = JSON.parse(
    await readFile(join(pages, "site.webmanifest"), "utf8")
  );

  assert.match(robots, new RegExp(escapeRegExp(`${pagesUrl}sitemap.xml`), "u"));
  assert.match(sitemap, new RegExp(escapeRegExp(pagesUrl), "u"));
  assert.equal(manifest.id, "/ui-style-kit-css-icons/");
  assert.equal(manifest.start_url, "/ui-style-kit-css-icons/");
  assert.equal(manifest.scope, "/ui-style-kit-css-icons/");
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
