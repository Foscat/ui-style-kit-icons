#!/usr/bin/env node
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = process.cwd();
const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOST ?? "127.0.0.1";
const baseUrl = `http://${host}:${port}/`;
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
const server = spawn(process.execPath, ["scripts/serve-demo.mjs", String(port)], {
  cwd: root,
  env: { ...process.env, HOST: host, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"]
});

let serverReady = false;
server.stdout.on("data", (chunk) => {
  if (String(chunk).includes(baseUrl)) {
    serverReady = true;
  }
});

server.stderr.pipe(process.stderr);

for (let tries = 0; tries < 50 && !serverReady; tries += 1) {
  await new Promise((resolve) => setTimeout(resolve, 100));
}

if (!serverReady) {
  server.kill();
  throw new Error("The demo server did not start.");
}

const browser = await chromium.launch({ headless: true });

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const desktopEvents = [];
  desktop.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      desktopEvents.push(`${message.type()}: ${message.text()}`);
    }
  });
  desktop.on("pageerror", (error) => desktopEvents.push(`pageerror: ${error.message}`));

  await desktop.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await desktop.waitForFunction(() =>
    Boolean(document.querySelector('#packSelect option[value="synthwave"]'))
  );
  await desktop.selectOption("#packSelect", "synthwave");
  await desktop.locator("#extrasToggle").check();
  await desktop.selectOption("#themeSelect", "cyber-lime");
  await desktop.locator("[data-mode-value=\"light\"]").click();
  await desktop.locator("[data-frame-value=\"none\"]").click();
  await desktop.locator("#sizeRange").fill("96");
  await desktop.locator("#iconSearch").fill("cassette");
  await desktop.waitForFunction(() => document.querySelectorAll(".icon-card").length === 1);

  const desktopState = await desktop.evaluate(() => ({
    title: document.title,
    pack: document.body.dataset.iconPack,
    theme: document.body.dataset.theme,
    mode: document.body.dataset.mode,
    frame: document.body.dataset.iconFrame,
    size: document.querySelector("#sizeOutput")?.textContent,
    resultCount: document.querySelector("#resultCount")?.textContent,
    labels: [...document.querySelectorAll(".icon-card strong")].map((node) => node.textContent),
    iconFrame: document.querySelector(".icon-card usk-icon")?.getAttribute("frame"),
    url: location.href
  }));

  if (
    desktopState.pack !== "synthwave" ||
    desktopState.theme !== "cyber-lime" ||
    desktopState.mode !== "light" ||
    desktopState.frame !== "none" ||
    desktopState.iconFrame !== "none" ||
    desktopState.size !== "96px" ||
    desktopState.resultCount !== "1 icon" ||
    !desktopState.labels.includes("Cassette") ||
    !desktopState.url.includes("extras=1") ||
    !desktopState.url.includes("frame=none")
  ) {
    throw new Error(`Unexpected desktop state: ${JSON.stringify(desktopState)}`);
  }

  await desktop.locator(".icon-card").click();
  await desktop.waitForFunction(() => document.querySelector("#iconDialog")?.open === true);
  const dialogState = await desktop.evaluate(() => ({
    title: document.querySelector("#dialogTitle")?.textContent,
    component: document.querySelector("#componentSnippet")?.textContent,
    sprite: document.querySelector("#spriteSnippet")?.textContent,
    previewFrame: document.querySelector("#dialogIcon")?.getAttribute("frame"),
    download: document.querySelector("#downloadIconLink")?.getAttribute("href")
  }));

  if (
    dialogState.title !== "Cassette" ||
    !dialogState.component?.includes('name="cassette"') ||
    !dialogState.component?.includes('frame="none"') ||
    !dialogState.sprite?.includes("--usk-icon-frame-opacity:0") ||
    dialogState.previewFrame !== "none" ||
    !dialogState.download?.includes("packs/synthwave/icons/cassette.svg")
  ) {
    throw new Error(`Unexpected dialog state: ${JSON.stringify(dialogState)}`);
  }

  await desktop.keyboard.press("Escape");
  await desktop.waitForFunction(() => document.querySelector("#iconDialog")?.open === false);
  await assertLightThemeContrast(desktop, baseUrl);

  if (desktopEvents.length > 0) {
    throw new Error(`Console/page errors:\n${desktopEvents.join("\n")}`);
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await mobile.waitForFunction(() =>
    Boolean(document.querySelector('#packSelect option[value="minimal-saas"]'))
  );
  const mobileState = await mobile.evaluate(() => ({
    cards: document.querySelectorAll(".icon-card").length,
    controlsVisible: Boolean(document.querySelector(".control-rail")?.checkVisibility()),
    searchVisible: Boolean(document.querySelector("#iconSearch")?.checkVisibility())
  }));

  if (mobileState.cards !== 64 || !mobileState.controlsVisible || !mobileState.searchVisible) {
    throw new Error(`Unexpected mobile state: ${JSON.stringify(mobileState)}`);
  }

  const filePage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await filePage.goto(pathToFileURL(path.join(root, "index.html")).href, {
    waitUntil: "domcontentloaded"
  });
  const fileNoticeVisible = await filePage.locator("#fileProtocolNotice").isVisible();

  if (!fileNoticeVisible) {
    throw new Error("Direct file load did not show the server-required notice.");
  }

  console.log("Demo smoke check passed.");
} finally {
  await browser.close();
  server.kill();
  await once(server, "exit").catch(() => {});
}

async function assertLightThemeContrast(page, url) {
  const failures = [];

  // Light theme checks keep the demo from regressing into mixed dark/light surfaces.
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

  if (failures.length > 0) {
    throw new Error(`Light mode theme regressions:\n${failures.join("\n")}`);
  }
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

    if (!cardElement) {
      throw new Error("Missing light mode surface target: .icon-card");
    }

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
