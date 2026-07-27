import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
import { collectRenderedIconMetrics } from "../scripts/svg-browser-metrics.mjs";

test("frame overlap samples the painted width of thick strokes", async (context) => {
  const browser = await chromium.launch({ headless: true });

  context.after(async () => {
    await browser.close();
  });

  const page = await browser.newPage({
    viewport: { width: 320, height: 320 }
  });

  await page.setContent(`
    <div class="icon-card" style="background: white; inline-size: 256px; block-size: 256px;">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="256"
        height="256"
        viewBox="0 0 256 256"
      >
        <line
          data-icon-frame="decor"
          x1="80"
          y1="30"
          x2="80"
          y2="226"
          stroke="black"
          stroke-width="20"
        />
        <rect
          data-icon-glyph="semantic"
          x="86"
          y="80"
          width="50"
          height="96"
          fill="black"
        />
      </svg>
    </div>
  `);

  const [metrics] = await page.evaluate(collectRenderedIconMetrics);

  assert.ok(
    metrics.frameGlyphOverlap > 0,
    `expected painted stroke overlap, received ${metrics.frameGlyphOverlap}`
  );
});

test("semantic prototype geometry is measured independently from frames", async (context) => {
  const browser = await chromium.launch({ headless: true });

  context.after(async () => {
    await browser.close();
  });

  const page = await browser.newPage({
    viewport: { width: 320, height: 320 }
  });

  await page.setContent(`
    <div class="icon-card" style="background: white; inline-size: 256px; block-size: 256px;">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="256"
        height="256"
        viewBox="0 0 256 256"
      >
        <rect
          data-icon-frame="surface"
          x="20"
          y="20"
          width="216"
          height="216"
          fill="none"
          stroke="black"
        />
        <g
          data-icon-glyph="semantic"
          data-icon-prototype="reference-led-v1"
        >
          <rect x="88" y="102" width="80" height="52" rx="18" fill="black" />
        </g>
      </svg>
    </div>
  `);

  const [metrics] = await page.evaluate(collectRenderedIconMetrics);
  const semantic = metrics.elements.find(
    (element) => element.semantic === "semantic"
  );

  assert.ok(semantic?.rendered, "semantic geometry is visibly rendered");
  assert.equal(semantic.prototype, "reference-led-v1");
  assert.equal(metrics.semanticElementCount, 1);
  assert.equal(metrics.semanticExtent, 80);
  assert.equal(metrics.semanticPixelExtent, 80);
});
