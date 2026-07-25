import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { access, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";
import { installDemoDependencyRoutes } from "../scripts/route-demo-dependencies.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const siteRoot = join(root, "output", "github-pages");
const browserName =
  process.argv.find((argument) => argument.startsWith("--browser="))?.split("=")[1] ??
  "chromium";
const quick = process.argv.includes("--quick");
const browsers = { chromium, firefox, webkit };
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};
const lightThemes = [
  "midnight-gold",
  "ocean-steel",
  "forest-moss",
  "sunset-ember",
  "royal-plum",
  "graphite-cyan",
  "desert-sage",
  "rose-quartz",
  "cyber-lime",
  "arctic-indigo"
];

await access(join(siteRoot, "index.html"));
const screenshotDir = join(tmpdir(), "ui-style-kit-icons-demo-smoke");

await mkdir(screenshotDir, { recursive: true });

const server = createServer(async (request, response) => {
  const requestedPath = new URL(request.url, "http://127.0.0.1").pathname;
  const filePath = normalize(
    join(siteRoot, requestedPath === "/" ? "index.html" : requestedPath)
  );

  if (relative(siteRoot, filePath).startsWith("..")) {
    response.writeHead(403).end();
    return;
  }

  try {
    await access(filePath);
    response.writeHead(200, {
      "content-type": contentTypes[extname(filePath)] ?? "application/octet-stream"
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const browser = await browsers[browserName].launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await installDemoDependencyRoutes(page);
  await page.goto(`http://127.0.0.1:${address.port}/`, {
    waitUntil: "networkidle"
  });
  await page.waitForFunction(() => {
    const icon = document.querySelector(".icon-card usk-icon");
    return icon?.shadowRoot?.querySelector("svg");
  });

  assert.equal(await page.locator(".icon-card").count(), 64);
  assert.equal(await page.locator("body").getAttribute("data-icon-pack"), "minimal-saas");
  await page.screenshot({
    path: join(screenshotDir, `${browserName}-desktop-gallery.png`),
    fullPage: false
  });

  await page.selectOption("#packSelect", "cyberpunk");
  await page.waitForFunction(
    () => document.querySelector(".icon-card usk-icon")?.dataset.pack === "cyberpunk"
  );
  assert.equal(await page.locator("body").getAttribute("data-ui"), "cyberpunk");
  await page.locator("[data-frame-value=\"none\"]").click();
  await page.waitForFunction(
    () => document.querySelector(".icon-card usk-icon")?.getAttribute("frame") === "none"
  );
  assert.equal(await page.locator("body").getAttribute("data-icon-frame"), "none");
  assert.match(page.url(), /frame=none/);

  await page.fill("#iconSearch", "dashboard");
  assert.equal(await page.locator(".icon-card").count(), 1);
  await page.locator(".icon-card").click();
  assert.equal(await page.locator("#iconDialog").getAttribute("open"), "");
  assert.match(await page.locator("#componentSnippet").textContent(), /dashboard/);
  assert.match(await page.locator("#componentSnippet").textContent(), /frame="none"/);
  assert.match(await page.locator("#spriteSnippet").textContent(), /--usk-icon-frame-opacity:0/);
  assert.equal(await page.locator("#dialogIcon").getAttribute("frame"), "none");

  await page.screenshot({
    path: join(screenshotDir, `${browserName}-desktop.png`),
    fullPage: true
  });

  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.querySelector("#iconDialog")?.open === false);
  await page.selectOption("#packSelect", "y2k");
  await page.waitForFunction(() => {
    const icon = document.querySelector(".icon-card usk-icon");

    return (
      icon?.dataset.pack === "y2k" &&
      !icon.hasAttribute("data-loading") &&
      Boolean(icon.shadowRoot?.querySelector("svg.y2k-icon"))
    );
  });
  const y2kEmbedding = await page.locator(".icon-card usk-icon").first().evaluate((icon) => {
    const svg = icon.shadowRoot?.querySelector("svg");
    const visibleFrameParts = svg
      ? [...svg.querySelectorAll("[data-icon-frame]")].filter(
          (element) => Number.parseFloat(getComputedStyle(element).opacity) > 0
        ).length
      : -1;

    return {
      overflow: svg ? getComputedStyle(svg).overflow : "",
      pointerEvents: svg ? getComputedStyle(svg).pointerEvents : "",
      visibleFrameParts
    };
  });
  assert.deepEqual(y2kEmbedding, {
    overflow: "hidden",
    pointerEvents: "none",
    visibleFrameParts: 0
  });
  await assertLightThemeContrast(page, `http://127.0.0.1:${address.port}/`);

  if (!quick) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.keyboard.press("Escape");
    await page.fill("#iconSearch", "");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    assert.ok(overflow <= 1, `mobile horizontal overflow: ${overflow}px`);
    await page.screenshot({
      path: join(screenshotDir, `${browserName}-mobile.png`),
      fullPage: true
    });

    await page.locator(".icon-card").first().click();
    await page.waitForFunction(
      () => document.querySelector("#iconDialog")?.open === true
    );
    const dialogMetrics = await page.locator("#iconDialog").evaluate((dialog) => {
      const rect = dialog.getBoundingClientRect();

      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: document.documentElement.clientHeight
      };
    });

    assert.ok(dialogMetrics.left >= 8, `mobile dialog left edge: ${dialogMetrics.left}px`);
    assert.ok(
      dialogMetrics.right <= dialogMetrics.viewportWidth - 8,
      `mobile dialog right edge: ${dialogMetrics.right}px`
    );
    assert.ok(dialogMetrics.top >= 8, `mobile dialog top edge: ${dialogMetrics.top}px`);
    assert.ok(
      dialogMetrics.bottom <= dialogMetrics.viewportHeight - 8,
      `mobile dialog bottom edge: ${dialogMetrics.bottom}px`
    );
    await page.screenshot({
      path: join(screenshotDir, `${browserName}-mobile-dialog.png`),
      fullPage: false
    });
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => document.querySelector("#iconDialog")?.open === false
    );
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

console.log(`Demo smoke test passed in ${browserName}; screenshots: ${screenshotDir}`);

async function assertLightThemeContrast(page, url) {
  const failures = [];

  // Light theme coverage guards the GitHub Pages artifact, not just the local demo.
  for (const theme of lightThemes) {
    await page.goto(`${url}?mode=light&theme=${theme}&pack=minimal-saas`, {
      waitUntil: "networkidle"
    });
    await page.waitForFunction(
      (expectedTheme) =>
        document.body.dataset.mode === "light" && document.body.dataset.theme === expectedTheme,
      theme
    );

    const metrics = await getLightThemeMetrics(page);

    if (metrics.bodyLuminance < 0.72 || metrics.cardLuminance < 0.72) {
      failures.push(
        `${theme}: light surfaces too dark ${JSON.stringify({
          bodyLuminance: metrics.bodyLuminance,
          cardLuminance: metrics.cardLuminance
        })}`
      );
    }

    for (const check of metrics.checks) {
      if (check.contrast < 4.5) {
        failures.push(`${theme}: ${check.name} contrast ${check.contrast}`);
      }
    }
  }

  assert.deepEqual(failures, []);
}

async function getLightThemeMetrics(page) {
  return page.evaluate(() => {
    function parseColor(value) {
      const match = value.match(/rgba?\(([^)]+)\)/i);

      if (!match) {
        throw new Error(`Unsupported computed color: ${value}`);
      }

      const [r, g, b, alpha] = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);

      return {
        r,
        g,
        b,
        a: Number.isFinite(alpha) ? alpha : 1
      };
    }

    function blend(top, bottom) {
      return {
        r: Math.round(top.r * top.a + bottom.r * (1 - top.a)),
        g: Math.round(top.g * top.a + bottom.g * (1 - top.a)),
        b: Math.round(top.b * top.a + bottom.b * (1 - top.a)),
        a: 1
      };
    }

    function channel(value) {
      const normalized = value / 255;

      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    }

    function luminance(color) {
      return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
    }

    function contrast(foreground, background) {
      const high = Math.max(luminance(foreground), luminance(background));
      const low = Math.min(luminance(foreground), luminance(background));

      return (high + 0.05) / (low + 0.05);
    }

    const bodyBackground = parseColor(getComputedStyle(document.body).backgroundColor);
    const checks = [
      ["body", "body"],
      ["top nav", ".top-nav a"],
      ["control heading", ".control-heading h2"],
      ["control label", ".control-field > span"],
      ["select control", "#themeSelect"],
      ["search input", "#iconSearch"],
      ["card label", ".icon-card strong"],
      ["card code", ".icon-card code"],
      ["toolbar", ".gallery-toolbar h2"],
      ["stat label", ".pack-summary dt"],
      ["stat value", ".pack-summary dd"],
      ["install command", ".install-block code"],
      ["inactive mode", ".segmented-control button:nth-child(2)"],
      ["active mode", ".segmented-control button[aria-pressed='true']"]
    ].map(([name, selector]) => {
      const element = document.querySelector(selector);

      if (!element) {
        throw new Error(`Missing light mode contrast target: ${selector}`);
      }

      const styles = getComputedStyle(element);
      const backgroundElement =
        selector === "body"
          ? element
          : element.closest(
              "button, input, select, .icon-card, .gallery-toolbar, .pack-summary dl > div, .install-block, .control-rail, body"
            );
      const rawBackground = parseColor(getComputedStyle(backgroundElement).backgroundColor);
      const background =
        rawBackground.a < 1 ? blend(rawBackground, bodyBackground) : rawBackground;
      const foreground = parseColor(styles.color);

      return {
        name,
        selector,
        contrast: Number(contrast(foreground, background).toFixed(2))
      };
    });
    const cardElement = document.querySelector(".icon-card");
    const cardBackground = parseColor(getComputedStyle(cardElement).backgroundColor);
    const blendedCardBackground =
      cardBackground.a < 1 ? blend(cardBackground, bodyBackground) : cardBackground;

    return {
      bodyLuminance: Number(luminance(bodyBackground).toFixed(3)),
      cardLuminance: Number(luminance(blendedCardBackground).toFixed(3)),
      checks
    };
  });
}
