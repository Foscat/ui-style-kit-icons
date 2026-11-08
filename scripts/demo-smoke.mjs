#!/usr/bin/env node
import { spawn } from "node:child_process";
import { once } from "node:events";
import { chromium } from "playwright";
import { findOpenPort } from "./find-open-port.mjs";

const root = process.cwd();
const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? (await findOpenPort(host)));
const baseUrl = `http://${host}:${port}/`;
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
  throw new Error("The documentation demo server did not start.");
}

const browser = await chromium.launch({ headless: true });

try {
  await verifyDesktopDemo(browser);
  await verifyMobileDemo(browser);
  console.log("Collection 01 documentation demo smoke check passed.");
} finally {
  await browser.close();
  server.kill();
  await once(server, "exit").catch(() => {});
}

/**
 * Verifies the desktop catalog's collection, control, and rendering contracts.
 *
 * @param {import("playwright").Browser} browser Playwright browser.
 * @returns {Promise<void>}
 */
async function verifyDesktopDemo(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const browserEvents = [];

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserEvents.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    browserEvents.push(`pageerror: ${error.message}`);
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => document.querySelectorAll(".icon-tile").length === 174
  );

  const faviconResponse = await page.request.get(
    `${baseUrl}assets/brand/favicon.ico`
  );

  if (
    faviconResponse.status() !== 200 ||
    faviconResponse.headers()["content-type"] !== "image/x-icon"
  ) {
    throw new Error(
      `Unexpected favicon response: ${faviconResponse.status()} ${faviconResponse.headers()["content-type"]}`
    );
  }

  await page.selectOption("#style", "technical-blueprint");
  await page.waitForFunction(
    () => document.body.dataset.ui === "technical-blueprint"
  );
  await page.selectOption("#theme", "arctic-indigo");
  await page.selectOption("#mode", "dark");
  await page.selectOption("#paint", "monochrome");
  await page.selectOption("#size", "48");
  await page.locator("#search").fill("chart");
  await page.waitForFunction(
    () => document.querySelectorAll(".icon-tile:not([hidden])").length === 1
  );

  const state = await page.evaluate(() => {
    const visibleSvg = document.querySelector(".icon-tile:not([hidden]) svg");
    const paintedNodes = visibleSvg
      ? [visibleSvg, ...visibleSvg.querySelectorAll("*")]
      : [];

    return {
      familyCount: document.querySelectorAll("#style option").length,
      family: document.body.dataset.ui,
      theme: document.body.dataset.theme,
      mode: document.body.dataset.mode,
      paint: document.querySelector("#paint")?.value,
      size: getComputedStyle(document.body)
        .getPropertyValue("--catalog-size")
        .trim(),
      results: document.querySelector("#results")?.textContent,
      visibleIcon: document.querySelector(".icon-tile:not([hidden])")?.dataset
        .icon,
      monochrome: paintedNodes.some((node) =>
        ["fill", "stroke"].some(
          (attribute) => node.getAttribute(attribute) === "currentColor"
        )
      ),
      title: document.title
    };
  });

  if (
    state.familyCount !== 20 ||
    state.family !== "technical-blueprint" ||
    state.theme !== "arctic-indigo" ||
    state.mode !== "dark" ||
    state.paint !== "monochrome" ||
    state.size !== "48px" ||
    state.results !== "1 of 174" ||
    state.visibleIcon !== "chart-bar" ||
    !state.monochrome ||
    state.title !== "Icon Studio · UI Style Kit"
  ) {
    throw new Error(`Unexpected desktop demo state: ${JSON.stringify(state)}`);
  }

  if (browserEvents.length > 0) {
    throw new Error(`Console/page errors:\n${browserEvents.join("\n")}`);
  }

  await page.close();
}

/**
 * Verifies the compact layout keeps the full catalog and inspector available.
 *
 * @param {import("playwright").Browser} browser Playwright browser.
 * @returns {Promise<void>}
 */
async function verifyMobileDemo(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => document.querySelectorAll(".icon-tile").length === 174
  );
  const state = await page.evaluate(() => ({
    cards: document.querySelectorAll(".icon-tile").length,
    inspectorVisible: Boolean(document.querySelector(".inspector")?.checkVisibility()),
    searchVisible: Boolean(document.querySelector("#search")?.checkVisibility()),
    inspectorPrecedesGallery:
      document.querySelector("#workspace")?.firstElementChild?.classList.contains(
        "inspector"
      ) ?? false
  }));

  if (
    state.cards !== 174 ||
    !state.inspectorVisible ||
    !state.searchVisible ||
    !state.inspectorPrecedesGallery
  ) {
    throw new Error(`Unexpected mobile demo state: ${JSON.stringify(state)}`);
  }

  await page.close();
}
