const STANDARD_CONTRAST = 3;
const ENHANCED_CONTRAST = 4.5;
const GRADIENT_STOP_COVERAGE = 0.75;

export function contrastThreshold(mode) {
  return mode === "contrast" ? ENHANCED_CONTRAST : STANDARD_CONTRAST;
}

export function analyzeElementPaint(element, { background, mode }) {
  const backgroundColor = parseCssColor(background);
  const threshold = contrastThreshold(mode);
  const elementOpacity = clampAlpha(element.opacity);
  const fill = analyzePaint(element.fill, backgroundColor, elementOpacity, threshold);
  const stroke = analyzePaint(element.stroke, backgroundColor, elementOpacity, threshold);
  const bestContrast = Math.max(fill.bestContrast, stroke.bestContrast);

  if (!element.essential) {
    return {
      passes: true,
      exempt: true,
      threshold,
      bestContrast,
      fillCoverage: fill.coverage,
      strokeCoverage: stroke.coverage
    };
  }

  return {
    passes: fill.passes || stroke.passes,
    exempt: false,
    threshold,
    bestContrast,
    fillCoverage: fill.coverage,
    strokeCoverage: stroke.coverage
  };
}

export function transformBounds(box, matrix, strokeWidth = 0) {
  const corners = [
    transformPoint(box.x, box.y, matrix),
    transformPoint(box.x + box.width, box.y, matrix),
    transformPoint(box.x, box.y + box.height, matrix),
    transformPoint(box.x + box.width, box.y + box.height, matrix)
  ];
  const scaleX = Math.hypot(matrix.a, matrix.b);
  const scaleY = Math.hypot(matrix.c, matrix.d);
  const strokeInflation = (Number(strokeWidth) / 2) * Math.max(scaleX, scaleY);
  const left = Math.min(...corners.map(({ x }) => x)) - strokeInflation;
  const top = Math.min(...corners.map(({ y }) => y)) - strokeInflation;
  const right = Math.max(...corners.map(({ x }) => x)) + strokeInflation;
  const bottom = Math.max(...corners.map(({ y }) => y)) + strokeInflation;

  return {
    x: normalizeNumber(left),
    y: normalizeNumber(top),
    width: normalizeNumber(right - left),
    height: normalizeNumber(bottom - top)
  };
}

export function boundsContain(outer, inner, inset = 0) {
  const requiredInset = Number(inset) || 0;

  return (
    inner.x >= outer.x + requiredInset &&
    inner.y >= outer.y + requiredInset &&
    inner.x + inner.width <= outer.x + outer.width - requiredInset &&
    inner.y + inner.height <= outer.y + outer.height - requiredInset
  );
}

export function weightedOverlapRatio(glyphBounds, frameElements) {
  const glyphArea = Math.max(0, glyphBounds.width) * Math.max(0, glyphBounds.height);

  if (glyphArea === 0) {
    return 0;
  }

  const weightedArea = frameElements
    .filter(({ frameRole }) => frameRole === "decor")
    .reduce(
      (total, element) =>
        total +
        intersectionArea(glyphBounds, element.bounds) *
          clampAlpha(element.opacity),
      0
    );

  return normalizeNumber(Math.min(1, weightedArea / glyphArea), 3);
}

export function circleGap(first, second) {
  return normalizeNumber(
    Math.hypot(first.x - second.x, first.y - second.y) -
      first.radius -
      second.radius,
    3
  );
}

function analyzePaint(paint, background, elementOpacity, threshold) {
  if (!paint || paint.type === "none") {
    return { passes: false, bestContrast: 1, coverage: 0 };
  }

  const samples =
    paint.type === "gradient"
      ? paint.stops ?? []
      : [{ color: paint.color, opacity: 1 }];
  const contrasts = samples
    .map((sample) => {
      const color = parseCssColor(sample.color);

      if (!color) {
        return null;
      }

      const alpha =
        color.a *
        elementOpacity *
        clampAlpha(paint.opacity) *
        clampAlpha(sample.opacity);
      const composited = blendColors({ ...color, a: alpha }, background);

      return contrastRatio(composited, background);
    })
    .filter(Number.isFinite);

  if (contrasts.length === 0) {
    return { passes: false, bestContrast: 1, coverage: 0 };
  }

  const passingSamples = contrasts.filter((value) => value >= threshold).length;
  const coverage = passingSamples / contrasts.length;

  return {
    passes:
      paint.type === "gradient"
        ? coverage >= GRADIENT_STOP_COVERAGE
        : passingSamples === contrasts.length,
    bestContrast: Math.max(...contrasts),
    coverage
  };
}

function parseCssColor(value) {
  if (typeof value !== "string" || value === "none" || value === "transparent") {
    return value === "transparent" ? { r: 0, g: 0, b: 0, a: 0 } : null;
  }

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
    const [channelsText, alphaText] = srgb[1]
      .split("/")
      .map((part) => part.trim());
    const channels = channelsText.split(/\s+/u).map(Number);
    const alpha = Number(alphaText);

    return {
      r: channels[0] * 255,
      g: channels[1] * 255,
      b: channels[2] * 255,
      a: Number.isFinite(alpha) ? alpha : 1
    };
  }

  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/iu);

  if (!hex) {
    return null;
  }

  const expanded =
    hex[1].length === 3
      ? [...hex[1]].map((character) => `${character}${character}`).join("")
      : hex[1];

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
    a:
      expanded.length === 8
        ? Number.parseInt(expanded.slice(6, 8), 16) / 255
        : 1
  };
}

function blendColors(foreground, background) {
  const alpha = clampAlpha(foreground.a);

  return {
    r: foreground.r * alpha + background.r * (1 - alpha),
    g: foreground.g * alpha + background.g * (1 - alpha),
    b: foreground.b * alpha + background.b * (1 - alpha),
    a: 1
  };
}

function contrastRatio(first, second) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  const light = Math.max(firstLuminance, secondLuminance);
  const dark = Math.min(firstLuminance, secondLuminance);

  return (light + 0.05) / (dark + 0.05);
}

function luminance(color) {
  return (
    0.2126 * linearChannel(color.r) +
    0.7152 * linearChannel(color.g) +
    0.0722 * linearChannel(color.b)
  );
}

function linearChannel(value) {
  const normalized = value / 255;

  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function transformPoint(x, y, matrix) {
  return {
    x: matrix.a * x + matrix.c * y + matrix.e,
    y: matrix.b * x + matrix.d * y + matrix.f
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

function clampAlpha(value) {
  const alpha = Number(value);

  return Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : 1;
}

function normalizeNumber(value, precision = 6) {
  return Number(value.toFixed(precision));
}
