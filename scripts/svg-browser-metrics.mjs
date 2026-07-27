export function collectRenderedIconMetrics(cardSelector = ".icon-card") {
  const geometrySelector =
    "path, rect, circle, ellipse, line, polyline, polygon, use";

  function parseColor(value) {
    const rgb = value?.match(/^rgba?\(([^)]+)\)$/iu);

    if (rgb) {
      const channels = rgb[1].split(/[ ,/]+/u).filter(Boolean).map(Number);

      return {
        r: channels[0],
        g: channels[1],
        b: channels[2],
        a: Number.isFinite(channels[3]) ? channels[3] : 1
      };
    }

    const srgb = value?.match(/^color\(srgb\s+([^)]*)\)$/iu);

    if (!srgb) {
      return null;
    }

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

  function blend(foreground, background) {
    const alpha = Math.max(0, Math.min(1, foreground.a));

    return {
      r: foreground.r * alpha + background.r * (1 - alpha),
      g: foreground.g * alpha + background.g * (1 - alpha),
      b: foreground.b * alpha + background.b * (1 - alpha),
      a: 1
    };
  }

  function opaqueBackground(element) {
    const layers = [
      document.documentElement,
      document.body,
      ...[...element.parentElement?.children ?? []].filter(
        (candidate) => candidate === element
      )
    ];
    let color = { r: 255, g: 255, b: 255, a: 1 };

    for (const layer of layers) {
      const next = parseColor(getComputedStyle(layer).backgroundColor);

      if (next && next.a > 0) {
        color = blend(next, color);
      }
    }

    return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
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

  function resolveGradient(svg, value) {
    const gradientId = value?.match(/url\((?:["']?[^#)]*#)([^)"']+)/iu)?.[1];

    if (!gradientId) {
      return null;
    }

    let gradient = svg.querySelector(`#${CSS.escape(gradientId)}`);
    const seen = new Set();
    const stops = [];

    while (gradient && !seen.has(gradient)) {
      seen.add(gradient);

      for (const stop of gradient.querySelectorAll(":scope > stop")) {
        const styles = getComputedStyle(stop);

        stops.push({
          color: styles.stopColor,
          opacity:
            Number.parseFloat(styles.stopOpacity || "1") *
            Number.parseFloat(styles.opacity || "1")
        });
      }

      if (stops.length > 0) {
        break;
      }

      const reference =
        gradient.getAttribute("href") ??
        gradient.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      const referenceId = reference?.match(/^#(.+)/u)?.[1];

      gradient = referenceId
        ? svg.querySelector(`#${CSS.escape(referenceId)}`)
        : null;
    }

    return stops.length > 0 ? stops : null;
  }

  function paintDescriptor(svg, value, opacity) {
    if (!value || value === "none") {
      return { type: "none" };
    }

    const stops = resolveGradient(svg, value);

    return stops
      ? { type: "gradient", opacity, stops }
      : { type: "solid", opacity, color: value };
  }

  function transformPoint(point, matrix) {
    return {
      x: matrix.a * point.x + matrix.c * point.y + matrix.e,
      y: matrix.b * point.x + matrix.d * point.y + matrix.f
    };
  }

  function representativePaintPoint(element, matrix, bounds, fill, stroke) {
    if (
      fill.type === "none" &&
      stroke.type !== "none" &&
      typeof element.getTotalLength === "function" &&
      typeof element.getPointAtLength === "function"
    ) {
      try {
        const length = element.getTotalLength();

        if (Number.isFinite(length) && length > 0) {
          return transformPoint(element.getPointAtLength(length * 0.125), matrix);
        }
      } catch {
        // Fall through to the stable bounds center for non-path geometry.
      }
    }

    return {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2
    };
  }

  function localBackgrounds(baseBackground, layers, targetBounds, targetPoint) {
    const targetCenter =
      targetPoint ??
      ({
        x: targetBounds.x + targetBounds.width / 2,
        y: targetBounds.y + targetBounds.height / 2
      });
    let colors = [parseColor(baseBackground)].filter(Boolean);

    for (const layer of layers) {
      if (
        !layer.rendered ||
        !layer.bounds ||
        layer.fill.type === "none" ||
        !layerCoversPoint(layer, targetCenter)
      ) {
        continue;
      }

      const samples =
        layer.fill.type === "gradient"
          ? layer.fill.stops
          : [{ color: layer.fill.color, opacity: 1 }];
      const nextColors = [];

      for (const background of colors) {
        for (const sample of samples) {
          const foreground = parseColor(sample.color);

          if (!foreground) {
            continue;
          }

          nextColors.push(
            blend(
              {
                ...foreground,
                a:
                  foreground.a *
                  layer.opacity *
                  (Number.isFinite(layer.fill.opacity)
                    ? layer.fill.opacity
                    : 1) *
                  (Number.isFinite(sample.opacity) ? sample.opacity : 1)
              },
              background
            )
          );
        }
      }

      if (nextColors.length > 0) {
        colors = nextColors
          .filter(
            (color, index, all) =>
              all.findIndex(
                (candidate) =>
                  Math.abs(candidate.r - color.r) < 1 &&
                  Math.abs(candidate.g - color.g) < 1 &&
                  Math.abs(candidate.b - color.b) < 1
              ) === index
          )
          .slice(0, 12);
      }
    }

    return colors.map(
      (color) =>
        `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`
    );
  }

  function layerCoversPoint(layer, point) {
    if (
      point.x < layer.bounds.x ||
      point.x > layer.bounds.x + layer.bounds.width ||
      point.y < layer.bounds.y ||
      point.y > layer.bounds.y + layer.bounds.height
    ) {
      return false;
    }

    if (typeof layer.element?.isPointInFill !== "function" || !layer.matrix) {
      return true;
    }

    const determinant =
      layer.matrix.a * layer.matrix.d - layer.matrix.b * layer.matrix.c;

    if (Math.abs(determinant) < Number.EPSILON) {
      return true;
    }

    const translatedX = point.x - layer.matrix.e;
    const translatedY = point.y - layer.matrix.f;
    const localPoint = new DOMPoint(
      (layer.matrix.d * translatedX - layer.matrix.c * translatedY) /
        determinant,
      (-layer.matrix.b * translatedX + layer.matrix.a * translatedY) /
        determinant
    );

    try {
      return layer.element.isPointInFill(localPoint);
    } catch {
      return true;
    }
  }

  function relativeMatrix(element, svg) {
    const svgMatrix = svg.getScreenCTM();
    const elementMatrix = element.getScreenCTM();

    if (!svgMatrix || !elementMatrix) {
      return null;
    }

    const matrix = svgMatrix.inverse().multiply(elementMatrix);

    return {
      a: matrix.a,
      b: matrix.b,
      c: matrix.c,
      d: matrix.d,
      e: matrix.e,
      f: matrix.f
    };
  }

  function transformBox(box, matrix, strokeWidth = 0) {
    if (!matrix) {
      return null;
    }

    const points = [
      new DOMPoint(box.x, box.y),
      new DOMPoint(box.x + box.width, box.y),
      new DOMPoint(box.x, box.y + box.height),
      new DOMPoint(box.x + box.width, box.y + box.height)
    ].map((point) => ({
      x: matrix.a * point.x + matrix.c * point.y + matrix.e,
      y: matrix.b * point.x + matrix.d * point.y + matrix.f
    }));
    const scaleX = Math.hypot(matrix.a, matrix.b);
    const scaleY = Math.hypot(matrix.c, matrix.d);
    const strokeInflation = (strokeWidth / 2) * Math.max(scaleX, scaleY);
    const left = Math.min(...points.map(({ x }) => x)) - strokeInflation;
    const top = Math.min(...points.map(({ y }) => y)) - strokeInflation;
    const right = Math.max(...points.map(({ x }) => x)) + strokeInflation;
    const bottom = Math.max(...points.map(({ y }) => y)) + strokeInflation;

    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    };
  }

  function unionBox(boxes) {
    const valid = boxes.filter(Boolean);

    if (valid.length === 0) {
      return null;
    }

    const left = Math.min(...valid.map((box) => box.x));
    const top = Math.min(...valid.map((box) => box.y));
    const right = Math.max(...valid.map((box) => box.x + box.width));
    const bottom = Math.max(...valid.map((box) => box.y + box.height));

    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    };
  }

  function filterRegion(element, svg) {
    const filterValue = getComputedStyle(element).filter;
    const filterId = filterValue?.match(/url\((?:["']?[^#)]*#)([^)"']+)/iu)?.[1];
    const filter = filterId
      ? svg.querySelector(`#${CSS.escape(filterId)}`)
      : null;

    if (!filter) {
      return null;
    }

    let box;

    try {
      box = element.getBBox();
    } catch {
      return null;
    }

    const objectBoundingBox = filter.getAttribute("filterUnits") !== "userSpaceOnUse";

    const viewBox = svg.viewBox.baseVal;

    function positionValue(name, fallback, origin, extent, viewportOrigin, viewportExtent) {
      const raw = filter.getAttribute(name) ?? fallback;
      const numeric = Number.parseFloat(raw);

      if (!Number.isFinite(numeric)) {
        return origin;
      }

      if (raw.endsWith("%")) {
        return objectBoundingBox
          ? origin + (numeric / 100) * extent
          : viewportOrigin + (numeric / 100) * viewportExtent;
      }

      return objectBoundingBox ? origin + numeric * extent : numeric;
    }

    function dimensionValue(name, fallback, extent, viewportExtent) {
      const raw = filter.getAttribute(name) ?? fallback;
      const numeric = Number.parseFloat(raw);

      if (!Number.isFinite(numeric)) {
        return extent;
      }

      if (raw.endsWith("%")) {
        return (
          (numeric / 100) * (objectBoundingBox ? extent : viewportExtent)
        );
      }

      return objectBoundingBox ? numeric * extent : numeric;
    }

    const x = positionValue(
      "x",
      "-10%",
      box.x,
      box.width,
      viewBox.x,
      viewBox.width
    );
    const y = positionValue(
      "y",
      "-10%",
      box.y,
      box.height,
      viewBox.y,
      viewBox.height
    );
    const width = dimensionValue("width", "120%", box.width, viewBox.width);
    const height = dimensionValue("height", "120%", box.height, viewBox.height);

    return transformBox(
      { x, y, width: Math.abs(width), height: Math.abs(height) },
      relativeMatrix(element, svg)
    );
  }

  function elementPaintsPoint(entry, point) {
    const { element, matrix, fill, stroke } = entry;

    if (
      !matrix ||
      (typeof element.isPointInFill !== "function" &&
        typeof element.isPointInStroke !== "function")
    ) {
      return false;
    }

    const determinant = matrix.a * matrix.d - matrix.b * matrix.c;

    if (Math.abs(determinant) < Number.EPSILON) {
      return false;
    }

    const translatedX = point.x - matrix.e;
    const translatedY = point.y - matrix.f;
    const localPoint = new DOMPoint(
      (matrix.d * translatedX - matrix.c * translatedY) / determinant,
      (-matrix.b * translatedX + matrix.a * translatedY) / determinant
    );

    try {
      return (
        (fill && element.isPointInFill(localPoint)) ||
        (stroke && element.isPointInStroke(localPoint))
      );
    } catch {
      return false;
    }
  }

  function sampledFrameGlyphOverlap(glyphEntries, decorEntries, glyphBox) {
    if (!glyphBox || glyphEntries.length === 0 || decorEntries.length === 0) {
      return 0;
    }

    const sampleStep = 2.5;
    let frameSamples = 0;
    let weightedOverlap = 0;

    for (const entry of decorEntries) {
      const points = [];
      const samplePaintedArea =
        entry.fill || (entry.stroke && entry.strokeWidth > sampleStep);

      if (
        entry.stroke &&
        !samplePaintedArea &&
        typeof entry.element.getTotalLength === "function" &&
        typeof entry.element.getPointAtLength === "function"
      ) {
        let length = 0;

        try {
          length = entry.element.getTotalLength();
        } catch {
          length = 0;
        }

        for (
          let distance = sampleStep / 2;
          distance < length;
          distance += sampleStep
        ) {
          const local = entry.element.getPointAtLength(distance);

          points.push({
            x:
              entry.matrix.a * local.x +
              entry.matrix.c * local.y +
              entry.matrix.e,
            y:
              entry.matrix.b * local.x +
              entry.matrix.d * local.y +
              entry.matrix.f
          });
        }
      }

      if (samplePaintedArea) {
        for (
          let y = entry.bounds.y + sampleStep / 2;
          y < entry.bounds.y + entry.bounds.height;
          y += sampleStep
        ) {
          for (
            let x = entry.bounds.x + sampleStep / 2;
            x < entry.bounds.x + entry.bounds.width;
            x += sampleStep
          ) {
            const point = { x, y };

            if (elementPaintsPoint(entry, point)) {
              points.push(point);
            }
          }
        }
      }

      for (const point of points) {
        frameSamples += 1;
        if (glyphEntries.some((glyph) => elementPaintsPoint(glyph, point))) {
          weightedOverlap += entry.opacity;
        }
      }
    }

    return frameSamples > 0 ? weightedOverlap / frameSamples : 0;
  }

  function elementLabel(element, index) {
    const semanticElement = element.closest("[data-icon-glyph='semantic']");
    const role =
      semanticElement?.getAttribute("data-icon-glyph") ??
      element.getAttribute("data-icon-video") ??
      element.getAttribute("data-icon-frame") ??
      element.getAttribute("data-icon-audit");

    return [
      element.localName,
      role ? `[${role}]` : "",
      element.id ? `#${element.id}` : "",
      element.getAttribute("class")
        ? `.${element.getAttribute("class").trim().replace(/\s+/gu, ".")}`
        : "",
      `:${index + 1}`
    ].join("");
  }

  return [...document.querySelectorAll(cardSelector)].map((card) => {
    const host = card.querySelector("usk-icon");
    const svg =
      host?.shadowRoot?.querySelector("svg") ??
      card.querySelector(":scope > svg, .rendered-icon > svg");

    if (!svg) {
      return {
        id: card.dataset.iconId,
        path: card.dataset.consumptionPath ?? "component",
        missing: true,
        elements: []
      };
    }

    const hostRect = (host ?? svg).getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const background = opaqueBackground(card);
    const artworkBoxes = [];
    const glyphBoxes = [];
    const frameBoxes = [];
    const filterBoxes = [];
    const semanticBoxes = [];
    const backgroundLayers = [];
    const partBoxes = new Map();
    const glyphGeometry = [];
    const decorGeometry = [];
    const elements = [];

    [...svg.querySelectorAll(geometrySelector)].forEach((element, index) => {
      if (element.closest("defs, clipPath, mask, marker, pattern, symbol")) {
        return;
      }

      const styles = getComputedStyle(element);
      const fillValue = element.localName === "line" ? "none" : styles.fill;
      const frameElement = element.closest("[data-icon-frame]");
      const frame = Boolean(frameElement);
      const frameRole = frameElement?.getAttribute("data-icon-frame") ?? null;
      const semanticElement = element.closest("[data-icon-glyph='semantic']");
      const semantic =
        semanticElement?.getAttribute("data-icon-glyph") ?? null;
      const prototype =
        semanticElement?.getAttribute("data-icon-prototype") ?? null;
      const part =
        element.closest("[data-icon-part]")?.getAttribute("data-icon-part") ??
        null;
      const auditRole =
        element.closest("[data-icon-audit]")?.getAttribute("data-icon-audit") ??
        null;
      const decorative =
        frame || auditRole === "decorative" || auditRole === "background";
      const opacity = inheritedOpacity(element, svg);
      let box;

      try {
        box = element.getBBox();
      } catch {
        return;
      }

      if (![box.x, box.y, box.width, box.height].every(Number.isFinite)) {
        return;
      }

      const matrix = relativeMatrix(element, svg);
      const strokeWidth =
        styles.stroke === "none"
          ? 0
          : Number.parseFloat(styles.strokeWidth) || 0;
      const transformed = transformBox(
        box,
        matrix,
        strokeWidth
      );
      const painted = fillValue !== "none" || styles.stroke !== "none";
      const rendered =
        painted &&
        styles.display !== "none" &&
        styles.visibility !== "hidden" &&
        opacity > 0.001;
      const record = {
        key: elementLabel(element, index),
        essential: !decorative,
        decorative,
        auditRole,
        frame,
        frameRole,
        semantic,
        prototype,
        part,
        painted,
        rendered,
        opacity,
        bounds: transformed,
        fill: paintDescriptor(
          svg,
          fillValue,
          Number.parseFloat(styles.fillOpacity)
        ),
        stroke: paintDescriptor(
          svg,
          styles.stroke,
          Number.parseFloat(styles.strokeOpacity)
        )
      };

      record.backgrounds = transformed
        ? localBackgrounds(
            background,
            backgroundLayers,
            transformed,
            representativePaintPoint(
              element,
              matrix,
              transformed,
              record.fill,
              record.stroke
            )
          )
        : [background];
      elements.push(record);
      if (rendered && transformed && record.fill.type !== "none") {
        backgroundLayers.push({
          element,
          matrix,
          rendered,
          bounds: transformed,
          fill: record.fill,
          opacity
        });
      }

      if (rendered && transformed) {
        const geometryEntry = {
          element,
          matrix,
          bounds: transformed,
          opacity,
          fill: fillValue !== "none",
          stroke: styles.stroke !== "none",
          strokeWidth:
            strokeWidth *
            Math.max(
              Math.hypot(matrix.a, matrix.b),
              Math.hypot(matrix.c, matrix.d)
            )
        };

        artworkBoxes.push(transformed);
        if (frame) {
          frameBoxes.push(transformed);
        }
        if (!decorative) {
          glyphBoxes.push(transformed);
          glyphGeometry.push(geometryEntry);
        }
        if (semantic) {
          semanticBoxes.push(transformed);
        }
        if (frameRole === "decor") {
          decorGeometry.push(geometryEntry);
        }
        if (part) {
          const boxes = partBoxes.get(part) ?? [];

          boxes.push(transformed);
          partBoxes.set(part, boxes);
        }
      }
    });

    for (const filtered of svg.querySelectorAll("[filter]")) {
      const region = filterRegion(filtered, svg);

      if (region) {
        filterBoxes.push(region);
      }
    }

    const artworkBox = unionBox(artworkBoxes);
    const glyphBox = unionBox(glyphBoxes);
    const frameBox = unionBox(frameBoxes);
    const semanticBox = unionBox(semanticBoxes);
    const filterBox = unionBox(filterBoxes);
    const renderedScale = Math.min(
      svgRect.width / viewBox.width,
      svgRect.height / viewBox.height
    );

    function overflow(box) {
      if (!box) {
        return 0;
      }

      return Math.max(
        0,
        viewBox.x - box.x,
        viewBox.y - box.y,
        box.x + box.width - (viewBox.x + viewBox.width),
        box.y + box.height - (viewBox.y + viewBox.height)
      );
    }

    return {
      id: card.dataset.iconId,
      path: card.dataset.consumptionPath ?? "component",
      missing: false,
      background,
      viewBox: {
        x: viewBox.x,
        y: viewBox.y,
        width: viewBox.width,
        height: viewBox.height
      },
      renderRatio:
        Math.min(svgRect.width / hostRect.width, svgRect.height / hostRect.height) || 0,
      svgWidth: svgRect.width,
      svgHeight: svgRect.height,
      glyphExtent: Math.max(glyphBox?.width ?? 0, glyphBox?.height ?? 0),
      glyphPixelExtent:
        Math.max(glyphBox?.width ?? 0, glyphBox?.height ?? 0) * renderedScale,
      artworkExtent: Math.max(artworkBox?.width ?? 0, artworkBox?.height ?? 0),
      artworkPixelExtent:
        Math.max(artworkBox?.width ?? 0, artworkBox?.height ?? 0) * renderedScale,
      overflow: overflow(artworkBox),
      filterOverflow: overflow(filterBox),
      centerOffsetX: glyphBox
        ? glyphBox.x + glyphBox.width / 2 - (viewBox.x + viewBox.width / 2)
        : 0,
      centerOffsetY: glyphBox
        ? glyphBox.y + glyphBox.height / 2 - (viewBox.y + viewBox.height / 2)
        : 0,
      edgeInset: artworkBox
        ? Math.min(
            artworkBox.x - viewBox.x,
            artworkBox.y - viewBox.y,
            viewBox.x + viewBox.width - (artworkBox.x + artworkBox.width),
            viewBox.y + viewBox.height - (artworkBox.y + artworkBox.height)
          )
        : 0,
      frameExtent: Math.max(frameBox?.width ?? 0, frameBox?.height ?? 0),
      semanticElementCount: elements.filter(
        ({ semantic, rendered }) => semantic && rendered
      ).length,
      semanticExtent: Math.max(
        semanticBox?.width ?? 0,
        semanticBox?.height ?? 0
      ),
      semanticPixelExtent:
        Math.max(semanticBox?.width ?? 0, semanticBox?.height ?? 0) *
        renderedScale,
      frameGlyphOverlap: sampledFrameGlyphOverlap(
        glyphGeometry,
        decorGeometry,
        glyphBox
      ),
      glyphBounds: glyphBox,
      parts: [...partBoxes].map(([name, boxes]) => ({
        name,
        bounds: unionBox(boxes)
      })),
      elements
    };
  });
}
