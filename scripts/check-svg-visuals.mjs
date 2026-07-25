#!/usr/bin/env node
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const registry = JSON.parse(
  await readFile(join(root, "dist", "registry.json"), "utf8")
);
const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 4181);
const baseUrl = `http://${host}:${port}/`;
const reportOnly = process.argv.includes("--report-only");
const captureScreenshots = process.argv.includes("--screenshots");
const themes = [
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
const modes = ["light", "dark", "contrast"];
const screenshotDir = join(tmpdir(), "ui-style-kit-icons-svg-audit");
const reportPath = join(tmpdir(), "ui-style-kit-icons-svg-audit.json");
const findings = [];
const summaries = [];
const browserEvents = [];
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
  throw new Error("The SVG audit server did not start.");
}

if (captureScreenshots) {
  await mkdir(screenshotDir, { recursive: true });
}

const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserEvents.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    browserEvents.push(`pageerror: ${error.message}`);
  });

  for (const pack of registry.packs) {
    const expectedCount = pack.coreIcons.length + pack.optionalIcons.length;
    const url = new URL(baseUrl);

    url.searchParams.set("pack", pack.id);
    url.searchParams.set("theme", "forest-moss");
    url.searchParams.set("mode", "light");
    url.searchParams.set("frame", "none");
    url.searchParams.set("size", "76");
    if (pack.optionalIcons.length > 0) {
      url.searchParams.set("extras", "1");
    }

    await page.goto(url.href, { waitUntil: "networkidle" });
    await page.waitForFunction(
      (count) => {
        const icons = [...document.querySelectorAll(".icon-card usk-icon")];

        return (
          icons.length === count &&
          icons.every(
            (icon) =>
              !icon.hasAttribute("data-loading") &&
              Boolean(icon.shadowRoot?.querySelector("svg"))
          )
        );
      },
      expectedCount
    );
    await page.addStyleTag({
      content:
        "*,*::before,*::after{animation:none!important;transition:none!important}"
    });

    const geometry = await inspectIcons(page);
    inspectGeometry(pack.id, geometry);

    let worstContrast = Number.POSITIVE_INFINITY;
    let worstState = "";
    let contrastFailures = 0;

    for (const theme of themes) {
      for (const mode of modes) {
        await applyThemeState(page, theme, mode);
        const contrast = await inspectIcons(page);

        for (const icon of contrast) {
          if (icon.maxContrast === null) {
            continue;
          }

          if (icon.maxContrast < worstContrast) {
            worstContrast = icon.maxContrast;
            worstState = `${theme}/${mode}/${icon.id}`;
          }

          if (
            icon.maxContrast < 3 ||
            (icon.strongPaintExtent !== null && icon.strongPaintExtent < 48)
          ) {
            contrastFailures += 1;
            findings.push({
              type: "contrast",
              pack: pack.id,
              icon: icon.id,
              state: `${theme}/${mode}`,
              maxContrast: icon.maxContrast,
              strongPaintExtent: icon.strongPaintExtent
            });
          }
        }
      }
    }

    summaries.push({
      pack: pack.id,
      icons: expectedCount,
      contrastFailures,
      worstContrast:
        Number.isFinite(worstContrast) ? Number(worstContrast.toFixed(2)) : null,
      worstState
    });

    if (captureScreenshots) {
      await applyThemeState(page, "forest-moss", "light");
      await page.screenshot({
        path: join(screenshotDir, `${pack.id}.png`),
        fullPage: true
      });
    }
  }
} finally {
  await browser.close();
  server.kill();
  await once(server, "exit").catch(() => {});
}

if (browserEvents.length > 0) {
  findings.push({
    type: "browser",
    events: [...new Set(browserEvents)]
  });
}

await writeFile(
  reportPath,
  `${JSON.stringify({ summaries, findings }, null, 2)}\n`,
  "utf8"
);

console.table(summaries);
console.log(`SVG visual audit report: ${reportPath}`);
if (captureScreenshots) {
  console.log(`SVG visual audit screenshots: ${screenshotDir}`);
}

if (findings.length > 0) {
  const preview = findings.slice(0, 40);
  console.error(`SVG visual audit found ${findings.length} issues.`);
  console.error(JSON.stringify(preview, null, 2));

  if (!reportOnly) {
    process.exitCode = 1;
  }
} else {
  console.log("SVG visual audit passed.");
}

function inspectGeometry(packId, icons) {
  for (const icon of icons) {
    if (icon.renderRatio < 0.9) {
      findings.push({
        type: "render-size",
        pack: packId,
        icon: icon.id,
        renderRatio: icon.renderRatio
      });
    }

    if (icon.glyphExtent < 64) {
      findings.push({
        type: "glyph-size",
        pack: packId,
        icon: icon.id,
        glyphExtent: icon.glyphExtent
      });
    }

    if (icon.overflow > 1) {
      findings.push({
        type: "viewbox-overflow",
        pack: packId,
        icon: icon.id,
        overflow: icon.overflow
      });
    }
  }
}

async function applyThemeState(page, theme, mode) {
  await page.evaluate(
    ({ nextTheme, nextMode }) => {
      document.body.dataset.theme = nextTheme;
      document.body.dataset.mode = nextMode;
    },
    { nextTheme: theme, nextMode: mode }
  );
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      })
  );
}

async function inspectIcons(page) {
  return page.evaluate(() => {
    const geometrySelector =
      "path, rect, circle, ellipse, line, polyline, polygon, use";

    function parseColor(value) {
      const rgb = value.match(/^rgba?\(([^)]+)\)$/iu);

      if (rgb) {
        const channels = rgb[1].split(/[ ,/]+/u).filter(Boolean).map(Number);

        return {
          r: channels[0],
          g: channels[1],
          b: channels[2],
          a: Number.isFinite(channels[3]) ? channels[3] : 1
        };
      }

      const srgb = value.match(/^color\(srgb\s+([^)]*)\)$/iu);

      if (srgb) {
        const [channelsText, alphaText] = srgb[1].split("/").map((part) => part.trim());
        const channels = channelsText.split(/\s+/u).map(Number);
        const alpha = Number(alphaText);

        return {
          r: channels[0] * 255,
          g: channels[1] * 255,
          b: channels[2] * 255,
          a: Number.isFinite(alpha) ? alpha : 1
        };
      }

      return null;
    }

    function blend(foreground, background, opacity = 1) {
      const alpha = Math.max(0, Math.min(1, foreground.a * opacity));

      return {
        r: foreground.r * alpha + background.r * (1 - alpha),
        g: foreground.g * alpha + background.g * (1 - alpha),
        b: foreground.b * alpha + background.b * (1 - alpha),
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
      return (
        0.2126 * channel(color.r) +
        0.7152 * channel(color.g) +
        0.0722 * channel(color.b)
      );
    }

    function contrast(foreground, background) {
      const light = Math.max(luminance(foreground), luminance(background));
      const dark = Math.min(luminance(foreground), luminance(background));

      return (light + 0.05) / (dark + 0.05);
    }

    function inheritedOpacity(element, svg) {
      let opacity = 1;
      let current = element;

      while (current && current !== svg) {
        opacity *= Number.parseFloat(getComputedStyle(current).opacity || "1");
        current = current.parentElement;
      }

      return opacity;
    }

    function unionBox(boxes) {
      if (boxes.length === 0) {
        return null;
      }

      const left = Math.min(...boxes.map((box) => box.x));
      const top = Math.min(...boxes.map((box) => box.y));
      const right = Math.max(...boxes.map((box) => box.x + box.width));
      const bottom = Math.max(...boxes.map((box) => box.y + box.height));

      return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top
      };
    }

    return [...document.querySelectorAll(".icon-card")].map((card) => {
      const icon = card.querySelector("usk-icon");
      const svg = icon?.shadowRoot?.querySelector("svg");

      if (!icon || !svg) {
        return {
          id: card.dataset.iconId,
          renderRatio: 0,
          glyphExtent: 0,
          overflow: 0,
          maxContrast: null,
          strongPaintExtent: null
        };
      }

      const hostRect = icon.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;
      const bodyBackground = parseColor(
        getComputedStyle(document.body).backgroundColor
      );
      const rawCardBackground =
        parseColor(getComputedStyle(card).backgroundColor) ?? bodyBackground;
      const cardBackground =
        rawCardBackground.a < 1
          ? blend(rawCardBackground, bodyBackground)
          : rawCardBackground;
      const glyphBoxes = [];
      const strongPaintBoxes = [];
      const paintContrasts = [];

      for (const element of svg.querySelectorAll(geometrySelector)) {
        if (
          element.closest("defs, clipPath, mask, marker, pattern, symbol") ||
          element.closest("[data-icon-frame]")
        ) {
          continue;
        }

        let box;

        try {
          box = element.getBBox();
        } catch {
          continue;
        }

        if (![box.x, box.y, box.width, box.height].every(Number.isFinite)) {
          continue;
        }

        glyphBoxes.push(box);
        const styles = getComputedStyle(element);
        const opacity = inheritedOpacity(element, svg);
        const fill = parseColor(styles.fill);
        const stroke = parseColor(styles.stroke);
        const candidates = [fill, stroke]
          .filter(Boolean)
          .map((color) => contrast(blend(color, cardBackground, opacity), cardBackground));

        if (candidates.length === 0) {
          continue;
        }

        const elementContrast = Math.max(...candidates);
        paintContrasts.push(elementContrast);

        if (elementContrast >= 3) {
          strongPaintBoxes.push(box);
        }
      }

      const glyphBox = unionBox(glyphBoxes);
      const strongPaintBox = unionBox(strongPaintBoxes);
      const leftOverflow = Math.max(0, viewBox.x - (glyphBox?.x ?? viewBox.x));
      const topOverflow = Math.max(0, viewBox.y - (glyphBox?.y ?? viewBox.y));
      const rightOverflow = Math.max(
        0,
        (glyphBox?.x ?? viewBox.x) +
          (glyphBox?.width ?? 0) -
          (viewBox.x + viewBox.width)
      );
      const bottomOverflow = Math.max(
        0,
        (glyphBox?.y ?? viewBox.y) +
          (glyphBox?.height ?? 0) -
          (viewBox.y + viewBox.height)
      );

      return {
        id: card.dataset.iconId,
        renderRatio: Number(
          (
            Math.min(svgRect.width / hostRect.width, svgRect.height / hostRect.height) || 0
          ).toFixed(3)
        ),
        glyphExtent: Number(
          Math.max(glyphBox?.width ?? 0, glyphBox?.height ?? 0).toFixed(2)
        ),
        overflow: Number(
          Math.max(leftOverflow, topOverflow, rightOverflow, bottomOverflow).toFixed(2)
        ),
        maxContrast:
          paintContrasts.length > 0
            ? Number(Math.max(...paintContrasts).toFixed(2))
            : null,
        strongPaintExtent: strongPaintBox
          ? Number(Math.max(strongPaintBox.width, strongPaintBox.height).toFixed(2))
          : null
      };
    });
  });
}
