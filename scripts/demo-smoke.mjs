#!/usr/bin/env node
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { assertDemoEcosystemOwnership } from "./demo-browser-contract.mjs";
import { findOpenPort } from "./find-open-port.mjs";
import { installDemoDependencyRoutes } from "./route-demo-dependencies.mjs";

const root = process.cwd();
const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? (await findOpenPort(host)));
const baseUrl = `http://${host}:${port}/`;
const colorThemes = [
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
const colorModes = ["light", "dark", "contrast"];
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

const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const desktopEvents = [];

  await installDemoDependencyRoutes(desktop);
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
  await assertDemoEcosystemOwnership(desktop);
  const faviconResponse = await desktop.request.get(
    `${baseUrl}assets/favicon.ico`
  );

  if (
    faviconResponse.status() !== 200 ||
    faviconResponse.headers()["content-type"] !== "image/x-icon"
  ) {
    throw new Error(
      `Unexpected favicon response: ${faviconResponse.status()} ${faviconResponse.headers()["content-type"]}`
    );
  }

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
  await assertThemeModeContrast(desktop, baseUrl);

  if (desktopEvents.length > 0) {
    throw new Error(`Console/page errors:\n${desktopEvents.join("\n")}`);
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await installDemoDependencyRoutes(mobile);
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

  await assertRuntimeSanitizer(browser, baseUrl);
  await assertRuntimeRetry(browser, baseUrl);

  console.log("Demo smoke check passed.");
} finally {
  await browser.close();
  server.kill();
  await once(server, "exit").catch(() => {});
}

async function assertRuntimeRetry(browser, url) {
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const iconUrl = `${url}tests/fixtures/retry/icons/home.svg`;
  let attempts = 0;

  await page.route(iconUrl, async (route) => {
    attempts += 1;

    if (attempts === 1) {
      await route.fulfill({
        status: 503,
        contentType: "text/plain",
        body: "Temporary failure"
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "image/svg+xml",
      path: path.join(root, "icons", "home.svg")
    });
  });
  await page.goto(`${url}tests/fixtures/runtime-retry.html`, {
    waitUntil: "domcontentloaded"
  });
  await page.waitForFunction(() => document.body.dataset.errors === "1");
  await page.evaluate(() => document.querySelector("usk-icon")?.refresh());
  await page.waitForFunction(() => document.body.dataset.ready === "true");

  const state = await page.evaluate(() => ({
    errors: document.body.dataset.errors,
    hasSvg: Boolean(
      document.querySelector("usk-icon")?.shadowRoot?.querySelector("svg")
    )
  }));

  await page.close();

  if (attempts !== 2 || state.errors !== "1" || !state.hasSvg) {
    throw new Error(
      `Runtime retry regression: ${JSON.stringify({ attempts, state })}`
    );
  }
}

async function assertRuntimeSanitizer(browser, url) {
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const externalRequests = [];
  const browserEvents = [];

  page.on("request", (request) => {
    if (request.url().includes("example.invalid")) {
      externalRequests.push(request.url());
    }
  });
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserEvents.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    browserEvents.push(`pageerror: ${error.message}`);
  });

  await page.goto(`${url}tests/fixtures/runtime-security.html`, {
    waitUntil: "networkidle"
  });
  await page.waitForFunction(() =>
    ["true", "error"].includes(document.body.dataset.ready)
  );

  const state = await page.evaluate(() => {
    const icon = document.querySelector("usk-icon");
    const svg = icon?.shadowRoot?.querySelector("svg");

    if (!svg) {
      return { ready: document.body.dataset.ready, missingSvg: true };
    }

    const nodes = [svg, ...svg.querySelectorAll("*")];
    const attributes = nodes.flatMap((node) => [...node.attributes]);

    return {
      ready: document.body.dataset.ready,
      blockedElements: svg.querySelectorAll(
        "a, animate, animateMotion, animateTransform, audio, discard, embed, foreignObject, iframe, image, object, script, set, source, track, video"
      ).length,
      eventAttributes: attributes.filter(({ name }) =>
        name.toLowerCase().startsWith("on")
      ).length,
      unsafeReferences: attributes.filter(
        ({ name, value }) =>
          !name.toLowerCase().startsWith("xmlns") &&
          /(?:https?:|javascript:|data:)/iu.test(value)
      ).length,
      unsafeStyleSheets: svg.querySelectorAll("#unsafe-style-sheet").length,
      internalHref: svg.querySelector("#safe-use")?.getAttribute("href"),
      safeShape: Boolean(svg.querySelector("#safe-shape")),
      unsafeGlobals: [
        "__unsafeRoot",
        "__unsafeScript",
        "__unsafeForeignObject",
        "__unsafeLink",
        "__unsafeAnimation",
        "__unsafeEvent"
      ].filter((name) => Boolean(globalThis[name]))
    };
  });

  await page.close();

  if (
    state.ready !== "true" ||
    state.missingSvg ||
    state.blockedElements !== 0 ||
    state.eventAttributes !== 0 ||
    state.unsafeReferences !== 0 ||
    state.unsafeStyleSheets !== 0 ||
    state.internalHref !== "#safe-shape" ||
    !state.safeShape ||
    state.unsafeGlobals.length > 0 ||
    externalRequests.length > 0 ||
    browserEvents.length > 0
  ) {
    throw new Error(
      `Runtime sanitizer regression: ${JSON.stringify({
        state,
        externalRequests,
        browserEvents
      })}`
    );
  }
}

async function assertThemeModeContrast(page, url) {
  const failures = [];

  for (const mode of colorModes) {
    for (const theme of colorThemes) {
      await page.goto(
        `${url}?mode=${mode}&theme=${theme}&pack=minimal-saas`,
        { waitUntil: "networkidle" }
      );
      await page.waitForFunction(
        ({ expectedMode, expectedTheme }) =>
          document.body.dataset.mode === expectedMode &&
          document.body.dataset.theme === expectedTheme,
        { expectedMode: mode, expectedTheme: theme }
      );

      const metrics = await getThemeMetrics(page);

      if (
        mode === "light" &&
        (metrics.bodyLuminance < 0.72 || metrics.cardLuminance < 0.72)
      ) {
        failures.push(
          `${theme}/${mode}: light surfaces too dark ${JSON.stringify({
            bodyLuminance: metrics.bodyLuminance,
            cardLuminance: metrics.cardLuminance
          })}`
        );
      }

      for (const check of metrics.checks) {
        if (check.contrast < 4.5) {
          failures.push(
            `${theme}/${mode}: ${check.name} contrast ${check.contrast}`
          );
        }
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(`Theme and mode regressions:\n${failures.join("\n")}`);
  }
}

async function getThemeMetrics(page) {
  return page.evaluate(() => {
    function parseColor(value) {
      const match = value.match(/rgba?\(([^)]+)\)/i);

      if (match) {
        const [r, g, b, alpha] = match[1]
          .split(/[ ,/]+/)
          .filter(Boolean)
          .map(Number);

        return {
          r,
          g,
          b,
          a: Number.isFinite(alpha) ? alpha : 1
        };
      }

      const srgbMatch = value.match(/^color\(srgb\s+([^)]+)\)$/i);

      if (srgbMatch) {
        const [r, g, b, alpha] = srgbMatch[1]
          .split(/[\s/]+/)
          .filter(Boolean)
          .map(Number);

        // CSS Color 4 serializes sRGB channels from zero to one.
        return {
          r: r * 255,
          g: g * 255,
          b: b * 255,
          a: Number.isFinite(alpha) ? alpha : 1
        };
      }

      throw new Error(`Unsupported computed color: ${value}`);
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
      ["control heading", ".control-heading [role='heading']"],
      ["control label", ".control-field > span"],
      ["select control", "#themeSelect"],
      ["search input", "#iconSearch"],
      ["card label", ".icon-card strong"],
      ["card code", ".icon-card code"],
      ["toolbar", ".gallery-toolbar [role='heading']"],
      ["stat label", ".pack-summary dt"],
      ["stat value", ".pack-summary dd"],
      ["install command", ".install-block code"],
      ["inactive mode", ".segmented-control button:nth-child(2)"],
      ["active mode", ".segmented-control button[aria-pressed='true']"]
    ].map(([name, selector]) => {
      const element = document.querySelector(selector);

      if (!element) {
        throw new Error(`Missing theme contrast target: ${selector}`);
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
      throw new Error("Missing theme surface target: .icon-card");
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
