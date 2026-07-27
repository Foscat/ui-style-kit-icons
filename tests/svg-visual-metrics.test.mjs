import assert from "node:assert/strict";
import { test } from "node:test";
import * as metrics from "../scripts/svg-visual-metrics.mjs";

const {
  analyzeElementPaint,
  contrastThreshold,
  transformBounds
} = metrics;

test("contrast thresholds distinguish standard and contrast modes", () => {
  assert.equal(contrastThreshold("light"), 3);
  assert.equal(contrastThreshold("dark"), 3);
  assert.equal(contrastThreshold("contrast"), 4.5);
});

test("essential gradient paint needs sufficient stop coverage or a keyline", () => {
  const background = "rgb(255, 255, 255)";
  const weakGradient = {
    essential: true,
    opacity: 1,
    fill: {
      type: "gradient",
      stops: [
        { color: "rgb(245, 245, 245)", opacity: 1 },
        { color: "rgb(235, 235, 235)", opacity: 1 },
        { color: "rgb(17, 24, 39)", opacity: 1 }
      ]
    },
    stroke: null
  };
  const outlinedGradient = {
    ...weakGradient,
    stroke: {
      type: "solid",
      color: "rgb(17, 24, 39)",
      opacity: 1
    }
  };

  assert.equal(
    analyzeElementPaint(weakGradient, { background, mode: "light" }).passes,
    false
  );
  assert.equal(
    analyzeElementPaint(outlinedGradient, { background, mode: "light" }).passes,
    true
  );
});

test("element opacity is composited before contrast is accepted", () => {
  const result = analyzeElementPaint(
    {
      essential: true,
      opacity: 0.2,
      fill: {
        type: "solid",
        color: "rgb(0, 0, 0)",
        opacity: 1
      },
      stroke: null
    },
    { background: "rgb(255, 255, 255)", mode: "light" }
  );

  assert.equal(result.passes, false);
  assert.ok(result.bestContrast < 3);
});

test("solid paint opacity is composited exactly once", () => {
  const result = analyzeElementPaint(
    {
      essential: true,
      opacity: 1,
      fill: {
        type: "solid",
        color: "rgb(0, 0, 0)",
        opacity: 0.5
      },
      stroke: null
    },
    { background: "rgb(255, 255, 255)", mode: "light" }
  );

  assert.equal(result.passes, true);
  assert.ok(result.bestContrast > 3.9 && result.bestContrast < 4.1);
});

test("computed color(srgb) paint is measured instead of treated as missing", () => {
  const result = analyzeElementPaint(
    {
      essential: true,
      opacity: 1,
      fill: {
        type: "solid",
        color: "color(srgb 0.05 0.08 0.12)",
        opacity: 1
      },
      stroke: null
    },
    { background: "rgb(255, 255, 255)", mode: "light" }
  );

  assert.equal(result.passes, true);
  assert.ok(result.bestContrast > 15);
});

test("gradient paint opacity is applied to every stop", () => {
  const result = analyzeElementPaint(
    {
      essential: true,
      opacity: 1,
      fill: {
        type: "gradient",
        opacity: 0.2,
        stops: [
          { color: "rgb(0, 0, 0)", opacity: 1 },
          { color: "rgb(0, 0, 0)", opacity: 1 }
        ]
      },
      stroke: null
    },
    { background: "rgb(255, 255, 255)", mode: "light" }
  );

  assert.equal(result.passes, false);
  assert.ok(result.bestContrast < 3);
});

test("decorative paint is reported without failing the essential gate", () => {
  const result = analyzeElementPaint(
    {
      essential: false,
      opacity: 0.1,
      fill: {
        type: "solid",
        color: "rgb(255, 255, 255)",
        opacity: 1
      },
      stroke: null
    },
    { background: "rgb(255, 255, 255)", mode: "contrast" }
  );

  assert.equal(result.passes, true);
  assert.equal(result.exempt, true);
});

test("transformed bounds include rotation and stroke inflation", () => {
  const bounds = transformBounds(
    { x: 10, y: 20, width: 40, height: 20 },
    { a: 0, b: 1, c: -1, d: 0, e: 120, f: 0 },
    4
  );

  assert.deepEqual(bounds, {
    x: 78,
    y: 8,
    width: 24,
    height: 44
  });
});

test("containment requires the requested inset on every edge", () => {
  const outer = { x: 50, y: 70, width: 156, height: 120 };

  assert.equal(
    metrics.boundsContain?.(
      outer,
      { x: 56, y: 76, width: 144, height: 108 },
      6
    ),
    true
  );
  assert.equal(
    metrics.boundsContain?.(
      outer,
      { x: 54, y: 76, width: 146, height: 108 },
      6
    ),
    false
  );
});

test("weighted overlap measures frame paint that competes with a glyph", () => {
  const glyph = { x: 70, y: 70, width: 100, height: 100 };
  const frameElements = [
    {
      bounds: { x: 20, y: 20, width: 216, height: 216 },
      opacity: 0.36,
      frameRole: "surface"
    },
    {
      bounds: { x: 80, y: 80, width: 20, height: 20 },
      opacity: 0.1,
      frameRole: "decor"
    }
  ];

  assert.equal(
    metrics.weightedOverlapRatio?.(glyph, frameElements),
    0.004
  );
});

test("circle separation reports visible gaps between semantic nodes", () => {
  assert.equal(
    metrics.circleGap?.(
      { x: 86, y: 111, radius: 16 },
      { x: 128, y: 91, radius: 22 }
    ),
    8.519
  );
  assert.ok(
    metrics.circleGap?.(
      { x: 90, y: 100, radius: 22 },
      { x: 128, y: 92, radius: 22 }
    ) < 0
  );
});
