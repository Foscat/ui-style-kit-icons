import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const packageJson = JSON.parse(
  await readFile(join(root, "package.json"), "utf8")
);
const indexHtml = await readFile(join(root, "index.html"), "utf8");
const demoCss = await readFile(join(root, "demo.css"), "utf8");
const demoJs = await readFile(join(root, "demo.js"), "utf8");
const dependencyRoutes = await readFile(
  join(root, "scripts", "route-demo-dependencies.mjs"),
  "utf8"
);

const stylesheetHrefs = [...indexHtml.matchAll(
  /<link rel="stylesheet" href="([^"]+)"/gu
)].map(([, href]) => href);

test("demo composes the aligned ecosystem styles in ownership order", () => {
  assert.equal(
    packageJson.devDependencies?.["interactive-surface-css"],
    "1.5.0"
  );
  assert.deepEqual(stylesheetHrefs, [
    "https://unpkg.com/ui-style-kit-css@2.1.0/dist/ui-style-kit.visual.min.css",
    "https://unpkg.com/ui-style-kit-css@2.1.0/styles/interactive-surface-theme.css",
    "https://unpkg.com/interactive-surface-css@1.5.0/state-core.css",
    "https://unpkg.com/layout-style-css@2.1.0/dist/layout-style-css.min.css",
    "./dist/ui-style-kit-icons.css",
    "./demo.css"
  ]);

  const layerOrder = indexHtml.indexOf("@layer demo, ui-style-kit, ly;");
  const firstStylesheet = indexHtml.indexOf('<link rel="stylesheet"');

  assert.ok(layerOrder >= 0, "The demo must predeclare its ecosystem layers.");
  assert.ok(
    layerOrder < firstStylesheet,
    "Layer order must be declared before companion stylesheets load."
  );
});

test("browser fixtures route every external companion stylesheet", () => {
  for (const expected of [
    "ui-style-kit-css/visual.min.css",
    "ui-style-kit-css/interactive-surface-theme.css",
    "interactive-surface-css/state-core.css",
    "layout-style-css/min.css"
  ]) {
    assert.match(
      dependencyRoutes,
      new RegExp(escapeRegExp(expected), "u"),
      `Missing local browser fixture route for ${expected}.`
    );
  }
});

test("demo markup uses stable Layout hooks and an isolated personality showcase", () => {
  assert.match(indexHtml, /class="app-layout ly-sidebar"/u);
  assert.match(
    indexHtml,
    /class="control-rail ly-stack"[^>]*data-ly-sidebar="side"/u
  );
  assert.match(
    indexHtml,
    /class="main-content"[^>]*data-ly-sidebar="content"/u
  );
  assert.match(indexHtml, /class="usage-section ly-switcher\b/u);
  assert.match(
    indexHtml,
    /class="ecosystem-grid ly-grid ly-grid--auto"/u
  );
  assert.match(indexHtml, /class="library-heading ly-switcher/u);
  assert.match(indexHtml, /class="gallery-toolbar ly-switcher/u);
  assert.match(indexHtml, /class="site-footer ly-switcher/u);
  assert.doesNotMatch(
    indexHtml,
    /class="icon-grid[^"]*\bly-grid\b/u,
    "The comparison gallery must keep uniform local geometry."
  );
});

test("interactive controls use Interactive Surface state contracts", () => {
  assert.match(
    indexHtml,
    /class="skip-link-shell">\s*<a class="interactive-surface size-sm"/u
  );
  for (const selectorHook of [
    'id="resetButton" class="text-button interactive-surface',
    'data-mode-value="light"',
    'data-frame-value="auto"',
    'class="icon-card interactive-surface"',
    'id="clearSearchButton" class="interactive-surface',
    'class="dialog-close interactive-surface',
    'id="downloadIconLink" class="interactive-surface',
    'id="copyLinkButton" class="interactive-surface'
  ]) {
    assert.match(
      indexHtml,
      new RegExp(escapeRegExp(selectorHook), "u"),
      `Missing Interactive Surface hook near ${selectorHook}.`
    );
  }

  const authoredButtons = [
    ...indexHtml.matchAll(/<button\b[^>]*>/gu)
  ].map(([button]) => button);

  assert.ok(authoredButtons.length > 0);
  for (const button of authoredButtons) {
    assert.match(button, /\bclass="[^"]*\binteractive-surface\b/u);
  }

  for (const nativeControlId of [
    "packSelect",
    "themeSelect",
    "sizeRange",
    "extrasToggle",
    "iconSearch"
  ]) {
    const tag = indexHtml.match(
      new RegExp(
        `<(?:input|select)\\b[^>]*id="${nativeControlId}"[^>]*>`,
        "u"
      )
    )?.[0];

    assert.ok(tag, `Missing native demo control #${nativeControlId}.`);
    assert.doesNotMatch(tag, /\binteractive-surface\b/u);
  }

  assert.match(
    demoJs,
    /card\.className = "icon-card interactive-surface";/u
  );
  assert.match(demoJs, /button\.dataset\.surfaceLevel/u);
  assert.match(demoJs, /button\.dataset\.surfaceVariant/u);
  assert.match(demoJs, /card\.dataset\.surfaceLevel = "1";/u);
});

test("local demo CSS is layered and does not reclaim companion ownership", () => {
  assert.match(demoCss, /^\s*@layer demo\s*\{/u);
  assert.doesNotMatch(
    demoCss,
    /--usk-(?!icon-size\s*:)[\w-]+\s*:|--interactive-surface-[\w-]+\s*:/u,
    "Local CSS may size icons but must not redefine companion-owned tokens."
  );
  assert.doesNotMatch(demoCss, /body\[data-mode=/u);
  assert.doesNotMatch(demoCss, /\.icon-card:hover/u);
  assert.doesNotMatch(
    demoCss,
    /(?:button|input|select|a):focus-visible/u
  );
  assert.doesNotMatch(
    demoCss,
    /\.segmented-control button\[aria-pressed="true"\]/u
  );
  assert.doesNotMatch(demoCss, /\bflex-direction\s*:/u);
  assert.doesNotMatch(demoCss, /!important/u);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
