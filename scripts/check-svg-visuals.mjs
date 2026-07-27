#!/usr/bin/env node
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { chromium } from "playwright";
import { edgeMaskSimilarity } from "./edge-mask-similarity.mjs";
import { findOpenPort } from "./find-open-port.mjs";
import { installDemoDependencyRoutes } from "./route-demo-dependencies.mjs";
import { collectRenderedIconMetrics } from "./svg-browser-metrics.mjs";
import {
  analyzeElementPaint,
  boundsContain,
  weightedOverlapRatio,
  contrastThreshold
} from "./svg-visual-metrics.mjs";

const root = process.cwd();
const registry = JSON.parse(
  await readFile(join(root, "dist", "registry.json"), "utf8")
);
const opticalBaselines = JSON.parse(
  await readFile(
    join(root, "contract", "icon-optical-baselines.json"),
    "utf8"
  )
);
const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? (await findOpenPort(host)));
const baseUrl = `http://${host}:${port}/`;
const reportOnly = process.argv.includes("--report-only");
const createReviewAssets =
  process.argv.includes("--review") || process.argv.includes("--screenshots");
const prototypeOnly = process.argv.includes("--prototype");
const requestedBrowser = process.argv
  .find((argument) => argument.startsWith("--browser="))
  ?.slice("--browser=".length);
const requestedPack = process.argv
  .find((argument) => argument.startsWith("--pack="))
  ?.slice("--pack=".length);
const auditPacks = requestedPack
  ? registry.packs.filter(({ id }) => id === requestedPack)
  : registry.packs;
const outputDirectory = join(root, "output", "visual-audit");
const contactSheetDirectory = join(outputDirectory, "contact-sheets");
const semanticMatrixDirectory = join(outputDirectory, "semantic-matrices");
const prototypeMatrixDirectory = join(outputDirectory, "prototype-matrices");
const reportPath = join(outputDirectory, "report.json");
const reportHtmlPath = join(outputDirectory, "index.html");
const comparisonPath = join(outputDirectory, "semantic-comparison.png");
const borderlessComparisonPath = join(
  outputDirectory,
  "semantic-comparison-borderless.png"
);
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
const frames = ["auto", "none", "soft"];
const auditFrames = prototypeOnly ? ["auto", "none"] : frames;
const sizes = [20, 76];
const prototypeIds = [
  "home",
  "users",
  "video",
  "link",
  "cloud",
  "network",
  "megaphone",
  "palette"
];
const semanticRepairIds = new Set([
  "network",
  "bug",
  "megaphone",
  "link",
  "cloud",
  "users"
]);
const findings = [];
const summaries = [];
const browserEvents = [];
const generatedAssets = [];

if (requestedPack && auditPacks.length === 0) {
  throw new Error(`Unknown SVG audit pack: ${requestedPack}`);
}

if (requestedBrowser && !["chromium", "chrome"].includes(requestedBrowser)) {
  throw new Error(`Unsupported SVG audit browser: ${requestedBrowser}`);
}

const server = spawn(process.execPath, ["scripts/serve-demo.mjs", String(port)], {
  cwd: root,
  env: { ...process.env, HOST: host, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"]
});

let browser;
try {
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
    throw new Error("The SVG audit server did not start.");
  }

  await mkdir(outputDirectory, { recursive: true });
  if (createReviewAssets) {
    await mkdir(contactSheetDirectory, { recursive: true });
    await mkdir(semanticMatrixDirectory, { recursive: true });
    await mkdir(prototypeMatrixDirectory, { recursive: true });
  }

  browser = await chromium.launch({
    headless: true,
    ...(requestedBrowser === "chrome" ? { channel: "chrome" } : {})
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await installDemoDependencyRoutes(page);
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserEvents.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    browserEvents.push(`pageerror: ${error.message}`);
  });

  for (const pack of auditPacks) {
    console.log(`Auditing SVG pack: ${pack.id}`);
    const findingStart = findings.length;
    const expectedCount = prototypeOnly
      ? prototypeIds.length
      : pack.coreIcons.length + pack.optionalIcons.length;
    const contactUrl = auditUrl({
      view: prototypeOnly ? "prototype-pack" : "contact",
      pack: pack.id,
      theme: "forest-moss",
      mode: "light",
      frame: "auto",
      size: 76
    });

    await openAuditFixture(page, contactUrl, expectedCount);
    const geometryBySize = new Map();
    const borderlessGeometryBySize = new Map();

    for (const size of sizes) {
      await applyVisualState(page, {
        theme: "forest-moss",
        mode: "light",
        frame: "auto",
        size
      });
      geometryBySize.set(size, await inspectIcons(page));
      await applyVisualState(page, {
        theme: "forest-moss",
        mode: "light",
        frame: "none",
        size
      });
      borderlessGeometryBySize.set(size, await inspectIcons(page));
    }

    inspectGeometry(pack.id, geometryBySize);
    inspectPrototypeGeometry(pack.id, borderlessGeometryBySize);

    let worstContrast = Number.POSITIVE_INFINITY;
    let worstState = "";
    let auditedElementStates = 0;
    const stateBaselines = new Map();

    for (const theme of themes) {
      for (const mode of modes) {
        for (const frame of auditFrames) {
          await applyVisualState(page, { theme, mode, frame, size: 76 });
          const icons = await inspectIcons(page);
          const state = `${theme}/${mode}/${frame}`;
          const result = inspectPaintState(pack.id, icons, {
            theme,
            mode,
            frame
          });

          auditedElementStates += result.auditedElementStates;
          if (result.worstContrast < worstContrast) {
            worstContrast = result.worstContrast;
            worstState = result.worstState;
          }

          const baselineKey = `${theme}/${mode}`;
          if (frame === "auto") {
            stateBaselines.set(
              baselineKey,
              new Map(
                icons.map((icon) => [
                  icon.id,
                  {
                    glyphExtent: icon.glyphExtent,
                    centerOffsetX: icon.centerOffsetX,
                    centerOffsetY: icon.centerOffsetY
                  }
                ])
              )
            );
          } else {
            inspectFrameInvariant(
              pack.id,
              state,
              icons,
              stateBaselines.get(baselineKey)
            );
          }
        }
      }
    }

    await inspectConsumptionPaths(page, pack);

    if (createReviewAssets) {
      await openAuditFixture(page, contactUrl, expectedCount);
      const screenshotPath = join(
        contactSheetDirectory,
        `${pack.id}${prototypeOnly ? "-prototype" : ""}.png`
      );

      await page.screenshot({ path: screenshotPath, fullPage: true });
      generatedAssets.push(relative(outputDirectory, screenshotPath).replaceAll("\\", "/"));

      const borderlessContactUrl = auditUrl({
        view: prototypeOnly ? "prototype-pack" : "contact",
        pack: pack.id,
        theme: "forest-moss",
        mode: "light",
        frame: "none",
        size: 76
      });
      const borderlessScreenshotPath = join(
        contactSheetDirectory,
        `${pack.id}${prototypeOnly ? "-prototype" : ""}-borderless.png`
      );

      await openAuditFixture(page, borderlessContactUrl, expectedCount);
      await page.screenshot({
        path: borderlessScreenshotPath,
        fullPage: true
      });
      generatedAssets.push(
        relative(outputDirectory, borderlessScreenshotPath).replaceAll(
          "\\",
          "/"
        )
      );
    }

    summaries.push({
      pack: pack.id,
      icons: expectedCount,
      auditedStates: themes.length * modes.length * auditFrames.length,
      auditedElementStates,
      findings: findings.length - findingStart,
      worstContrast:
        Number.isFinite(worstContrast) ? round(worstContrast) : null,
      worstState
    });
  }

  if (createReviewAssets && !requestedPack && !prototypeOnly) {
    const comparisonUrl = auditUrl({
      view: "comparison",
      theme: "forest-moss",
      mode: "light",
      frame: "auto",
      size: 76
    });

    await openAuditFixture(
      page,
      comparisonUrl,
      registry.requiredIconCount * registry.packCount
    );
    await page.screenshot({ path: comparisonPath, fullPage: true });
    generatedAssets.push(relative(outputDirectory, comparisonPath).replaceAll("\\", "/"));

    const borderlessComparisonUrl = auditUrl({
      view: "comparison",
      theme: "forest-moss",
      mode: "light",
      frame: "none",
      size: 76
    });

    await openAuditFixture(
      page,
      borderlessComparisonUrl,
      registry.requiredIconCount * registry.packCount
    );
    await page.screenshot({
      path: borderlessComparisonPath,
      fullPage: true
    });
    generatedAssets.push(
      relative(outputDirectory, borderlessComparisonPath).replaceAll("\\", "/")
    );

    for (const theme of themes) {
      for (const mode of modes) {
        const matrixUrl = auditUrl({
          view: "regressions",
          theme,
          mode,
          size: 76
        });
        const matrixPath = join(
          semanticMatrixDirectory,
          `${theme}-${mode}.png`
        );

        await openAuditFixture(
          page,
          matrixUrl,
          registry.packCount * semanticRepairIds.size * 2
        );
        await page.screenshot({ path: matrixPath, fullPage: true });
        generatedAssets.push(
          relative(outputDirectory, matrixPath).replaceAll("\\", "/")
        );
      }
    }
  }

  if (!requestedPack) {
    await inspectPrototypeEdgeSimilarity(page);
  }

  if (createReviewAssets && !requestedPack) {
    for (const theme of themes) {
      for (const mode of modes) {
        for (const size of sizes) {
          const prototypeUrl = auditUrl({
            view: "prototype",
            theme,
            mode,
            size
          });
          const prototypePath = join(
            prototypeMatrixDirectory,
            `${theme}-${mode}-${size}px.png`
          );

          await openAuditFixture(
            page,
            prototypeUrl,
            registry.packCount * prototypeIds.length * 2
          );
          await page.screenshot({ path: prototypePath, fullPage: true });
          generatedAssets.push(
            relative(outputDirectory, prototypePath).replaceAll("\\", "/")
          );
        }
      }
    }
  }
} finally {
  await browser?.close();
  await stopServer(server);
}

if (browserEvents.length > 0) {
  findings.push({
    type: "browser",
    events: [...new Set(browserEvents)]
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  contractVersion: registry.contractVersion,
  thresholds: {
    light: contrastThreshold("light"),
    dark: contrastThreshold("dark"),
    contrast: contrastThreshold("contrast"),
    safeArea: 12,
    occupancy: {
      20: 5,
      76: 19
    }
  },
  matrix: {
    packs: auditPacks.length,
    icons: auditPacks.reduce(
      (total, pack) =>
        total +
        (prototypeOnly
          ? prototypeIds.length
          : pack.coreIcons.length + pack.optionalIcons.length),
      0
    ),
    themes,
    modes,
    frames: auditFrames,
    sizes,
    prototypeOnly
  },
  generatedAssets,
  summaries,
  findings
};

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(reportHtmlPath, createHtmlReport(report), "utf8");

console.table(summaries);
console.log(`SVG visual audit report: ${reportPath}`);
console.log(`SVG visual audit review: ${reportHtmlPath}`);

if (findings.length > 0) {
  console.error(`SVG visual audit found ${findings.length} issues.`);
  console.error(JSON.stringify(findings.slice(0, 40), null, 2));

  if (!reportOnly) {
    process.exitCode = 1;
  }
} else {
  console.log("SVG visual audit passed.");
}

function inspectGeometry(packId, geometryBySize) {
  const largeIcons = geometryBySize.get(76) ?? [];
  const smallIcons = new Map(
    (geometryBySize.get(20) ?? []).map((icon) => [icon.id, icon])
  );

  for (const icon of largeIcons) {
    const small = smallIcons.get(icon.id);
    const baseline = resolveOpticalBaseline(packId, icon.id);

    if (
      icon.viewBox.x !== 0 ||
      icon.viewBox.y !== 0 ||
      icon.viewBox.width !== 256 ||
      icon.viewBox.height !== 256
    ) {
      findings.push({
        type: "viewbox",
        pack: packId,
        icon: icon.id,
        viewBox: icon.viewBox
      });
    }

    if (icon.renderRatio < 0.99 || small?.renderRatio < 0.99) {
      findings.push({
        type: "render-size",
        pack: packId,
        icon: icon.id,
        largeRatio: round(icon.renderRatio),
        smallRatio: round(small?.renderRatio ?? 0)
      });
    }

    if (icon.glyphExtent < 64 || icon.glyphExtent > 232) {
      findings.push({
        type: "glyph-size",
        pack: packId,
        icon: icon.id,
        glyphExtent: round(icon.glyphExtent)
      });
    }

    if (
      (small?.glyphPixelExtent ?? 0) < 5 ||
      icon.glyphPixelExtent < 19
    ) {
      findings.push({
        type: "visual-occupancy",
        pack: packId,
        icon: icon.id,
        at20px: round(small?.glyphPixelExtent ?? 0),
        at76px: round(icon.glyphPixelExtent)
      });
    }

    const largeNormalized = icon.glyphPixelExtent / 76;
    const smallNormalized = (small?.glyphPixelExtent ?? 0) / 20;
    if (Math.abs(largeNormalized - smallNormalized) > 0.05) {
      findings.push({
        type: "occupancy-scale-drift",
        pack: packId,
        icon: icon.id,
        at20px: round(smallNormalized),
        at76px: round(largeNormalized)
      });
    }

    if (icon.overflow > 1) {
      findings.push({
        type: "viewbox-overflow",
        pack: packId,
        icon: icon.id,
        overflow: round(icon.overflow)
      });
    }

    if (icon.edgeInset < 12) {
      findings.push({
        type: "glyph-safe-area",
        pack: packId,
        icon: icon.id,
        edgeInset: round(icon.edgeInset)
      });
    }

    if (
      Math.abs(icon.centerOffsetX - (baseline.x ?? 0)) >
        (baseline.tolerance ?? opticalBaselines.defaultTolerance) ||
      Math.abs(icon.centerOffsetY - (baseline.y ?? 0)) >
        (baseline.tolerance ?? opticalBaselines.defaultTolerance)
    ) {
      findings.push({
        type: "glyph-alignment",
        pack: packId,
        icon: icon.id,
        centerOffsetX: round(icon.centerOffsetX),
        centerOffsetY: round(icon.centerOffsetY),
        baseline
      });
    }

    inspectSemanticGeometry(packId, icon);
  }
}

function inspectPrototypeGeometry(packId, geometryBySize) {
  const largeIcons = new Map(
    (geometryBySize.get(76) ?? []).map((icon) => [icon.id, icon])
  );
  const smallIcons = new Map(
    (geometryBySize.get(20) ?? []).map((icon) => [icon.id, icon])
  );

  for (const iconId of prototypeIds) {
    const large = largeIcons.get(iconId);
    const small = smallIcons.get(iconId);
    const semanticElements =
      large?.elements.filter(
        ({ semantic, frame, rendered }) =>
          semantic === "semantic" && !frame && rendered
      ) ?? [];

    if (
      !large ||
      !small ||
      semanticElements.length === 0 ||
      large.semanticElementCount === 0
    ) {
      findings.push({
        type: "missing-prototype-semantic",
        pack: packId,
        icon: iconId
      });
      continue;
    }

    if (
      (small.semanticPixelExtent ?? 0) < 5 ||
      (large.semanticPixelExtent ?? 0) < 19
    ) {
      findings.push({
        type: "prototype-occupancy",
        pack: packId,
        icon: iconId,
        at20px: round(small.semanticPixelExtent ?? 0),
        at76px: round(large.semanticPixelExtent ?? 0)
      });
    }

    if (
      semanticElements.some(
        ({ prototype }) => prototype !== "reference-led-v1"
      )
    ) {
      findings.push({
        type: "prototype-version",
        pack: packId,
        icon: iconId,
        expected: "reference-led-v1"
      });
    }
  }
}

function inspectSemanticGeometry(packId, icon) {
  const visibleFrame = icon.elements.filter(
    (element) => element.frame && element.rendered
  );
  const overlap = Number.isFinite(icon.frameGlyphOverlap)
    ? icon.frameGlyphOverlap
    : weightedOverlapRatio(icon.glyphBounds, visibleFrame);
  const overlapLimit = semanticRepairIds.has(icon.id) ? 0.02 : 0.08;

  if (overlap > overlapLimit) {
    findings.push({
      type: "frame-glyph-overlap",
      pack: packId,
      icon: icon.id,
      overlap: round(overlap),
      limit: overlapLimit
    });
  }

  if (["bug", "megaphone"].includes(icon.id)) {
    const semanticBounds = unionBounds(
      icon.parts.map(({ bounds }) => bounds)
    );

    if (
      !semanticBounds ||
      !boundsContain(icon.viewBox, semanticBounds, 12)
    ) {
      findings.push({
        type: "semantic-safe-area",
        pack: packId,
        icon: icon.id,
        bounds: semanticBounds,
        inset: 12
      });
    }
  }

  if (packId === "bento" && icon.id === "activity") {
    const chip = partBounds(icon, "activity-chip");
    const pulse = unionBounds([
      partBounds(icon, "activity-pulse"),
      partBounds(icon, "activity-baseline")
    ]);

    if (!chip || !pulse || !boundsContain(chip, pulse, 6)) {
      findings.push({
        type: "part-containment",
        pack: packId,
        icon: icon.id,
        container: chip,
        contents: pulse,
        inset: 6
      });
    }
  }

  if (
    ["retro-glass", "y2k"].includes(packId) &&
    icon.id === "sparkle"
  ) {
    const sparkleParts = [
      "sparkle-primary",
      "sparkle-secondary",
      "sparkle-tertiary"
    ].map((part) => ({ part, bounds: partBounds(icon, part) }));

    for (let first = 0; first < sparkleParts.length; first += 1) {
      for (
        let second = first + 1;
        second < sparkleParts.length;
        second += 1
      ) {
        if (
          intersectionArea(
            sparkleParts[first].bounds,
            sparkleParts[second].bounds
          ) > 0
        ) {
          findings.push({
            type: "part-overlap",
            pack: packId,
            icon: icon.id,
            parts: [
              sparkleParts[first].part,
              sparkleParts[second].part
            ]
          });
        }
      }
    }
  }
}

function resolveOpticalBaseline(packId, iconId) {
  const override = opticalBaselines.overrides[`${packId}/${iconId}`];

  if (override) {
    return override;
  }

  const profile = opticalBaselines.profiles?.find(
    ({ icon, packs }) => icon === iconId && packs.includes(packId)
  );

  return (
    profile ?? {
      x: 0,
      y: 0,
      tolerance: opticalBaselines.defaultTolerance
    }
  );
}

function inspectPaintState(packId, icons, state) {
  let worstContrast = Number.POSITIVE_INFINITY;
  let worstState = "";
  let auditedElementStates = 0;

  for (const icon of icons) {
    if (icon.missing) {
      findings.push({
        type: "missing-render",
        pack: packId,
        icon: icon.id,
        state
      });
      continue;
    }

    const visibleEssential = icon.elements.filter(
      (element) => element.essential && element.rendered
    );

    if (visibleEssential.length === 0) {
      findings.push({
        type: "missing-essential-paint",
        pack: packId,
        icon: icon.id,
        state
      });
    }

    for (const element of visibleEssential) {
      const result = analyzeAgainstBackgrounds(
        element,
        element.backgrounds ?? [icon.background],
        state.mode
      );

      auditedElementStates += 1;
      if (result.bestContrast < worstContrast) {
        worstContrast = result.bestContrast;
        worstState = `${state.theme}/${state.mode}/${state.frame}/${icon.id}/${element.key}`;
      }

      if (!result.passes) {
        findings.push({
          type: "element-contrast",
          pack: packId,
          icon: icon.id,
          element: element.key,
          state,
          threshold: result.threshold,
          bestContrast: round(result.bestContrast),
          fillCoverage: round(result.fillCoverage),
          strokeCoverage: round(result.strokeCoverage)
        });
      }
    }

    inspectFrameState(packId, icon, state);
  }

  return { worstContrast, worstState, auditedElementStates };
}

function inspectFrameState(packId, icon, state) {
  const frameElements = icon.elements.filter((element) => element.frame);
  const maxOpacity = Math.max(0, ...frameElements.map(({ opacity }) => opacity));

  if (frameElements.length === 0) {
    findings.push({
      type: "missing-frame-hook",
      pack: packId,
      icon: icon.id,
      state
    });
    return;
  }

  if (state.frame === "none" && maxOpacity > 0.01) {
    findings.push({
      type: "frame-opacity",
      pack: packId,
      icon: icon.id,
      state,
      expected: 0,
      actual: round(maxOpacity)
    });
  }

  if (state.frame === "soft") {
    const surfaceOpacity = Math.max(
      0,
      ...frameElements
        .filter(({ frameRole }) => frameRole === "surface")
        .map(({ opacity }) => opacity)
    );
    const decorOpacity = Math.max(
      0,
      ...frameElements
        .filter(({ frameRole }) => frameRole === "decor")
        .map(({ opacity }) => opacity)
    );

    if (
      surfaceOpacity < 0.35 ||
      surfaceOpacity > 0.37 ||
      decorOpacity > 0.101
    ) {
      findings.push({
        type: "frame-opacity",
        pack: packId,
        icon: icon.id,
        state,
        expected: "surface 0.36, decor <= 0.10",
        actual: {
          surface: round(surfaceOpacity),
          decor: round(decorOpacity)
        }
      });
    }
  }

  if (state.frame !== "auto") {
    return;
  }

  const visibleFrame = frameElements.filter((element) => element.rendered);
  const readableOutline = visibleFrame.some((element) =>
    analyzeAgainstBackgrounds(
      { ...element, essential: true },
      element.backgrounds ?? [icon.background],
      state.mode
    ).passes
  );

  if (!readableOutline) {
    findings.push({
      type: "frame-contrast",
      pack: packId,
      icon: icon.id,
      state,
      threshold: contrastThreshold(state.mode),
      candidates: visibleFrame.map((element) => {
        const result = analyzeAgainstBackgrounds(
          { ...element, essential: true },
          element.backgrounds ?? [icon.background],
          state.mode
        );

        return {
          element: element.key,
          frameRole: element.frameRole,
          opacity: round(element.opacity),
          fill: element.fill,
          stroke: element.stroke,
          backgrounds: element.backgrounds,
          bestContrast: round(result.bestContrast)
        };
      })
    });
  }
}

function analyzeAgainstBackgrounds(element, backgrounds, mode) {
  const results = backgrounds.map((background) =>
    analyzeElementPaint(element, { background, mode })
  );
  const weakest = results.reduce((current, candidate) =>
    candidate.bestContrast < current.bestContrast ? candidate : current
  );

  return {
    ...weakest,
    passes: results.every(({ passes }) => passes),
    bestContrast: Math.min(...results.map(({ bestContrast }) => bestContrast)),
    fillCoverage: Math.min(...results.map(({ fillCoverage }) => fillCoverage)),
    strokeCoverage: Math.min(...results.map(({ strokeCoverage }) => strokeCoverage))
  };
}

function inspectFrameInvariant(packId, state, icons, baseline) {
  if (!baseline) {
    return;
  }

  for (const icon of icons) {
    const expected = baseline.get(icon.id);

    if (
      !expected ||
      Math.abs(icon.glyphExtent - expected.glyphExtent) <= 1 &&
        Math.abs(icon.centerOffsetX - expected.centerOffsetX) <= 1 &&
        Math.abs(icon.centerOffsetY - expected.centerOffsetY) <= 1
    ) {
      continue;
    }

    findings.push({
      type: "frame-semantic-drift",
      pack: packId,
      icon: icon.id,
      state,
      expected,
      actual: {
        glyphExtent: round(icon.glyphExtent),
        centerOffsetX: round(icon.centerOffsetX),
        centerOffsetY: round(icon.centerOffsetY)
      }
    });
  }
}

async function inspectPrototypeEdgeSimilarity(page) {
  for (const iconId of prototypeIds) {
    const url = auditUrl({
      view: "semantic",
      icon: iconId,
      theme: "forest-moss",
      mode: "contrast",
      frame: "none",
      size: 76
    });

    await openAuditFixture(page, url, registry.packCount);
    const cards = page.locator(".icon-card");
    const screenshots = [];

    for (let index = 0; index < (await cards.count()); index += 1) {
      const card = cards.nth(index);
      const pack = await card.getAttribute("data-pack-id");
      const image = await card.locator("usk-icon").screenshot({
        animations: "disabled"
      });

      screenshots.push({
        pack,
        source: `data:image/png;base64,${image.toString("base64")}`
      });
    }

    const masks = await page.evaluate(createNormalizedEdgeMasks, screenshots);
    const candidates = masks.filter(({ pack }) => pack !== "system");

    for (let first = 0; first < candidates.length; first += 1) {
      for (let second = first + 1; second < candidates.length; second += 1) {
        const similarity = edgeMaskSimilarity(
          candidates[first].mask,
          candidates[second].mask
        );

        if (similarity >= 0.985) {
          findings.push({
            type: "edge-mask-similarity",
            icon: iconId,
            packs: [candidates[first].pack, candidates[second].pack],
            similarity: round(similarity),
            limit: 0.985
          });
        }
      }
    }
  }
}

async function createNormalizedEdgeMasks(screenshots) {
  const outputSize = 32;

  return Promise.all(
    screenshots.map(async ({ pack, source }) => {
      const image = new Image();

      image.src = source;
      await image.decode();

      const sourceCanvas = document.createElement("canvas");
      const sourceContext = sourceCanvas.getContext("2d", {
        willReadFrequently: true
      });

      sourceCanvas.width = image.naturalWidth;
      sourceCanvas.height = image.naturalHeight;
      sourceContext.drawImage(image, 0, 0);

      const { data, width, height } = sourceContext.getImageData(
        0,
        0,
        sourceCanvas.width,
        sourceCanvas.height
      );
      const corners = [
        0,
        (width - 1) * 4,
        (height - 1) * width * 4,
        (height * width - 1) * 4
      ];
      const background = [0, 1, 2, 3].map(
        (channel) =>
          corners.reduce(
            (total, offset) => total + data[offset + channel],
            0
          ) / corners.length
      );
      const signal = new Float32Array(width * height);
      let left = width;
      let top = height;
      let right = -1;
      let bottom = -1;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const pixel = (y * width + x) * 4;
          const colorDistance = Math.hypot(
            data[pixel] - background[0],
            data[pixel + 1] - background[1],
            data[pixel + 2] - background[2],
            data[pixel + 3] - background[3]
          );
          const value = Math.min(1, colorDistance / 255);

          signal[y * width + x] = value;
          if (value > 0.06) {
            left = Math.min(left, x);
            top = Math.min(top, y);
            right = Math.max(right, x);
            bottom = Math.max(bottom, y);
          }
        }
      }

      if (right < left || bottom < top) {
        return { pack, mask: [] };
      }

      left = Math.max(0, left - 1);
      top = Math.max(0, top - 1);
      right = Math.min(width - 1, right + 1);
      bottom = Math.min(height - 1, bottom + 1);

      // Normalize optical scale before comparing geometry across pack palettes.
      const normalized = new Float32Array(outputSize * outputSize);
      const cropWidth = Math.max(1, right - left);
      const cropHeight = Math.max(1, bottom - top);

      for (let y = 0; y < outputSize; y += 1) {
        for (let x = 0; x < outputSize; x += 1) {
          const sourceX = Math.round(
            left + (x / (outputSize - 1)) * cropWidth
          );
          const sourceY = Math.round(
            top + (y / (outputSize - 1)) * cropHeight
          );

          normalized[y * outputSize + x] =
            signal[sourceY * width + sourceX];
        }
      }

      const mask = new Array(outputSize * outputSize).fill(0);

      for (let y = 1; y < outputSize - 1; y += 1) {
        for (let x = 1; x < outputSize - 1; x += 1) {
          const index = y * outputSize + x;
          const horizontal =
            normalized[index - outputSize + 1] +
            2 * normalized[index + 1] +
            normalized[index + outputSize + 1] -
            normalized[index - outputSize - 1] -
            2 * normalized[index - 1] -
            normalized[index + outputSize - 1];
          const vertical =
            normalized[index + outputSize - 1] +
            2 * normalized[index + outputSize] +
            normalized[index + outputSize + 1] -
            normalized[index - outputSize - 1] -
            2 * normalized[index - outputSize] -
            normalized[index - outputSize + 1];

          mask[index] = Math.min(1, Math.hypot(horizontal, vertical));
        }
      }

      return { pack, mask };
    })
  );
}

async function inspectConsumptionPaths(page, pack) {
  const url = auditUrl({
    view: "paths",
    pack: pack.id,
    icon: "video",
    theme: "forest-moss",
    mode: "light",
    frame: "auto",
    size: 76
  });

  await openAuditFixture(page, url, 3);
  const icons = await inspectIcons(page);
  const paths = new Set(icons.map(({ path }) => path));

  for (const requiredPath of ["component", "inline", "sprite"]) {
    if (!paths.has(requiredPath)) {
      findings.push({
        type: "consumption-path",
        pack: pack.id,
        path: requiredPath,
        reason: "missing"
      });
    }
  }

  for (const icon of icons) {
    if (icon.missing || icon.glyphExtent < 64 || icon.renderRatio < 0.9) {
      findings.push({
        type: "consumption-path",
        pack: pack.id,
        path: icon.path,
        reason: icon.missing ? "missing render" : "undersized render",
        glyphExtent: round(icon.glyphExtent ?? 0),
        renderRatio: round(icon.renderRatio ?? 0)
      });
    }
  }
}

async function openAuditFixture(page, url, expectedCount) {
  await page.goto(url.href, { waitUntil: "networkidle" });
  await page.waitForFunction(
    (count) =>
      document.body.dataset.ready === "true" &&
      document.querySelectorAll(".icon-card").length === count,
    expectedCount
  );
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation:none!important;transition:none!important}"
  });
}

async function applyVisualState(page, state) {
  await page.evaluate(({ theme, mode, frame, size }) => {
    document.body.dataset.theme = theme;
    document.body.dataset.mode = mode;
    document.body.style.setProperty("--audit-icon-size", `${size}px`);

    for (const icon of document.querySelectorAll("usk-icon")) {
      if (frame === "auto") {
        icon.removeAttribute("frame");
      } else {
        icon.setAttribute("frame", frame);
      }
    }
  }, state);
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      })
  );
}

async function inspectIcons(page) {
  return page.evaluate(collectRenderedIconMetrics);
}

function auditUrl(options) {
  const url = new URL("tests/fixtures/svg-visual-audit.html", baseUrl);

  for (const [name, value] of Object.entries(options)) {
    if (value !== undefined) {
      url.searchParams.set(name, String(value));
    }
  }

  return url;
}

function createHtmlReport(report) {
  const summaryRows = report.summaries
    .map(
      (summary) => `
        <tr>
          <td>${escapeHtml(summary.pack)}</td>
          <td>${summary.icons}</td>
          <td>${summary.auditedElementStates}</td>
          <td>${summary.findings}</td>
          <td>${summary.worstContrast ?? "n/a"}</td>
          <td>${escapeHtml(summary.worstState)}</td>
        </tr>`
    )
    .join("");
  const assetLinks = report.generatedAssets
    .map(
      (asset) =>
        `<li><a href="${encodeURI(asset)}">${escapeHtml(asset)}</a></li>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>UI Style Kit Icons visual audit</title>
    <style>
      body{margin:0;padding:24px;color:#111827;background:#f8fafc;font:14px/1.5 system-ui,sans-serif}
      main{max-width:1200px;margin:auto}h1{font-size:24px}table{width:100%;border-collapse:collapse;background:#fff}
      th,td{padding:8px;border:1px solid #cbd5e1;text-align:left;vertical-align:top}th{background:#e2e8f0}
      code{font-family:ui-monospace,monospace}a{color:#075985}
    </style>
  </head>
  <body>
    <main>
      <h1>UI Style Kit Icons visual audit</h1>
      <p><strong>${report.findings.length}</strong> findings across ${report.matrix.icons} authored icons.</p>
      <table>
        <thead><tr><th>Pack</th><th>Icons</th><th>Element states</th><th>Findings</th><th>Worst</th><th>State</th></tr></thead>
        <tbody>${summaryRows}</tbody>
      </table>
      <h2>Review assets</h2>
      <ul>${assetLinks || "<li>Run with <code>--review</code> to create screenshots.</li>"}</ul>
      <p>Machine-readable details: <a href="report.json">report.json</a></p>
    </main>
  </body>
</html>
`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function round(value) {
  return Number.isFinite(value) ? Number(value.toFixed(3)) : null;
}

function partBounds(icon, part) {
  return icon.parts.find(({ name }) => name === part)?.bounds ?? null;
}

function unionBounds(boxes) {
  const valid = boxes.filter(Boolean);

  if (valid.length === 0) {
    return null;
  }

  const left = Math.min(...valid.map(({ x }) => x));
  const top = Math.min(...valid.map(({ y }) => y));
  const right = Math.max(...valid.map(({ x, width }) => x + width));
  const bottom = Math.max(...valid.map(({ y, height }) => y + height));

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  };
}

function intersectionArea(first, second) {
  if (!first || !second) {
    return 0;
  }

  const width =
    Math.min(first.x + first.width, second.x + second.width) -
    Math.max(first.x, second.x);
  const height =
    Math.min(first.y + first.height, second.y + second.height) -
    Math.max(first.y, second.y);

  return Math.max(0, width) * Math.max(0, height);
}

async function stopServer(process) {
  if (process.exitCode !== null) {
    return;
  }

  process.kill();
  await once(process, "exit").catch(() => {});
}
