import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const registry = JSON.parse(
  await readFile(join(root, "dist", "registry.json"), "utf8")
);
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

test("reference-led prototype icons keep canonical semantic artwork", async () => {
  for (const pack of registry.packs) {
    for (const iconId of prototypeIds) {
      const source = await readPrototype(pack, iconId);
      const semantic = semanticGroup(source, pack.id, iconId);

      assert.doesNotMatch(
        semantic,
        /\bdata-icon-frame=/u,
        `${pack.id}/${iconId} keeps essential artwork outside its frame`
      );
      assert.ok(
        geometryElements(semantic).length >= 2,
        `${pack.id}/${iconId} has a complete authored semantic object`
      );
    }
  }
});

test("each prototype semantic uses visibly distinct geometry across packs", async () => {
  for (const iconId of prototypeIds) {
    const fingerprints = new Map();

    for (const pack of registry.packs) {
      const source = await readPrototype(pack, iconId);
      const fingerprint = geometryFingerprint(
        semanticGroup(source, pack.id, iconId)
      );
      const duplicate = fingerprints.get(fingerprint);

      assert.equal(
        duplicate,
        undefined,
        `${pack.id}/${iconId} must not reuse ${duplicate}/${iconId} geometry`
      );
      fingerprints.set(fingerprint, pack.id);
    }
  }
});

test("prototype artwork follows each pack construction grammar", async () => {
  for (const pack of registry.packs) {
    for (const iconId of prototypeIds) {
      const source = await readPrototype(pack, iconId);
      const semantic = semanticGroup(source, pack.id, iconId);

      assertPackGrammar(pack.id, iconId, semantic);
    }
  }
});

test("visual audit exposes a paired reference-led prototype matrix", async () => {
  const fixture = await readFile(
    join(root, "tests", "fixtures", "svg-visual-audit.html"),
    "utf8"
  );

  assert.match(fixture, /"prototype"/u);
  assert.match(fixture, /"prototype-pack"/u);
  assert.match(fixture, /Reference-led prototype/u);
  for (const iconId of prototypeIds) {
    assert.match(fixture, new RegExp(`"${iconId}"`, "u"));
  }
  assert.match(fixture, /"Border"/u);
  assert.match(fixture, /"No border"/u);
});

test("attached material effects are explicitly decorative", async () => {
  const effectClasses = new Map([
    ["tactile", /tactile-i-(?:shadow|highlight|lowlight|inset)/u],
    ["neumorphism", /neo-i-(?:highlight|lowlight|inset)/u],
    ["retro-glass", /rg-i-(?:rim|sheen|gloss)/u],
    ["y2k", /y2k-i-(?:shine|gloss)/u]
  ]);

  for (const pack of registry.packs) {
    const effectClass = effectClasses.get(pack.id);

    if (!effectClass) {
      continue;
    }

    for (const iconId of prototypeIds) {
      const source = await readPrototype(pack, iconId);
      const semantic = semanticGroup(source, pack.id, iconId);
      const effects = geometryElements(semantic).filter((element) =>
        effectClass.test(element)
      );

      assert.ok(effects.length > 0, `${pack.id}/${iconId} has attached effects`);
      for (const effect of effects) {
        assert.match(
          effect,
          /\bdata-icon-audit="decorative"/u,
          `${pack.id}/${iconId} marks its material-only effect decorative`
        );
      }
    }
  }
});

async function readPrototype(pack, iconId) {
  return readFile(
    join(root, pack.sourcePath, "icons", `${iconId}.svg`),
    "utf8"
  );
}

function semanticGroup(source, packId, iconId) {
  const openingTags = [
    ...source.matchAll(
      /<g\b(?=[^>]*\bdata-icon-glyph="semantic")(?=[^>]*\bdata-icon-prototype="reference-led-v1")[^>]*>/gu
    )
  ];
  const match = source.match(
    /<g\b(?=[^>]*\bdata-icon-glyph="semantic")(?=[^>]*\bdata-icon-prototype="reference-led-v1")[^>]*>([\s\S]*?)<\/g>/u
  );

  assert.equal(
    openingTags.length,
    1,
    `${packId}/${iconId} has one approved prototype body`
  );
  assert.ok(match, `${packId}/${iconId} identifies its approved prototype body`);
  assert.doesNotMatch(
    match[1],
    /<g\b/u,
    `${packId}/${iconId} keeps its semantic prototype group flat`
  );
  return match[0];
}

function geometryElements(source) {
  return [
    ...source.matchAll(
      /<(?:path|rect|circle|ellipse|line|polyline|polygon)\b[^>]*\/?>/gu
    )
  ].map(([element]) => element);
}

function geometryFingerprint(source) {
  return geometryElements(source)
    .map((element) =>
      element
        .replace(
          /\s(?:class|data-[\w-]+|fill|stroke|opacity|filter|id)="[^"]*"/gu,
          ""
        )
        .replace(/\s+/gu, " ")
        .trim()
    )
    .join("|");
}

function assertPackGrammar(packId, iconId, semantic) {
  const context = `${packId}/${iconId}`;
  const rules = {
    system() {
      assert.match(semantic, /\bclass="usk-i-line/u, context);
      assert.doesNotMatch(semantic, /\bdata-icon-(?:material|relief|glass|y2k|cyber|neon|webapp)=/u, context);
    },
    "minimal-saas"() {
      assert.match(semantic, /\bclass="saas-i-line/u, context);
      assert.doesNotMatch(semantic, /\b(?:filter|data-icon-material|data-icon-neon)=/u, context);
    },
    bento() {
      assert.match(semantic, /\bdata-icon-detail=/u, context);
      assert.match(semantic, /\bclass="bi-line/u, context);
      assert.ok(geometryElements(semantic).length >= 3, context);
    },
    maximalist() {
      assert.ok(
        roleCount(semantic, /max-i-(?:primary|secondary|accent|success|warning|danger)/gu) >= 2,
        `${context} uses at least two saturated fill roles`
      );
      assert.doesNotMatch(semantic, /max-i-glow|url\(#/u, context);
    },
    brutalism() {
      assert.ok(
        roleCount(semantic, /brutal-i-(?:primary|secondary|accent|success|warning|danger)/gu) >= 2,
        `${context} uses at least two flat color blocks`
      );
      assert.doesNotMatch(semantic, /filter=|url\(#|<linearGradient|<radialGradient/u, context);
    },
    tactile() {
      for (const role of ["body", "highlight", "lowlight", "shadow"]) {
        assert.match(semantic, new RegExp(`data-icon-material="${role}"`, "u"), `${context} has ${role}`);
      }
      assert.match(
        semantic,
        /\bdata-icon-detail=/u,
        `${context} includes object-specific physical detail`
      );
    },
    neumorphism() {
      for (const role of ["light", "dark", "inset"]) {
        assert.match(semantic, new RegExp(`data-icon-relief="${role}"`, "u"), `${context} has ${role} relief`);
      }
    },
    "retro-glass"() {
      for (const role of ["body", "rim", "refraction"]) {
        assert.match(semantic, new RegExp(`data-icon-glass="${role}"`, "u"), `${context} has ${role} glass`);
      }
      assert.match(
        semantic,
        /<[^>]+\bdata-icon-glass="refraction"(?=[^>]*\bclass="rg-i-line-[23]")[^>]*>/u,
        `${context} keeps its refraction visible without relying on gloss`
      );
      assert.doesNotMatch(semantic, /<ellipse\b[^>]*\b(?:gloss|sheen)/u, context);
    },
    y2k() {
      for (const role of ["body", "shine"]) {
        assert.match(semantic, new RegExp(`data-icon-y2k="${role}"`, "u"), `${context} has ${role}`);
      }
      assert.doesNotMatch(semantic, /<ellipse\b/u, context);
    },
    cyberpunk() {
      for (const role of ["body", "segment", "terminal"]) {
        assert.match(semantic, new RegExp(`data-icon-cyber="${role}"`, "u"), `${context} has ${role}`);
      }
    },
    synthwave() {
      for (const role of ["body", "band"]) {
        assert.match(semantic, new RegExp(`data-icon-neon="${role}"`, "u"), `${context} has ${role}`);
      }
      assert.match(semantic, /(?:fill|stroke)="url\(#[^)]+\)"/u, context);
    },
    "synthwave-webapp"() {
      for (const role of ["body", "status"]) {
        assert.match(semantic, new RegExp(`data-icon-webapp="${role}"`, "u"), `${context} has ${role}`);
      }
      assert.doesNotMatch(semantic, /\bfilter=/u, context);
    }
  };

  rules[packId]();
}

function roleCount(source, pattern) {
  return new Set([...source.matchAll(pattern)].map(([role]) => role)).size;
}
