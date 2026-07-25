import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("..", import.meta.url));
const assetDir = join(root, "assets");
const temporaryDir = join(root, "output", "brand-assets");
const packageJson = JSON.parse(
  await readFile(join(root, "package.json"), "utf8")
);
const siteLabel = packageJson.homepage
  .replace(/^https?:\/\//u, "")
  .replace(/\/$/u, "");
let browser;

const themeVariables = {
  "--usk-bg-rgb": "7 12 24",
  "--usk-surface-rgb": "18 26 44",
  "--usk-surface-strong-rgb": "29 39 63",
  "--usk-surface-soft-rgb": "24 33 54",
  "--usk-border-rgb": "90 108 142",
  "--usk-text-rgb": "244 247 255",
  "--usk-text-muted-rgb": "170 182 203",
  "--usk-primary-rgb": "74 194 255",
  "--usk-secondary-rgb": "167 120 255",
  "--usk-accent-rgb": "255 193 92",
  "--usk-success-rgb": "91 219 151",
  "--usk-warning-rgb": "255 203 91",
  "--usk-danger-rgb": "255 112 137"
};

const showcaseIcons = [
  ["minimal-saas", "dashboard", "Minimal SaaS"],
  ["bento", "grid", "Bento"],
  ["brutalism", "terminal", "Brutalism"],
  ["retro-glass", "layers", "Retro Glass"],
  ["y2k", "browser", "Y2K"],
  ["cyberpunk", "cpu", "Cyberpunk"],
  ["synthwave", "rocket", "Synthwave"],
  ["neumorphism", "settings", "Neumorphism"]
];

function findClosingParenthesis(value, start) {
  let depth = 1;

  for (let index = start + 4; index < value.length; index += 1) {
    if (value[index] === "(") {
      depth += 1;
    } else if (value[index] === ")") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function splitVariableExpression(value) {
  let depth = 0;

  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "(") {
      depth += 1;
    } else if (value[index] === ")") {
      depth -= 1;
    } else if (value[index] === "," && depth === 0) {
      return [value.slice(0, index).trim(), value.slice(index + 1).trim()];
    }
  }

  return [value.trim(), ""];
}

function resolveCssVariables(value) {
  const variables = { ...themeVariables };
  const declarationPattern = /(--[\w-]+)\s*:\s*([^;{}]+);/gu;

  for (const match of value.matchAll(declarationPattern)) {
    variables[match[1]] = match[2].trim();
  }

  let resolved = value;

  for (let pass = 0; pass < 1000 && resolved.includes("var("); pass += 1) {
    const start = resolved.lastIndexOf("var(");
    const end = findClosingParenthesis(resolved, start);

    if (end === -1) {
      throw new Error("Unbalanced CSS variable expression in SVG source.");
    }

    const [name, fallback] = splitVariableExpression(
      resolved.slice(start + 4, end)
    );
    const replacement = variables[name] || fallback || "currentColor";
    resolved = `${resolved.slice(0, start)}${replacement}${resolved.slice(end + 1)}`;
  }

  if (resolved.includes("var(")) {
    throw new Error("SVG source contains too many nested CSS variables.");
  }

  return resolved;
}

function normalizeRgbFunctions(value) {
  const channel = String.raw`([+-]?(?:\d*\.)?\d+)`;

  return value
    .replace(
      new RegExp(
        String.raw`rgb\(\s*${channel}\s+${channel}\s+${channel}\s*\/\s*${channel}\s*\)`,
        "g"
      ),
      "rgba($1,$2,$3,$4)"
    )
    .replace(
      new RegExp(
        String.raw`rgb\(\s*${channel}\s+${channel}\s+${channel}\s*\)`,
        "g"
      ),
      "rgb($1,$2,$3)"
    );
}

function flattenSvg(value) {
  return normalizeRgbFunctions(resolveCssVariables(value))
    .replace(
      /\.[\w-]+-icon,\s*\[data-[^\]]+\]\s*\{[\s\S]*?\}\s*/gu,
      ""
    )
    .replace(
      /\.[\w-]+-icon--(?:xs|sm|md|lg|xl)\s*\{[^}]*\}\s*/gu,
      ""
    )
    .replace(/<\?xml[^>]*>\s*/u, "")
    .replace(/<svg\b/u, '<svg color="#f4f7ff"');
}

function svgContents(value) {
  const match = value.match(/<svg\b[^>]*>([\s\S]*)<\/svg>/u);

  if (!match) {
    throw new Error("Expected an SVG root element.");
  }

  return match[1];
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildFaviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img" aria-labelledby="favicon-title favicon-desc">
  <title id="favicon-title">UI Style Kit Icons</title>
  <desc id="favicon-desc">A compact icon-grid mark for the UI Style Kit Icons library.</desc>
  <defs>
    <linearGradient id="usk-favicon-bg" x1="36" y1="30" x2="220" y2="226" gradientUnits="userSpaceOnUse">
      <stop stop-color="#17233a"/>
      <stop offset=".48" stop-color="#0b1020"/>
      <stop offset="1" stop-color="#070c18"/>
    </linearGradient>
    <linearGradient id="usk-favicon-glass" x1="57" y1="52" x2="202" y2="204" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f4f7ff" stop-opacity=".22"/>
      <stop offset=".42" stop-color="#f4f7ff" stop-opacity=".05"/>
      <stop offset="1" stop-color="#f4f7ff" stop-opacity=".12"/>
    </linearGradient>
  </defs>
  <rect x="17" y="17" width="222" height="222" rx="52" fill="url(#usk-favicon-bg)"/>
  <rect x="22" y="22" width="212" height="212" rx="47" fill="none" stroke="#263651" stroke-width="5"/>
  <path d="M45 50H182M50 45V182M206 75V208M75 206H210" fill="none" stroke="#4ac2ff" stroke-width="6" stroke-linecap="round" opacity=".3"/>
  <g>
    <rect x="48" y="48" width="74" height="74" rx="18" fill="#4ac2ff"/>
    <rect x="134" y="48" width="74" height="74" rx="18" fill="#a778ff"/>
    <rect x="48" y="134" width="74" height="74" rx="18" fill="#ffc15c"/>
    <rect x="134" y="134" width="74" height="74" rx="18" fill="#5bdb97"/>
    <rect x="59" y="59" width="52" height="52" rx="12" fill="#081226" opacity=".35"/>
    <rect x="145" y="59" width="52" height="52" rx="12" fill="#081226" opacity=".35"/>
    <rect x="59" y="145" width="52" height="52" rx="12" fill="#081226" opacity=".35"/>
    <rect x="145" y="145" width="52" height="52" rx="12" fill="#081226" opacity=".35"/>
  </g>
  <path d="M128 78L144 112L178 128L144 144L128 178L112 144L78 128L112 112Z" fill="#07101f" stroke="#f4f7ff" stroke-width="8" stroke-linejoin="round"/>
  <path d="M128 99L137 119L157 128L137 137L128 157L119 137L99 128L119 119Z" fill="#f4f7ff"/>
  <path d="M59 59C78 46 107 44 128 52" fill="none" stroke="url(#usk-favicon-glass)" stroke-width="9" stroke-linecap="round"/>
</svg>`;
}

async function renderSvg(source, output, width, height) {
  browser ??= await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1
  });

  try {
    await page.setContent(
      `<style>html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}</style>${source}`
    );
    const svg = page.locator("svg").first();

    await svg.evaluate(
      (element, size) => {
        element.setAttribute("width", String(size.width));
        element.setAttribute("height", String(size.height));
        element.style.display = "block";
      },
      { width, height }
    );
    await svg.screenshot({ path: output, omitBackground: true });
  } finally {
    await page.close();
  }
}

async function renderIco(inputFiles, output) {
  const images = await Promise.all(inputFiles.map((file) => readFile(file)));
  const header = Buffer.alloc(6 + images.length * 16);
  let offset = header.length;

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  for (const [index, image] of images.entries()) {
    const entryOffset = 6 + index * 16;
    const width = image.readUInt32BE(16);
    const height = image.readUInt32BE(20);

    // ICO supports PNG payloads; this keeps the generator dependency-free.
    header.writeUInt8(width >= 256 ? 0 : width, entryOffset);
    header.writeUInt8(height >= 256 ? 0 : height, entryOffset + 1);
    header.writeUInt8(0, entryOffset + 2);
    header.writeUInt8(0, entryOffset + 3);
    header.writeUInt16LE(1, entryOffset + 4);
    header.writeUInt16LE(32, entryOffset + 6);
    header.writeUInt32LE(image.length, entryOffset + 8);
    header.writeUInt32LE(offset, entryOffset + 12);
    offset += image.length;
  }

  await writeFile(output, Buffer.concat([header, ...images]));
}

try {
  const resolvedRoot = resolve(root);
  const resolvedTemporaryDir = resolve(temporaryDir);

  if (!resolvedTemporaryDir.startsWith(`${resolvedRoot}${sep}`)) {
    throw new Error(
      `Refusing to clear a brand-asset directory outside the repository: ${temporaryDir}`
    );
  }

  await rm(temporaryDir, { recursive: true, force: true });
  await mkdir(temporaryDir, { recursive: true });
  await mkdir(assetDir, { recursive: true });

  const favicon = buildFaviconSvg();
  const faviconPath = join(assetDir, "favicon.svg");

  await writeFile(faviconPath, favicon);
  await renderSvg(favicon, join(assetDir, "favicon-16x16.png"), 16, 16);
  await renderSvg(favicon, join(assetDir, "favicon-32x32.png"), 32, 32);
  await renderSvg(favicon, join(assetDir, "favicon-48x48.png"), 48, 48);
  await renderSvg(favicon, join(assetDir, "apple-touch-icon.png"), 180, 180);
  await renderSvg(favicon, join(assetDir, "icon-192.png"), 192, 192);
  await renderSvg(favicon, join(assetDir, "icon-512.png"), 512, 512);
  await renderIco(
    [
      join(assetDir, "favicon-16x16.png"),
      join(assetDir, "favicon-32x32.png"),
      join(assetDir, "favicon-48x48.png")
    ],
    join(assetDir, "favicon.ico")
  );

  const cards = [];

  for (const [pack, icon, label] of showcaseIcons) {
    const source = await readFile(
      join(root, "packs", pack, "icons", `${icon}.svg`),
      "utf8"
    );
    cards.push({
      label,
      source: svgContents(flattenSvg(source))
    });
  }

const cardMarkup = cards
  .map(({ label, source }, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const x = 64 + column * 269;
    const y = 190 + row * 170;

    return `
      <g transform="translate(${x} ${y})">
        <rect width="248" height="148" rx="12" fill="#121a2c" stroke="#5a6c8e" stroke-width="2"/>
        <path d="M1 112H247" stroke="#263651"/>
        <svg x="14" y="18" width="78" height="78" viewBox="0 0 256 256">${source}</svg>
        <text x="104" y="55" fill="#f4f7ff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="19" font-weight="700">${escapeXml(label)}</text>
        <text x="104" y="82" fill="#aab6cb" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="13">64 semantic icons</text>
        <circle cx="22" cy="130" r="5" fill="#4ac2ff"/>
        <circle cx="40" cy="130" r="5" fill="#a778ff"/>
        <circle cx="58" cy="130" r="5" fill="#ffc15c"/>
      </g>`;
  })
  .join("");

const logoSource = svgContents(favicon);
const socialCard = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#070c18"/>
  <path d="M0 152H1200M0 548H1200" stroke="#263651" stroke-width="2"/>
  <path d="M28 0V630M1172 0V630" stroke="#17233a"/>
  <g opacity=".34" stroke="#263651">
    <path d="M0 40H1200M0 80H1200M0 120H1200M0 588H1200"/>
    <path d="M160 0V152M400 0V152M640 0V152M880 0V152M1040 0V152"/>
  </g>
  <svg x="64" y="43" width="92" height="92" viewBox="0 0 256 256">${logoSource}</svg>
  <text x="180" y="82" fill="#f4f7ff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="48" font-weight="800">UI Style Kit Icons</text>
  <text x="182" y="119" fill="#aab6cb" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="21">One semantic API. Twelve visual systems. Theme-aware SVG.</text>
  <rect x="1008" y="57" width="128" height="48" rx="8" fill="#1d273f" stroke="#4ac2ff" stroke-width="2"/>
  <text x="1072" y="88" text-anchor="middle" fill="#4ac2ff" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="18" font-weight="700">v${escapeXml(packageJson.version)}</text>
  ${cardMarkup}
  <text x="64" y="594" fill="#aab6cb" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="18">Standalone-ready + aligned with UI Style Kit CSS</text>
  <text x="1136" y="594" text-anchor="end" fill="#4ac2ff" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="18">${escapeXml(siteLabel)}</text>
</svg>`;
  const socialCardSvgPath = join(temporaryDir, "social-card.svg");

  await writeFile(socialCardSvgPath, socialCard);
  await renderSvg(socialCard, join(assetDir, "social-card.png"), 1200, 630);

  console.log("Built favicon, app icons, and social preview assets.");
} finally {
  await browser?.close();
}
