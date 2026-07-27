#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { stripGeneratedArtifactLayers } from "./svg-source-normalization.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const registry = JSON.parse(
  await readFile(join(root, "dist", "registry.json"), "utf8")
);
const unifiedStyleExemplars = new Map([
  ["cyberpunk", "browser"],
  ["synthwave", "home"],
  ["synthwave-webapp", "browser"]
]);
const packRolePrefixes = new Map([
  ["cyberpunk", "cp"],
  ["synthwave", "sw"],
  ["synthwave-webapp", "sw"]
]);
const frameDecorationDefaults = new Map([
  ["retro-glass", ".18"],
  ["cyberpunk", ".26"],
  ["synthwave", ".22"],
  ["synthwave-webapp", ".18"]
]);
const fallbackColors = {
  primary: "37 99 235",
  secondary: "100 116 139",
  accent: "14 165 233",
  success: "22 163 74",
  warning: "202 138 4",
  danger: "220 38 38",
  "text-muted": "100 116 139",
  border: "100 116 139"
};
const paintRolePattern =
  /(\b(?:fill|stroke|stop-color)=")rgb\(var\(--usk-(primary|secondary|accent|success|warning|danger|text|text-muted|border)-rgb(?:,\s*([^)]+))?\)\)"/gu;
const frameDecorationNeedles = [
  '<path class="usk-i-line-2" d="M48 70H90M166 70H208M48 186H88M168 186H208"',
  '<path class="usk-i-muted" d="M50 212H118M138 212H154M170 212H206"',
  '<rect class="bi-bg-soft" x="48" y="52" width="68" height="48" rx="18"',
  '<rect class="bi-bg-soft" x="148" y="164" width="52" height="34" rx="14"',
  '<path class="bi-muted" d="M132 53H178M54 118H92M164 112H202"',
  '<path class="max-i-line-2" d="M46 198H92M152 198H204"',
  '<path class="max-i-line-3" d="M44 92L60 108M196 154L214 172"',
  '<path class="max-i-muted" d="M70 214H122M148 214H184"',
  '<path class="brutal-i-muted" d="M48 64H94M150 64H196M48 194H104M144 194H196"',
  '<path class="rg-i-bg-soft" d="M48 162C72 116 102 98 132 104C164 110 177 88 208 72V226H48Z"',
  '<path class="sw-i-line-3" d="M34 176H222M50 194H206M70 212H186"',
  '<path class="sw-i-muted" d="M24 232L104 154M232 232L152 154M63 232L116 154M193 232L140 154"',
  '<path d="M40 198H72M82 198H98M158 198H216"',
  '<path d="M40 208H126M138 208H152M166 208H216"',
  '<path d="M34 176H222M50 194H206M70 212H186"',
  '<path d="M24 232L104 154M232 232L152 154M63 232L116 154M193 232L140 154M100 232L124 154M156 232L132 154"',
  '<path d="M35 168H221M49 186H207M67 204H189"',
  '<path d="M30 232L104 156M226 232L152 156M62 232L114 156M194 232L142 156M96 232L123 156M160 232L133 156"',
  '<path d="M20 214H236"'
];
const decorativeClassPattern =
  /<(path|rect|circle|ellipse|line|polyline|polygon)(?![^>]*\bdata-icon-(?:frame|audit)=)([^>]*\bclass="[^"]*\b(?:tactile-i-(?:shadow|highlight|lowlight|inset)|neo-i-(?:highlight|lowlight|inset)|rg-i-(?:rim|sheen|gloss)|y2k-i-(?:shine|gloss))\b[^"]*"[^>]*)>/giu;
const cyberpunkGenericFrames = [
  '<rect data-icon-frame="decor" class="cp-i-surface" x="20" y="20" width="216" height="216" rx="26"/><path class="cp-i-muted" d="M36 76H92M164 76H220M36 184H86M174 184H220M76 36V68M184 36V56" opacity=".6"/><path class="cp-i-line-3" d="M42 216H104M152 216H214" opacity=".56"/>',
  '<rect data-icon-frame="decor" class="cp-i-surface" x="10" y="10" width="236" height="236" rx="26"/><path class="cp-i-muted" d="M36 76H92M164 76H220M36 184H86M174 184H220M76 36V68M184 36V56" opacity=".6"/><path class="cp-i-line-3" d="M42 216H104M152 216H214" opacity=".56"/>'
];
const cyberpunkAngularFrame =
  '<path data-icon-frame="surface" class="cp-i-surface" d="M42 20H214L236 42V214L214 236H42L20 214V42Z"/><path data-icon-frame="decor" class="cp-i-muted" d="M36 76H92M164 76H220M36 184H86M174 184H220M76 36V68M184 36V56" opacity=".6"/><path data-icon-frame="decor" class="cp-i-line-3" d="M42 216H104M152 216H214" opacity=".56"/>';
const cyberpunkHudFrame =
  '<path data-icon-frame="surface" class="cp-i-bg-strong" d="M42 20H214L236 42V214L214 236H42L20 214V42Z"/><g data-icon-frame="decor" opacity=".65"><path fill="none" d="M28 74H91M163 74H228M28 182H78M178 182H228M74 28V68M182 28V52M74 188V228M182 202V228" stroke="var(--cp-icon-primary, rgb(var(--usk-primary-rgb, 88 244 255)))" stroke-width="2"/><path fill="none" d="M22 102H68M188 102H236M42 204H103M151 204H214" stroke="var(--cp-icon-secondary, rgb(var(--usk-secondary-rgb, 255 46 159)))" stroke-width="2"/><path fill="none" d="M30 52H70M80 52H88M98 52H112M144 52H182M194 52H204M40 216H66M76 216H114M146 216H180M190 216H214" stroke="var(--cp-icon-muted, rgb(var(--usk-text-muted-rgb, 111 143 184)))" stroke-width="2"/></g><path data-icon-frame="surface" fill="none" d="M42 20H214L236 42V214L214 236H42L20 214V42Z" stroke="currentColor" stroke-width="4" opacity=".78"/><path data-icon-frame="decor" fill="none" d="M52 34H98M158 34H204M34 52V98M222 156V204M54 222H104M154 222H204" stroke="currentColor" stroke-width="3" opacity=".78"/>';
const cyberpunkLiteralRoles = new Map([
  ["#b8ff5c", "var(--cp-icon-success, #b8ff5c)"],
  ["#ff435e", "var(--cp-icon-danger, #ff435e)"]
]);
const synthwaveOversizedFrame =
  '<rect data-icon-frame="decor" class="sw-i-surface" x="10" y="10" width="236" height="236" rx="48"/>';
const synthwaveStandardFrame =
  '<rect data-icon-frame="surface" class="sw-i-surface" x="18" y="18" width="220" height="220" rx="48"/>';
const y2kGlossStyle =
  ".y2k-i-gloss{fill:var(--y2k-icon-gloss,rgb(255 255 255/.78));stroke:none}";
const y2kShineStyle =
  ".y2k-i-shine{fill:none;stroke:var(--y2k-icon-gloss,rgb(255 255 255/.78));stroke-width:7;stroke-linecap:round}";
const y2kGlossBubble =
  '<ellipse data-icon-frame="decor" class="y2k-i-gloss" cx="96" cy="62" rx="50" ry="14" opacity=".72"/>';
const y2kEdgeShine =
  '<path data-icon-frame="decor" data-icon-audit="decorative" class="y2k-i-shine" fill="none" d="M48 78C54 58 68 46 88 42H102" opacity=".58"/>';
const folderTabHighlightMigrations = new Map([
  [
    "y2k",
    {
      legacy:
        '<ellipse data-icon-audit="decorative" class="y2k-i-gloss" cx="112" cy="96" rx="34" ry="8"/>',
      replacement:
        '<path data-icon-audit="decorative" class="y2k-i-line-3" d="M70 98H102L112 108" opacity=".72"/>'
    }
  ],
  [
    "retro-glass",
    {
      legacy:
        '<ellipse data-icon-audit="decorative" class="rg-i-gloss" cx="112" cy="98" rx="35" ry="8"/>',
      replacement:
        '<path data-icon-audit="decorative" class="rg-i-rim" d="M70 100H102L112 109" opacity=".72"/>'
    }
  ]
]);
const styleByPack = new Map();

for (const [packId, iconId] of unifiedStyleExemplars) {
  const pack = registry.packs.find(({ id }) => id === packId);
  const record = pack?.coreIcons.find(({ id }) => id === iconId);

  if (!pack || !record) {
    throw new Error(`Unable to locate the ${packId}/${iconId} style exemplar.`);
  }

  const source = await readFile(
    join(root, pack.sourcePath, record.file),
    "utf8"
  );
  const style = source.match(/<style\b[^>]*>[\s\S]*?<\/style>/iu)?.[0];

  if (!style) {
    throw new Error(`The ${packId}/${iconId} exemplar has no style block.`);
  }

  styleByPack.set(packId, style);
}

let changedFiles = 0;
let normalizedViewBoxes = 0;
let unifiedStyles = 0;
let migratedPaints = 0;
let removedFixedGlowTints = 0;
let markedFrameDecorations = 0;
let restyledCoreIcons = 0;
let markedAuditDecorations = 0;
let explicitOpenPathFills = 0;
let restyledY2kFrames = 0;
let restyledFolderHighlights = 0;
let refinedFrameHierarchy = 0;
let removedGeneratedArtifactLayers = 0;

for (const pack of registry.packs) {
  const coreIds = new Set(pack.coreIcons.map(({ id }) => id));

  for (const record of [...pack.coreIcons, ...pack.optionalIcons]) {
    const path = join(root, pack.sourcePath, record.file);
    const original = await readFile(path, "utf8");
    let source = stripGeneratedArtifactLayers(original);

    if (source !== original) {
      removedGeneratedArtifactLayers += 1;
    }

    source = source.replace(
      /(<svg\b[^>]*\bviewBox=")-8 -8 272 272(")/u,
      (...match) => {
        normalizedViewBoxes += 1;
        return `${match[1]}0 0 256 256${match[2]}`;
      }
    );
    source = markFrameDecorations(source);
    source = markAuditDecorations(source);
    source = addExplicitOpenPathFills(source);

    if (coreIds.has(record.id) && styleByPack.has(pack.id)) {
      const nextStyle = styleByPack.get(pack.id);
      const currentStyle = source.match(
        /<style\b[^>]*>[\s\S]*?<\/style>/iu
      )?.[0];

      if (currentStyle && currentStyle !== nextStyle) {
        source = source.replace(currentStyle, nextStyle);
        unifiedStyles += 1;
      }
    }

    source = applyFrameDecorationDefault(source, pack.id);

    if (pack.id === "cyberpunk") {
      for (const legacyFrame of cyberpunkGenericFrames) {
        if (source.includes(legacyFrame)) {
          source = source.replace(legacyFrame, cyberpunkAngularFrame);
          restyledCoreIcons += 1;
        }
      }

      if (source.includes(cyberpunkAngularFrame)) {
        source = source.replace(cyberpunkAngularFrame, cyberpunkHudFrame);
        restyledCoreIcons += 1;
      }

      // Fixed neon literals bypass the ecosystem's mode-aware role bridge.
      for (const [literal, role] of cyberpunkLiteralRoles) {
        source = source.replaceAll(`fill="${literal}"`, `fill="${role}"`);
        source = source.replaceAll(`stroke="${literal}"`, `stroke="${role}"`);
      }
    }

    if (pack.id === "synthwave") {
      if (source.includes(synthwaveOversizedFrame)) {
        source = source.replace(
          synthwaveOversizedFrame,
          synthwaveStandardFrame
        );
        restyledCoreIcons += 1;
      }

      if (!coreIds.has(record.id)) {
        const nextSource = source.replace(
          /<circle cx="128" cy="100" r="58" fill="url\(#([-\w]+)-sun\)" opacity="\.95"\/>/u,
          '<g data-icon-frame="decor"><circle cx="128" cy="100" r="58" fill="url(#$1-sun)" opacity=".24"/></g>'
        );

        if (nextSource !== source) {
          source = nextSource;
          markedFrameDecorations += 1;
        }
      }

      if (record.id === "headphones") {
        source = source.replace(
          '<path data-icon-frame="decor" d="M70 142C70 91 96 63 128 63C160 63 186 91 186 142"',
          '<path d="M70 142C70 91 96 63 128 63C160 63 186 91 186 142"'
        );
      }
    }

    if (pack.id === "synthwave-webapp") {
      const oversizedFramePart =
        'x="10" y="10" width="236" height="236" rx="48"';
      const standardFramePart =
        'x="18" y="18" width="220" height="220" rx="48"';
      const nextSource = source.replaceAll(
        oversizedFramePart,
        standardFramePart
      );

      if (nextSource !== source) {
        source = nextSource;
        restyledCoreIcons += 1;
      }
    }

    if (pack.id === "y2k" && source.includes(y2kGlossBubble)) {
      /*
       * The old filled ellipse appeared as a detached gray pill on dark
       * surfaces. A contour-following stroke keeps the intended plastic
       * highlight visually attached to the Y2K frame.
       */
      source = source
        .replace(y2kGlossStyle, `${y2kGlossStyle}\n${y2kShineStyle}`)
        .replace(y2kGlossBubble, y2kEdgeShine);
      restyledY2kFrames += 1;
    }

    const folderHighlight = folderTabHighlightMigrations.get(pack.id);
    if (
      record.id === "folder" &&
      folderHighlight &&
      source.includes(folderHighlight.legacy)
    ) {
      /*
       * A shallow filled oval reads as a gray smudge in dark and contrast
       * modes. The replacement follows the folder tab and uses each pack's
       * established line-highlight language.
       */
      source = source.replace(
        folderHighlight.legacy,
        folderHighlight.replacement
      );
      restyledFolderHighlights += 1;
    }

    const rolePrefix = packRolePrefixes.get(pack.id);
    if (rolePrefix) {
      source = migrateArtworkPaint(source, rolePrefix);
      source = source.replace(/\s*<feColorMatrix\b[^>]*\/>/giu, () => {
        removedFixedGlowTints += 1;
        return "";
      });
    }

    source = simplifyScenicFrames(source, pack.id);
    source = markFrameSurfaces(source);
    source = stripTrailingWhitespace(source);

    if (source !== original) {
      await writeFile(path, source, "utf8");
      changedFiles += 1;
    }
  }
}

console.log(
  [
    `Refined ${changedFiles} authored SVG files.`,
    `${normalizedViewBoxes} viewBoxes normalized.`,
    `${unifiedStyles} core style blocks unified.`,
    `${migratedPaints} paint roles migrated.`,
    `${removedFixedGlowTints} fixed glow tints removed.`,
    `${markedFrameDecorations} frame decorations marked.`,
    `${restyledCoreIcons} core icons restyled.`,
    `${restyledY2kFrames} Y2K frame highlights restyled.`,
    `${restyledFolderHighlights} folder tab highlights restyled.`,
    `${removedGeneratedArtifactLayers} generated artifact layers removed.`,
    `${refinedFrameHierarchy} frame layers refined.`,
    `${markedAuditDecorations} audit decorations marked.`,
    `${explicitOpenPathFills} open stroked paths made fill-free.`
  ].join(" ")
);

function applyFrameDecorationDefault(source, packId) {
  const opacity = frameDecorationDefaults.get(packId);

  if (!opacity) {
    return source;
  }

  return source.replace(
    /\[data-icon-frame="decor"\]\{opacity:var\(--usk-icon-frame-decor-opacity,var\(--usk-icon-frame-opacity,1\)\)\}/u,
    `[data-icon-frame="decor"]{opacity:var(--usk-icon-frame-decor-opacity,${opacity})}`
  );
}

function simplifyScenicFrames(source, packId) {
  let result = source;

  if (packId === "system") {
    result = result.replaceAll(
      '<path data-icon-frame="decor" class="usk-i-line-2" d="M48 70H90M166 70H208M48 186H88M168 186H208" opacity=".62"/>',
      '<path data-icon-frame="decor" class="usk-i-line-2" d="M48 52H82M174 52H208" opacity=".62"/>'
    );
    result = result.replaceAll(
      '<path data-icon-frame="decor" class="usk-i-muted" d="M50 212H118M138 212H154M170 212H206" opacity=".7"/>',
      '<path data-icon-frame="decor" class="usk-i-muted" d="M50 212H104M152 212H206" opacity=".7"/>'
    );
  }

  if (packId === "minimal-saas") {
    result = result.replaceAll(
      '<path data-icon-frame="decor" class="saas-i-muted" d="M58 74H92M164 74H198M58 184H96M160 184H198" opacity=".42"/>',
      '<path data-icon-frame="decor" class="saas-i-muted" d="M58 52H88M168 52H198" opacity=".42"/>'
    );
    result = result.replaceAll(
      '<path data-icon-frame="decor" class="saas-i-muted" d="M68 206H116M140 206H188" opacity=".38"/>',
      '<path data-icon-frame="decor" class="saas-i-muted" d="M68 216H108M148 216H188" opacity=".38"/>'
    );
  }

  if (packId === "bento") {
    result = result
      .replaceAll(
        '<rect data-icon-frame="decor" class="bi-bg-soft" x="48" y="52" width="68" height="48" rx="18" opacity=".88"/>',
        ""
      )
      .replaceAll(
        '<rect data-icon-frame="decor" class="bi-bg-soft" x="148" y="164" width="52" height="34" rx="14" opacity=".74"/>',
        ""
      )
      .replaceAll(
        '<path data-icon-frame="decor" class="bi-muted" d="M132 53H178M54 118H92M164 112H202" opacity=".42"/>',
        '<path data-icon-frame="decor" class="bi-muted" d="M48 52H84M172 52H208M52 210H98M158 210H204" opacity=".42"/>'
      );
  }

  if (packId === "maximalist") {
    result = result
      .replaceAll(
        '<circle data-icon-frame="decor" class="max-i-confetti" cx="58" cy="70" r="9"/>',
        '<circle data-icon-frame="decor" class="max-i-confetti" cx="48" cy="48" r="7"/>'
      )
      .replaceAll(
        '<rect data-icon-frame="decor" class="max-i-pop" x="169" y="49" width="29" height="18" rx="9" transform="rotate(12 184 58)"/>',
        '<rect data-icon-frame="decor" class="max-i-pop" x="184" y="196" width="24" height="14" rx="7" transform="rotate(12 196 203)"/>'
      )
      .replaceAll(
        '<path data-icon-frame="decor" class="max-i-line-2" d="M46 198H92M152 198H204" opacity=".7"/>',
        '<path data-icon-frame="decor" class="max-i-line-2" d="M46 204H86M166 204H204" opacity=".7"/>'
      )
      .replaceAll(
        '<path data-icon-frame="decor" class="max-i-line-3" d="M44 92L60 108M196 154L214 172" opacity=".76"/>',
        ""
      );
  }

  if (packId === "brutalism") {
    result = result.replaceAll(
      '<path data-icon-frame="decor" class="brutal-i-muted" d="M48 64H94M150 64H196M48 194H104M144 194H196"/>',
      '<path data-icon-frame="decor" class="brutal-i-muted" d="M48 52H84M160 52H196M48 204H88M156 204H196"/>'
    );
  }

  if (packId === "tactile") {
    result = result
      .replaceAll(
        '<path data-icon-frame="decor" class="tactile-i-highlight" d="M54 45H175M45 56V138" opacity=".82"/>',
        '<path data-icon-frame="decor" class="tactile-i-highlight" d="M54 45H104M45 56V92" opacity=".82"/>'
      )
      .replaceAll(
        '<path data-icon-frame="decor" class="tactile-i-lowlight" d="M82 210H198M211 86V178" opacity=".74"/>',
        '<path data-icon-frame="decor" class="tactile-i-lowlight" d="M152 210H198M211 194V208" opacity=".74"/>'
      )
      .replaceAll(
        '<path data-icon-frame="decor" class="tactile-i-lowlight" d="M152 210H198M211 164V178" opacity=".74"/>',
        '<path data-icon-frame="decor" class="tactile-i-lowlight" d="M152 210H198M211 194V208" opacity=".74"/>'
      )
      .replaceAll(
        '<path data-icon-frame="decor" class="tactile-i-inset" d="M48 68H92M164 68H208" opacity=".72"/>',
        '<path data-icon-frame="decor" class="tactile-i-inset" d="M48 52H84M172 52H208" opacity=".72"/>'
      )
      .replaceAll(
        '<path data-icon-frame="decor" class="tactile-i-lowlight" d="M52 190H100M158 190H204" opacity=".58"/>',
        '<path data-icon-frame="decor" class="tactile-i-lowlight" d="M52 204H92M164 204H204" opacity=".58"/>'
      );
  }

  if (packId === "neumorphism") {
    result = result
      .replaceAll(
        '<path data-icon-frame="decor" class="neo-i-highlight" d="M56 50H166M50 58V132" opacity=".76"/>',
        '<path data-icon-frame="decor" class="neo-i-highlight" d="M56 50H104M50 58V94" opacity=".76"/>'
      )
      .replaceAll(
        '<path data-icon-frame="decor" class="neo-i-lowlight" d="M90 210H194M210 92V174" opacity=".68"/>',
        '<path data-icon-frame="decor" class="neo-i-lowlight" d="M154 210H194M210 164V174" opacity=".68"/>'
      )
      .replaceAll(
        '<path data-icon-frame="decor" class="neo-i-inset" d="M50 72H94M162 72H206" opacity=".68"/>',
        '<path data-icon-frame="decor" class="neo-i-inset" d="M50 52H84M172 52H206" opacity=".68"/>'
      )
      .replaceAll(
        '<path data-icon-frame="decor" class="neo-i-lowlight" d="M54 188H100M156 188H202" opacity=".48"/>',
        '<path data-icon-frame="decor" class="neo-i-lowlight" d="M54 204H94M162 204H202" opacity=".48"/>'
      );
  }

  if (packId === "retro-glass") {
    result = result.replace(
      /<path data-icon-frame="surface" class="rg-i-bg-soft" d="M48 162C72 116 102 98 132 104C164 110 177 88 208 72V226H48Z" opacity="\.72"\/>/gu,
      ""
    );
  }

  if (packId === "y2k") {
    result = result.replaceAll(
      '<path data-icon-frame="decor" data-icon-audit="decorative" class="y2k-i-shine" fill="none" d="M48 78C54 56 72 43 95 40H126" opacity=".58"/>',
      y2kEdgeShine
    );
  }

  if (packId === "cyberpunk") {
    result = result
      .replaceAll(
        "M28 74H91M163 74H228M28 182H78M178 182H228M74 28V68M182 28V52M74 188V228M182 202V228",
        "M28 74H60M196 74H228M28 182H60M196 182H228M74 28V56M182 28V56M74 200V228M182 200V228"
      )
      .replaceAll(
        "M22 102H68M188 102H236M42 204H103M151 204H214",
        "M22 102H48M208 102H236M42 218H88M168 218H214"
      );
    result = result.replace(
      /<path fill="none" data-icon-frame="decor" d="M36 224L224 36M70 228L228 70"[^>]*\/>/gu,
      ""
    );
    result = result.replace(
      /<path data-icon-frame="decor" fill="none" d="M36 224L224 36M70 228L228 70"[^>]*\/>/gu,
      ""
    );
  }

  if (["synthwave", "synthwave-webapp"].includes(packId)) {
    result = result.replace(
      /<g data-icon-frame="decor" class="sw-i-horizon-sun"[\s\S]*?<\/g>/gu,
      ""
    );
    result = result.replace(
      /<path(?: fill="none")? data-icon-frame="decor" d="M(?:24|30) 232L104 (?:154|156)[^"]*"[^>]*\/>/gu,
      ""
    );
    result = result.replace(
      /<path data-icon-frame="decor" class="sw-i-muted" d="M24 232L104 154[^"]*"[^>]*\/>/gu,
      ""
    );
    result = result.replace(
      /<path(?: fill="none")? data-icon-frame="decor" d="M(?:34 176H222M50 194H206M70 212H186|35 168H221M49 186H207M67 204H189)"[^>]*\/>/gu,
      '<path data-icon-frame="decor" class="sw-i-line-3" d="M48 204H208M76 218H180" opacity=".72"/>'
    );
    result = result.replace(
      /<path data-icon-frame="decor" class="sw-i-line-3" d="M34 176H222M50 194H206M70 212H186"[^>]*\/>/gu,
      '<path data-icon-frame="decor" class="sw-i-line-3" d="M48 204H208M76 218H180" opacity=".72"/>'
    );
  }

  if (packId === "synthwave-webapp") {
    result = result
      .replace(
        /(<rect data-icon-frame="surface" x="18" y="18" width="220" height="220" rx="48" fill="none") stroke="url\(#video-neon\)"/u,
        '$1 stroke="var(--usk-icon-contrast-keyline, currentColor)"'
      )
      .replace(
        /(<rect data-icon-frame="surface" x="18" y="18" width="220" height="220" rx="48" fill="none") stroke="currentColor"/u,
        '$1 stroke="var(--usk-icon-contrast-keyline, currentColor)"'
      );
  }

  if (result !== source) {
    refinedFrameHierarchy += 1;
  }

  return result;
}

function markFrameSurfaces(source) {
  return source.replace(
    /<(path|rect|circle|ellipse)\b[^>]*\bdata-icon-frame="decor"[^>]*>/gu,
    (element) => {
      const className = element.match(/\bclass="([^"]+)"/u)?.[1] ?? "";
      const isLargeRect =
        element.startsWith("<rect") &&
        Number(element.match(/\bwidth="([^"]+)"/u)?.[1]) >= 180 &&
        Number(element.match(/\bheight="([^"]+)"/u)?.[1]) >= 180;
      const isOuterPath =
        /d="M42 (?:18|20)H214L(?:238|236) 42V214L214 (?:238|236)H42L(?:18|20) 214V42Z"/u.test(
          element
        );
      const isSurfaceClass =
        /(?:-surface|-shadow(?:-light|-dark)?|-bg-strong)\b/u.test(
          className
        ) ||
        className === "brutal-i-primary" ||
        className === "rg-i-bg-soft";
      const isBackgroundGradient = /\bfill="url\(#[^"]+-bg\)"/u.test(element);

      if (
        !isLargeRect &&
        !isOuterPath &&
        !isSurfaceClass &&
        !isBackgroundGradient
      ) {
        return element;
      }

      refinedFrameHierarchy += 1;
      return element.replace(
        'data-icon-frame="decor"',
        'data-icon-frame="surface"'
      );
    }
  );
}

function markFrameDecorations(source) {
  let result = source;

  for (const needle of frameDecorationNeedles) {
    if (!result.includes(needle)) {
      continue;
    }

    const replacement = needle.replace(
      /^<(path|rect) /u,
      '<$1 data-icon-frame="decor" '
    );

    result = result.replaceAll(needle, replacement);
    markedFrameDecorations += 1;
  }

  return result;
}

function markAuditDecorations(source) {
  return source.replace(
    decorativeClassPattern,
    (match, elementName, attributes) => {
      markedAuditDecorations += 1;
      return `<${elementName} data-icon-audit="decorative"${attributes}>`;
    }
  );
}

function addExplicitOpenPathFills(source) {
  return source.replace(/<path\b([^>]*)>/gu, (match, attributes) => {
    const pathData = attributes.match(/\bd="([^"]*)"/u)?.[1];

    if (
      !pathData ||
      /[zZ]/u.test(pathData) ||
      !/\bstroke="/u.test(attributes) ||
      /\bfill="/u.test(attributes)
    ) {
      return match;
    }

    explicitOpenPathFills += 1;
    return `<path fill="none"${attributes}>`;
  });
}

function stripTrailingWhitespace(source) {
  return source.replace(/[ \t]+(?=\r?$)/gmu, "");
}

function migrateArtworkPaint(source, prefix) {
  const styleMatch = source.match(/<style\b[^>]*>[\s\S]*?<\/style>/iu);

  if (!styleMatch || styleMatch.index === undefined) {
    return replacePaintRoles(source, prefix);
  }

  const before = source.slice(0, styleMatch.index);
  const afterStyleIndex = styleMatch.index + styleMatch[0].length;
  const after = source.slice(afterStyleIndex);

  return [
    replacePaintRoles(before, prefix),
    styleMatch[0],
    replacePaintRoles(after, prefix)
  ].join("");
}

function replacePaintRoles(source, prefix) {
  return source.replace(
    paintRolePattern,
    (match, attribute, role, fallback = fallbackColors[role]) => {
      migratedPaints += 1;

      if (role === "text") {
        return `${attribute}currentColor"`;
      }

      const token = role === "text-muted" ? "muted" : role;

      return `${attribute}var(--${prefix}-icon-${token}, rgb(var(--usk-${role}-rgb, ${fallback})))"`;
    }
  );
}
