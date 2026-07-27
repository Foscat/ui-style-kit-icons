// Removes legacy generated layers while leaving canonical authored SVG geometry
// and frame metadata untouched.
export function stripGeneratedArtifactLayers(source) {
  const svg = splitSvg(source);
  const spans = topLevelElementSpans(svg.body);
  let cursor = 0;
  let cleanBody = "";

  for (const span of spans) {
    const openingTag = svg.body.slice(span.start, span.openEnd);
    const generatedLayer =
      /\bdata-icon-artifact-underlay=/u.test(openingTag) ||
      /\bdata-icon-artifact-signature=/u.test(openingTag) ||
      (/\bdata-icon-artifact=/u.test(openingTag) &&
        !/\bdata-icon-artifact-base="(?:true|group)"/u.test(openingTag));
    const generatedBaseWrapper =
      /^<g\b/iu.test(openingTag) &&
      (/\bdata-icon-artifact="base"/u.test(openingTag) ||
        /\bdata-icon-artifact-base="group"/u.test(openingTag));

    cleanBody += svg.body.slice(cursor, span.start);

    if (generatedBaseWrapper) {
      cleanBody += outdent(
        svg.body.slice(span.openEnd, span.end - "</g>".length),
        "    "
      );
    } else if (!generatedLayer) {
      cleanBody += svg.body.slice(span.start, span.end);
    }

    cursor = span.end;
  }

  cleanBody += svg.body.slice(cursor);
  cleanBody = cleanBody.replace(
    /<([a-z][^>]*\bdata-icon-artifact-base="(?:true|group)"[^>]*?)>/giu,
    (openingTag) =>
      openingTag.replace(
        /\sdata-icon-artifact(?:-kind|-category|-base)?="[^"]*"/gu,
        ""
      )
  );

  return `${svg.prefix}${cleanBody}${svg.suffix}`;
}

function splitSvg(source) {
  const styleEnd = source.indexOf("</style>");
  const svgEnd = source.lastIndexOf("</svg>");

  if (styleEnd === -1 || svgEnd === -1 || svgEnd <= styleEnd) {
    throw new Error("SVG source normalization requires a complete styled SVG.");
  }

  const bodyStart = styleEnd + "</style>".length;

  return {
    prefix: source.slice(0, bodyStart),
    body: source.slice(bodyStart, svgEnd),
    suffix: source.slice(svgEnd)
  };
}

function topLevelElementSpans(source) {
  const tagPattern = /<!--[\s\S]*?-->|<\/?[a-z][^>]*>/giu;
  const spans = [];
  let depth = 0;
  let start = -1;
  let openEnd = -1;
  let match;

  while ((match = tagPattern.exec(source))) {
    const token = match[0];

    if (token.startsWith("<!--")) {
      continue;
    }

    const closing = token.startsWith("</");
    const selfClosing = /\/>\s*$/u.test(token);

    if (!closing) {
      if (depth === 0) {
        start = match.index;
        openEnd = tagPattern.lastIndex;
      }

      if (selfClosing) {
        if (depth === 0) {
          spans.push({ start, openEnd, end: tagPattern.lastIndex });
          start = -1;
          openEnd = -1;
        }
      } else {
        depth += 1;
      }

      continue;
    }

    depth -= 1;
    if (depth === 0 && start >= 0) {
      spans.push({ start, openEnd, end: tagPattern.lastIndex });
      start = -1;
      openEnd = -1;
    }
  }

  return spans;
}

function outdent(value, prefix) {
  return value
    .split("\n")
    .map((line) => (line.startsWith(prefix) ? line.slice(prefix.length) : line))
    .join("\n");
}
