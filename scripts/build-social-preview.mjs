#!/usr/bin/env node
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const packageJson = JSON.parse(
  await readFile(join(root, "package.json"), "utf8")
);
const manifest = JSON.parse(
  await readFile(join(root, "manifest.json"), "utf8")
);
const output = join(root, "assets", "ui-style-kit-icons-social-preview.png");
const docsOutput = join(
  root,
  "docs",
  "assets",
  "brand",
  "ui-style-kit-icons-social-preview.png"
);
const favicon = prepareIcon(
  await readFile(join(root, "assets", "favicon.svg"), "utf8"),
  "brand-mark"
);
const examples = await Promise.all(
  [
    ["minimal-saas", "home"],
    ["industrial-utility", "warehouse"],
    ["technical-blueprint", "chart-bar"],
    ["art-deco", "credit-card"],
    ["neo-noir", "shield-check"],
    ["retrofuturism", "ste-workforce"]
  ].map(async ([family, name]) => ({
    family,
    label: manifest.styles[family].label,
    name,
    svg: prepareIcon(
      await readFile(join(root, "svg", family, `${name}.svg`), "utf8"),
      "sample-icon"
    )
  }))
);
const cards = examples
  .map(
    ({ label, name, svg }) => `<article><span>${svg}</span><div><strong>${label}</strong><small>${name}</small></div></article>`
  )
  .join("");
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
    body {
      --usi-primary-ink: #55d4a6;
      --usi-secondary-ink: #82b7ff;
      --usi-accent-ink: #ffca67;
      --usi-success-ink: #55d4a6;
      --usi-warning-ink: #ffca67;
      --usi-danger-ink: #ff7f88;
      color: #f3f7f5;
      background: #071612;
      font-family: Inter, "Segoe UI", sans-serif;
      padding: 52px 64px;
    }
    body::before {
      background: radial-gradient(circle at 84% 18%, #194d3d 0, transparent 34%), linear-gradient(120deg, #071612, #0b201a);
      content: "";
      inset: 0;
      position: absolute;
      z-index: -1;
    }
    header { align-items: center; display: flex; gap: 24px; }
    .brand-mark { height: 76px; width: 76px; }
    .eyebrow { color: #8ee4c2; font: 700 16px/1.2 ui-monospace, monospace; letter-spacing: .12em; text-transform: uppercase; }
    h1 { font-size: 54px; letter-spacing: -.04em; line-height: 1; margin: 7px 0 0; }
    .version { border: 1px solid #397a63; border-radius: 999px; color: #a8e7cf; font: 700 17px ui-monospace, monospace; margin-left: auto; padding: 11px 17px; }
    .lede { color: #bbcbc5; font-size: 24px; line-height: 1.4; margin: 30px 0 27px; max-width: 850px; }
    .lede strong { color: #f3f7f5; }
    .grid { display: grid; gap: 14px; grid-template-columns: repeat(3, 1fr); }
    article { align-items: center; background: #102922; border: 1px solid #2a5a4a; border-radius: 17px; display: flex; gap: 19px; min-height: 112px; padding: 18px 22px; }
    article > span { align-items: center; background: #17382e; border-radius: 13px; color: #d8fff0; display: flex; height: 72px; justify-content: center; width: 72px; }
    .sample-icon { height: 48px; width: 48px; }
    article strong { display: block; font-size: 19px; text-transform: capitalize; }
    article small { color: #8fb0a3; display: block; font: 15px ui-monospace, monospace; margin-top: 7px; }
    footer { color: #86a99b; display: flex; font: 16px ui-monospace, monospace; justify-content: space-between; margin-top: 25px; }
    footer strong { color: #8ee4c2; }
  </style>
</head>
<body>
  <header>
    ${favicon}
    <div><div class="eyebrow">Collection 01</div><h1>UI Style Kit Icons</h1></div>
    <span class="version">v${packageJson.version}</span>
  </header>
  <p class="lede"><strong>174 semantic glyphs</strong> across 20 coordinated families, supplied as theme-aware and monochrome SVG.</p>
  <section class="grid">${cards}</section>
  <footer><span>Sanderson Technology Enterprises</span><strong>6,960 verified SVG assets</strong></footer>
</body>
</html>`;
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1
  });

  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: output });
  await mkdir(join(root, "docs", "assets", "brand"), { recursive: true });
  await copyFile(output, docsOutput);
  await page.close();
  console.log("Built the current Collection 01 social preview.");
} finally {
  await browser.close();
}

/**
 * Normalizes an SVG for deterministic inline social-card rendering.
 *
 * @param {string} source SVG source.
 * @param {string} className CSS class applied to the root SVG.
 * @returns {string} Inline SVG markup.
 */
function prepareIcon(source, className) {
  return source
    .replace(/<\?xml[^>]*>\s*/u, "")
    .replace(/\swidth="[^"]*"/u, "")
    .replace(/\sheight="[^"]*"/u, "")
    .replace(/\sclass="[^"]*"/u, "")
    .replace("<svg", `<svg class="${className}"`);
}
