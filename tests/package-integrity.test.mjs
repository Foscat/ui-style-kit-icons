import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const contract = JSON.parse(
  await readFile(join(root, "contract", "icon-contract.json"), "utf8")
);
const registry = JSON.parse(
  await readFile(join(root, "dist", "registry.json"), "utf8")
);
const opticalBaselines = JSON.parse(
  await readFile(
    join(root, "contract", "icon-optical-baselines.json"),
    "utf8"
  )
);
const requiredIds = contract.icons.map(({ id }) => id);
const semanticRepairIds = [
  "network",
  "bug",
  "megaphone",
  "link",
  "cloud",
  "users"
];
function attributeValue(element, name) {
  return element.match(new RegExp(`\\b${name}="([^"]+)"`, "u"))?.[1] ?? "";
}

function elementsWithPart(source, elementName, part) {
  const pattern = new RegExp(
    `<${elementName}\\b(?=[^>]*\\bdata-icon-part="${part}")[^>]*\\/?>`,
    "gu"
  );

  return [...source.matchAll(pattern)].map(([element]) => element);
}

function numericAttribute(element, name) {
  return Number(attributeValue(element, name));
}

function lineEndpoints(path) {
  const data = attributeValue(path, "d");
  const match = data.match(
    /^M(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)L(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)$/u
  );

  assert.ok(match, `connector uses one explicit M/L segment: ${data}`);

  return [
    { x: Number(match[1]), y: Number(match[2]) },
    { x: Number(match[3]), y: Number(match[4]) }
  ];
}

function normalizedSegment(points) {
  return points
    .map(({ x, y }) => `${x},${y}`)
    .sort()
    .join("|");
}

test("registry publishes the complete shared contract", () => {
  assert.equal(registry.name, packageJson.name);
  assert.equal(registry.version, packageJson.version);
  assert.equal(registry.contractVersion, contract.schemaVersion);
  assert.equal(registry.requiredIconCount, 64);
  assert.equal(registry.packCount, 12);
  assert.deepEqual(registry.coreIconIds, requiredIds);
  assert.equal(new Set(registry.coreIconIds).size, 64);
});

test("optical baseline targets resolve to registered authored icons", () => {
  const iconsByPack = new Map(
    registry.packs.map((pack) => [
      pack.id,
      new Set(
        [...pack.coreIcons, ...pack.optionalIcons].map(({ id }) => id)
      )
    ])
  );
  const targets = new Set();

  for (const profile of opticalBaselines.profiles ?? []) {
    for (const packId of profile.packs) {
      const key = `${packId}/${profile.icon}`;

      assert.ok(iconsByPack.get(packId)?.has(profile.icon), key);
      assert.equal(targets.has(key), false, `${key} has one optical baseline`);
      targets.add(key);
    }
  }

  for (const [key, baseline] of Object.entries(opticalBaselines.overrides)) {
    const separator = key.indexOf("/");
    const packId = key.slice(0, separator);
    const iconId = key.slice(separator + 1);

    assert.ok(iconsByPack.get(packId)?.has(iconId), key);
    assert.equal(targets.has(key), false, `${key} has one optical baseline`);
    assert.ok(
      [baseline.x, baseline.y, baseline.tolerance].every(Number.isFinite),
      `${key} has finite optical metrics`
    );
    targets.add(key);
  }
});

test("every pack contains the same 64 semantic icons", async () => {
  for (const pack of registry.packs) {
    assert.equal(pack.requiredIconCount, 64, pack.id);
    assert.equal(pack.coreIcons.length, 64, pack.id);
    assert.deepEqual(
      pack.coreIcons.map(({ id }) => id),
      requiredIds,
      `${pack.id} core order`
    );

    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      await access(join(root, pack.sourcePath, icon.file));
    }

    const declaredFiles = [...pack.coreIcons, ...pack.optionalIcons]
      .map(({ file }) => file)
      .sort();
    const actualFiles = (await readdir(join(root, pack.sourcePath, "icons")))
      .filter((file) => file.endsWith(".svg"))
      .map((file) => `icons/${file}`)
      .sort();
    assert.deepEqual(actualFiles, declaredFiles, `${pack.id} manifest files`);

    await access(join(root, pack.css));
    await access(join(root, pack.sprite));
    await access(join(root, pack.inlineSprite));
    await access(join(root, pack.manifest));

    const expectedSymbols = [...pack.coreIcons, ...pack.optionalIcons]
      .map(({ symbol }) => symbol.replace(/^#/u, ""))
      .sort();

    for (const spritePath of [pack.sprite, pack.inlineSprite]) {
      const sprite = await readFile(join(root, spritePath), "utf8");
      const actualSymbols = [
        ...sprite.matchAll(/<symbol\b[^>]*\bid="([^"]+)"/gu)
      ]
        .map(([, id]) => id)
        .sort();
      assert.deepEqual(
        actualSymbols,
        expectedSymbols,
        `${pack.id} symbols in ${spritePath}`
      );
    }
  }
});

test("standalone SVGs do not contain truncated inline selectors", async () => {
  for (const pack of registry.packs) {
    const paths = [
      ...[...pack.coreIcons, ...pack.optionalIcons].map(({ file }) =>
        join(root, pack.sourcePath, file)
      ),
      join(root, pack.sprite),
      join(root, pack.inlineSprite)
    ];

    for (const path of paths) {
      const source = await readFile(path, "utf8");

      assert.doesNotMatch(
        source,
        /^,\s*\[data-|^--(?:xs|sm|md|lg|xl)\s*\{/mu,
        `${pack.id} contains a truncated inline selector in ${path}`
      );
    }
  }
});

test("standalone SVG sizing cannot shrink the web component viewport", async () => {
  for (const pack of registry.packs) {
    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      const path = join(root, pack.sourcePath, icon.file);
      const source = await readFile(path, "utf8");

      assert.doesNotMatch(
        source,
        /(?:inline|block)-size:\s*var\(--(?!usk-icon-size)[a-z0-9-]+-icon-size/u,
        `${pack.id}/${icon.id} does not override the runtime icon size`
      );
    }
  }
});

test("authored SVGs use one centered viewport", async () => {
  for (const pack of registry.packs) {
    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      const path = join(root, pack.sourcePath, icon.file);
      const source = await readFile(path, "utf8");

      assert.match(
        source,
        /^<svg\b[^>]*\bviewBox="0 0 256 256"/u,
        `${pack.id}/${icon.id} uses the shared 256-unit viewport`
      );
    }
  }
});

test("refinement never synthesizes semantic icon geometry", async () => {
  const refinement = await readFile(
    join(root, "scripts", "refine-svg-sources.mjs"),
    "utf8"
  );

  assert.doesNotMatch(
    refinement,
    /era-native-artifacts|applyEraNativeArtifact|createSemanticGlyph|replaceArtworkBody|semanticFramesByPack/u
  );
  await assert.rejects(
    access(join(root, "scripts", "era-native-artifacts.mjs")),
    ({ code }) => code === "ENOENT"
  );
});

test("canonical SVG artwork contains no generated artifact layers", async () => {
  for (const pack of registry.packs) {
    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      const source = await readFile(
        join(root, pack.sourcePath, icon.file),
        "utf8"
      );

      assert.doesNotMatch(
        source,
        /\bdata-icon-artifact(?:-underlay|-signature|-kind)?=/u,
        `${pack.id}/${icon.id} keeps authored semantic geometry`
      );
    }
  }
});

test("repaired semantic icons expose stable part topology in every pack", async () => {
  const requiredParts = new Map([
    ["network", ["network-connector", "network-node"]],
    ["bug", ["bug-body", "bug-head", "bug-legs"]],
    ["megaphone", ["megaphone-horn", "megaphone-handle", "megaphone-sound"]],
    ["link", ["link-loop-a", "link-loop-b", "link-bridge"]],
    ["cloud", ["cloud-shell", "cloud-action"]],
    ["users", ["users-head", "users-shoulders"]]
  ]);

  for (const pack of registry.packs) {
    for (const iconId of semanticRepairIds) {
      const source = await readFile(
        join(root, pack.sourcePath, "icons", `${iconId}.svg`),
        "utf8"
      );

      assert.match(
        source,
        /<g\b[^>]*\bdata-icon-glyph="semantic"[^>]*>/u,
        `${pack.id}/${iconId} identifies its semantic glyph`
      );

      for (const part of requiredParts.get(iconId)) {
        assert.match(
          source,
          new RegExp(`\\bdata-icon-part="${part}"`, "u"),
          `${pack.id}/${iconId} identifies ${part}`
        );
      }
    }
  }
});

test("network connectors are symmetric, behind nodes, and terminate at node edges", async () => {
  for (const pack of registry.packs) {
    const source = await readFile(
      join(root, pack.sourcePath, "icons", "network.svg"),
      "utf8"
    );
    const connectors = elementsWithPart(
      source,
      "path",
      "network-connector"
    );
    const nodes = elementsWithPart(source, "circle", "network-node").map(
      (element) => ({
        x: numericAttribute(element, "cx"),
        y: numericAttribute(element, "cy"),
        radius: numericAttribute(element, "r")
      })
    );

    assert.equal(connectors.length, 5, `${pack.id}/network has five connectors`);
    assert.equal(nodes.length, 4, `${pack.id}/network has four nodes`);
    assert.ok(
      source.lastIndexOf('data-icon-part="network-connector"') <
        source.indexOf('data-icon-part="network-node"'),
      `${pack.id}/network draws connectors behind nodes`
    );

    const segments = connectors.map(lineEndpoints);
    const segmentSet = new Set(segments.map(normalizedSegment));

    for (const segment of segments) {
      const mirrored = segment.map(({ x, y }) => ({ x: 256 - x, y }));

      assert.ok(
        segmentSet.has(normalizedSegment(mirrored)),
        `${pack.id}/network mirrors each connector around x=128`
      );

      for (const endpoint of segment) {
        const nearestBoundary = Math.min(
          ...nodes.map(
            (node) =>
              Math.abs(
                Math.hypot(endpoint.x - node.x, endpoint.y - node.y) -
                  node.radius
              )
          )
        );

        assert.ok(
          nearestBoundary <= 2,
          `${pack.id}/network connector terminates at a node boundary`
        );
      }
    }
  }
});

test("link, cloud, and users preserve recognizable semantic topology", async () => {
  for (const pack of registry.packs) {
    const link = await readFile(
      join(root, pack.sourcePath, "icons", "link.svg"),
      "utf8"
    );
    const loops = ["link-loop-a", "link-loop-b"].map(
      (part) => elementsWithPart(link, "rect", part)[0]
    );

    assert.ok(loops.every(Boolean), `${pack.id}/link uses two closed loops`);
    const [firstLoop, secondLoop] = loops.map((element) => ({
      x: numericAttribute(element, "x"),
      y: numericAttribute(element, "y"),
      width: numericAttribute(element, "width"),
      height: numericAttribute(element, "height")
    }));
    const overlapWidth =
      Math.min(
        firstLoop.x + firstLoop.width,
        secondLoop.x + secondLoop.width
      ) - Math.max(firstLoop.x, secondLoop.x);
    const overlapHeight =
      Math.min(
        firstLoop.y + firstLoop.height,
        secondLoop.y + secondLoop.height
      ) - Math.max(firstLoop.y, secondLoop.y);

    assert.ok(
      overlapWidth >= 24 && overlapHeight >= 24,
      `${pack.id}/link loops visibly overlap`
    );
    assert.ok(
      Math.abs(
        firstLoop.y +
          firstLoop.height / 2 -
          (secondLoop.y + secondLoop.height / 2)
      ) >= 8,
      `${pack.id}/link offsets its loops so they read as interlocked`
    );
    assert.equal(
      elementsWithPart(link, "path", "link-bridge").length,
      1,
      `${pack.id}/link exposes one over/under bridge`
    );

    const cloud = await readFile(
      join(root, pack.sourcePath, "icons", "cloud.svg"),
      "utf8"
    );
    const cloudShell = elementsWithPart(
      cloud,
      "path",
      "cloud-shell"
    )[0];

    assert.ok(cloudShell, `${pack.id}/cloud has a silhouette`);
    assert.match(
      attributeValue(cloudShell, "d"),
      /Z$/u,
      `${pack.id}/cloud silhouette is closed`
    );

    const users = await readFile(
      join(root, pack.sourcePath, "icons", "users.svg"),
      "utf8"
    );
    const heads = elementsWithPart(users, "circle", "users-head").map(
      (element) => ({
        x: numericAttribute(element, "cx"),
        y: numericAttribute(element, "cy"),
        radius: numericAttribute(element, "r")
      })
    );

    assert.equal(heads.length, 3, `${pack.id}/users has three heads`);
    for (let first = 0; first < heads.length; first += 1) {
      for (let second = first + 1; second < heads.length; second += 1) {
        assert.ok(
          Math.hypot(
            heads[first].x - heads[second].x,
            heads[first].y - heads[second].y
          ) >=
            heads[first].radius + heads[second].radius + 4,
          `${pack.id}/users heads do not overlap`
        );
      }
    }
    assert.equal(
      elementsWithPart(users, "path", "users-shoulders").length,
      3,
      `${pack.id}/users separates three shoulder shapes`
    );
  }
});

test("authored frames distinguish surfaces from restrained decoration", async () => {
  for (const pack of registry.packs) {
    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      const source = await readFile(
        join(root, pack.sourcePath, icon.file),
        "utf8"
      );

      assert.match(
        source,
        /\bdata-icon-frame="surface"/u,
        `${pack.id}/${icon.id} identifies its outer surface`
      );
      assert.match(
        source,
        /\bdata-icon-frame="decor"/u,
        `${pack.id}/${icon.id} identifies optional frame decoration`
      );
      assert.doesNotMatch(
        source,
        /data-icon-frame="decor"[^>]*\bclass="[^"]*(?:-surface|-bg-strong)\b/u,
        `${pack.id}/${icon.id} does not hide its surface as decoration`
      );
    }
  }
});

test("high-decoration packs keep scenery at the frame perimeter", async () => {
  const expectations = new Map([
    ["cyberpunk", ".26"],
    ["synthwave", ".22"],
    ["synthwave-webapp", ".18"]
  ]);

  for (const [packId, opacity] of expectations) {
    const pack = registry.packs.find(({ id }) => id === packId);

    assert.ok(pack, `${packId} is registered`);
    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      const source = await readFile(
        join(root, pack.sourcePath, icon.file),
        "utf8"
      );

      assert.match(
        source,
        new RegExp(
          `\\[data-icon-frame="decor"\\]\\{opacity:var\\(--usk-icon-frame-decor-opacity,${escapeRegExp(
            opacity
          )}\\)\\}`,
          "u"
        ),
        `${packId}/${icon.id} uses the pack decoration default`
      );
      assert.doesNotMatch(
        source,
        /M36 224L224 36|M24 232L104 154|M30 232L104 156/u,
        `${packId}/${icon.id} has no center-crossing grid`
      );
      assert.doesNotMatch(
        source,
        /\bclass="sw-i-horizon-sun"/u,
        `${packId}/${icon.id} has no semantic-obscuring horizon sun`
      );
    }
  }
});

test("named visual outliers keep their semantic parts contained and separated", async () => {
  const bentoActivity = await readFile(
    join(root, "packs", "bento", "icons", "activity.svg"),
    "utf8"
  );
  const activityChip = elementsWithPart(
    bentoActivity,
    "rect",
    "activity-chip"
  )[0];

  assert.ok(activityChip, "bento/activity identifies its chip");
  const chip = {
    x: numericAttribute(activityChip, "x"),
    y: numericAttribute(activityChip, "y"),
    width: numericAttribute(activityChip, "width"),
    height: numericAttribute(activityChip, "height")
  };
  assert.equal(
    elementsWithPart(bentoActivity, "path", "activity-pulse").length,
    1,
    "bento/activity identifies its pulse"
  );
  assert.equal(
    elementsWithPart(bentoActivity, "path", "activity-baseline").length,
    1,
    "bento/activity identifies its baseline"
  );
  assert.ok(
    chip.x <= 54 &&
      chip.y <= 74 &&
      chip.x + chip.width >= 202 &&
      chip.y + chip.height >= 182,
    "bento/activity chip contains the repaired pulse with a six-unit inset"
  );

  for (const packId of ["retro-glass", "y2k"]) {
    const sparkle = await readFile(
      join(root, "packs", packId, "icons", "sparkle.svg"),
      "utf8"
    );

    for (const part of [
      "sparkle-primary",
      "sparkle-secondary",
      "sparkle-tertiary"
    ]) {
      assert.match(
        sparkle,
        new RegExp(`\\bdata-icon-part="${part}"`, "u"),
        `${packId}/sparkle separates ${part}`
      );
    }
  }

  const y2kStar = await readFile(
    join(root, "packs", "y2k", "icons", "star.svg"),
    "utf8"
  );

  assert.doesNotMatch(
    y2kStar,
    /<ellipse\b[^>]*\bclass="y2k-i-gloss"/u,
    "y2k/star removes the gray gloss ellipse"
  );
  assert.match(
    y2kStar,
    /<path\b[^>]*\bdata-icon-part="star-highlight"[^>]*>/u,
    "y2k/star uses a contour-attached highlight stroke"
  );
});

test("runtime soft frames use the release frame hierarchy", async () => {
  const runtime = await readFile(
    join(root, "src", "ui-style-kit-icons.js"),
    "utf8"
  );

  assert.match(runtime, /--usk-icon-frame-opacity:\s*0\.36/u);
  assert.match(runtime, /--usk-icon-frame-decor-opacity:\s*0\.10/u);
});

test("each pack keeps one core construction family", async () => {
  for (const pack of registry.packs) {
    const styleFamilies = new Set();

    for (const icon of pack.coreIcons) {
      const path = join(root, pack.sourcePath, icon.file);
      const source = await readFile(path, "utf8");
      const style = source.match(/<style\b[^>]*>([\s\S]*?)<\/style>/iu)?.[1] ?? "";

      styleFamilies.add(style.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/\s+/gu, ""));
    }

    assert.equal(
      styleFamilies.size,
      1,
      `${pack.id} core icons share one authored construction family`
    );
  }
});

test("Cyberpunk completion icons use a restrained angular HUD frame", async () => {
  const cyberpunk = registry.packs.find(({ id }) => id === "cyberpunk");
  const completionIds = new Set([
    "browser",
    "camera",
    "cursor",
    "grid",
    "heart",
    "megaphone",
    "module",
    "palette",
    "phone",
    "stack",
    "star",
    "target",
    "tile"
  ]);

  assert.ok(cyberpunk, "cyberpunk pack is registered");
  for (const icon of cyberpunk.coreIcons.filter(({ id }) =>
    completionIds.has(id)
  )) {
    const source = await readFile(
      join(root, cyberpunk.sourcePath, icon.file),
      "utf8"
    );

    assert.match(
      source,
      /data-icon-frame="surface"[^>]*\bd="M42 (?:18|20)H214L(?:238|236) 42V214L214 (?:238|236)H42L(?:18|20) 214V42Z/u,
      `cyberpunk/${icon.id} includes the angular panel surface`
    );
    assert.match(
      source,
      /\bdata-icon-frame="decor"/u,
      `cyberpunk/${icon.id} retains peripheral HUD detail`
    );
    assert.doesNotMatch(
      source,
      /M36 224L224 36|M70 228L228 70/u,
      `cyberpunk/${icon.id} removes center-crossing HUD lines`
    );
  }
});

test("essential paint attributes use pack contrast roles", async () => {
  const unsafePaint =
    /\b(?:fill|stroke|stop-color)="rgb\(var\(--usk-(?:primary|secondary|accent|success|warning|danger|text|text-muted|border)-rgb/gu;

  for (const pack of registry.packs) {
    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      const path = join(root, pack.sourcePath, icon.file);
      const source = await readFile(path, "utf8");
      const artwork = source.replace(/<style\b[\s\S]*?<\/style>/giu, "");

      assert.doesNotMatch(
        artwork,
        unsafePaint,
        `${pack.id}/${icon.id} routes authored paint through contrast-safe pack roles`
      );
    }
  }
});

test("open stroked paths make an explicit fill decision", async () => {
  for (const pack of registry.packs) {
    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      const path = join(root, pack.sourcePath, icon.file);
      const source = await readFile(path, "utf8");
      const artwork = source.replace(/<style\b[\s\S]*?<\/style>/giu, "");

      for (const [, attributes] of artwork.matchAll(/<path\b([^>]*)>/gu)) {
        const pathData = attributes.match(/\bd="([^"]*)"/u)?.[1];

        if (
          !pathData ||
          /[zZ]/u.test(pathData) ||
          !/\bstroke="/u.test(attributes)
        ) {
          continue;
        }

        assert.match(
          attributes,
          /\bfill="/u,
          `${pack.id}/${icon.id} does not inherit SVG's default fill`
        );
      }
    }
  }
});

test("standalone SVGs expose frame controls and video contrast hooks", async () => {
  for (const pack of registry.packs) {
    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      const path = join(root, pack.sourcePath, icon.file);
      const source = await readFile(path, "utf8");

      assert.match(source, /\sdata-icon-frame="/u, `${pack.id}/${icon.id} has a frame hook`);

      if (icon.id === "video") {
        for (const hook of ["player", "screen", "camera", "controls"]) {
          assert.match(
            source,
            new RegExp(`\\sdata-icon-video="${hook}"`, "u"),
            `${pack.id}/video has a visible ${hook} hook`
          );
        }

        assert.match(
          source,
          /\sdata-icon-glyph="play"/u,
          `${pack.id}/video has a high-contrast play glyph hook`
        );
      }

    }
  }
});

test("semantic headphone geometry remains visible without its frame", async () => {
  const synthwave = registry.packs.find(({ id }) => id === "synthwave");
  const headphones = synthwave?.optionalIcons.find(
    ({ id }) => id === "headphones"
  );

  assert.ok(synthwave && headphones, "synthwave headphones are registered");
  const source = await readFile(
    join(root, synthwave.sourcePath, headphones.file),
    "utf8"
  );
  const headband = source.match(
    /<path\b[^>]*\bd="M70 142C70 91 96 63 128 63C160 63 186 91 186 142"[^>]*>/u
  )?.[0];

  assert.ok(headband, "the headphone headband is authored");
  assert.doesNotMatch(
    headband,
    /\bdata-icon-frame=/u,
    "the semantic headband is independent of frame visibility"
  );
});

test("Y2K icons share a centered viewport and frame-aware guide marks", async () => {
  const y2kPack = registry.packs.find(({ id }) => id === "y2k");
  assert.ok(y2kPack, "y2k pack is registered");

  for (const icon of [...y2kPack.coreIcons, ...y2kPack.optionalIcons]) {
    const source = await readFile(join(root, y2kPack.sourcePath, icon.file), "utf8");

    assert.match(
      source,
      /^<svg overflow="hidden"[^>]*\bviewBox="0 0 256 256"/u,
      `y2k/${icon.id} uses the standard clipped viewport`
    );
    assert.doesNotMatch(
      source,
      /<path class="y2k-i-(?:muted|line-3)" d="M(?:54 206|54 52)/u,
      `y2k/${icon.id} has no persistent guide fragments`
    );
    assert.match(
      source,
      /<path data-icon-frame="decor" class="y2k-i-muted" d="M52 206H104M152 206H204"/u,
      `y2k/${icon.id} footer guides hide with frame="none"`
    );
    assert.match(
      source,
      /<path data-icon-frame="decor" class="y2k-i-line-3" d="M52 52H76M180 52H204"/u,
      `y2k/${icon.id} header guides hide with frame="none"`
    );
    assert.doesNotMatch(
      source,
      /<ellipse data-icon-frame="decor" class="y2k-i-gloss"/u,
      `y2k/${icon.id} has no detached gloss bubble`
    );
    assert.match(
      source,
      /<path data-icon-frame="decor" data-icon-audit="decorative" class="y2k-i-shine" fill="none" d="M48 78C54 58 68 46 88 42H102"/u,
      `y2k/${icon.id} follows the frame edge with a deliberate shine`
    );
  }

  const network = await readFile(
    join(root, y2kPack.sourcePath, "icons", "network.svg"),
    "utf8"
  );
  assert.ok(
    network.lastIndexOf('data-icon-part="network-connector"') <
      network.indexOf('data-icon-part="network-node"'),
    "y2k/network draws connectors behind its nodes"
  );

  const cloud = await readFile(
    join(root, y2kPack.sourcePath, "icons", "cloud.svg"),
    "utf8"
  );
  assert.match(
    attributeValue(
      elementsWithPart(cloud, "path", "cloud-shell")[0],
      "d"
    ),
    /Z$/u,
    "y2k/cloud is closed"
  );

  for (const spritePath of [y2kPack.sprite, y2kPack.inlineSprite]) {
    const sprite = await readFile(join(root, spritePath), "utf8");
    const viewBoxes = [
      ...sprite.matchAll(/<symbol\b[^>]*\bviewBox="([^"]+)"/gu)
    ].map(([, viewBox]) => viewBox);

    assert.equal(viewBoxes.length, 69, `${spritePath} contains every Y2K symbol`);
    assert.ok(
      viewBoxes.every((viewBox) => viewBox === "0 0 256 256"),
      `${spritePath} preserves the centered Y2K viewport`
    );
  }
});

test("minimal-saas frame guides and contrast weights stay demo-ready", async () => {
  const minimalSaasPack = registry.packs.find(({ id }) => id === "minimal-saas");
  assert.ok(minimalSaasPack, "minimal-saas pack is registered");

  for (const icon of [...minimalSaasPack.coreIcons, ...minimalSaasPack.optionalIcons]) {
    const source = await readFile(join(root, minimalSaasPack.sourcePath, icon.file), "utf8");

    assert.doesNotMatch(
      source,
      /<path class="saas-i-muted" d="M(?:58 74H92|68 206H116)/u,
      `minimal-saas/${icon.id} has an unhooked frame guide`
    );
    assert.match(
      source,
      /<path data-icon-frame="decor" class="saas-i-muted" d="M58 52H88/u,
      `minimal-saas/${icon.id} top guides hide with frame="none"`
    );
    assert.match(
      source,
      /<path data-icon-frame="decor" class="saas-i-muted" d="M68 216H108/u,
      `minimal-saas/${icon.id} footer guides hide with frame="none"`
    );
    assert.match(
      source,
      /\.saas-i-line-2\{[^}]*stroke-width:4\.45/u,
      `minimal-saas/${icon.id} keeps high-contrast secondary strokes`
    );
    assert.match(
      source,
      /\.saas-i-line-3\{[^}]*stroke-width:4\.05/u,
      `minimal-saas/${icon.id} keeps high-contrast accent strokes`
    );
    assert.match(
      source,
      /\.saas-i-muted\{[^}]*stroke-width:3/u,
      `minimal-saas/${icon.id} keeps visible muted strokes`
    );
  }
});

test("sprite exports preserve frame and video hooks", async () => {
  for (const pack of registry.packs) {
    const declaredClasses = new Set();

    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      const source = await readFile(join(root, pack.sourcePath, icon.file), "utf8");
      const sourceStyle =
        source.match(/<style\b[^>]*>([\s\S]*?)<\/style>/iu)?.[1] ?? "";

      for (const [, className] of sourceStyle.matchAll(
        /\.([a-z_][a-z0-9_-]*)(?=[\s,{.:])/giu
      )) {
        declaredClasses.add(className);
      }
    }

    for (const spritePath of [pack.sprite, pack.inlineSprite]) {
      const sprite = await readFile(join(root, spritePath), "utf8");
      const spriteStyle = sprite.match(/<style\b[^>]*>([\s\S]*?)<\/style>/iu)?.[1] ?? "";

      assert.match(sprite, /\sdata-icon-frame="/u, `${pack.id} frame hooks in ${spritePath}`);
      assert.match(
        spriteStyle,
        /UI Style Kit Icons: generated sprite contrast guard/u,
        `${pack.id} sprite contrast guard in ${spritePath}`
      );
      assert.match(
        sprite,
        /\sdata-icon-glyph="play"/u,
        `${pack.id} video play hook in ${spritePath}`
      );

      for (const hook of ["screen", "camera", "controls"]) {
        assert.match(
          sprite,
          new RegExp(`\\sdata-icon-video="${hook}"`, "u"),
          `${pack.id} video ${hook} hook in ${spritePath}`
        );
      }

      for (const className of declaredClasses) {
        assert.match(
          spriteStyle,
          new RegExp(`\\.${escapeRegExp(className)}(?:[\\s,{.:]|$)`, "u"),
          `${pack.id} sprite styles ${className} in ${spritePath}`
        );
      }
    }
  }
});

test("sprite exports preserve explicit visual-audit roles", async () => {
  for (const pack of registry.packs) {
    let authoredRoleCount = 0;

    for (const icon of [...pack.coreIcons, ...pack.optionalIcons]) {
      const source = await readFile(
        join(root, pack.sourcePath, icon.file),
        "utf8"
      );
      const roles = [
        ...source.matchAll(/\bdata-icon-audit="([^"]+)"/gu)
      ].map(([, role]) => role);

      assert.ok(
        roles.every((role) => ["background", "decorative"].includes(role)),
        `${pack.id}/${icon.id} uses a supported visual-audit role`
      );
      authoredRoleCount += roles.length;
    }

    for (const spritePath of [pack.sprite, pack.inlineSprite]) {
      const sprite = await readFile(join(root, spritePath), "utf8");
      const spriteRoleCount = [
        ...sprite.matchAll(/\bdata-icon-audit="(?:background|decorative)"/gu)
      ].length;

      assert.equal(
        spriteRoleCount,
        authoredRoleCount,
        `${pack.id} preserves visual-audit roles in ${spritePath}`
      );
    }
  }
});

test("sprite exports preserve approved prototype semantic metadata", async () => {
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

  for (const pack of registry.packs) {
    for (const spritePath of [pack.sprite, pack.inlineSprite]) {
      const sprite = await readFile(join(root, spritePath), "utf8");

      for (const iconId of prototypeIds) {
        const symbolId = pack.coreIcons
          .find(({ id }) => id === iconId)
          ?.symbol.replace(/^#/u, "");

        assert.ok(symbolId, `${pack.id}/${iconId} has a registered symbol`);
        const symbol = sprite.match(
          new RegExp(
            `<symbol\\b[^>]*\\bid="${escapeRegExp(symbolId)}"[^>]*>([\\s\\S]*?)<\\/symbol>`,
            "u"
          )
        )?.[0];

        assert.ok(symbol, `${pack.id}/${iconId} exists in ${spritePath}`);
        assert.match(
          symbol,
          /\bdata-icon-glyph="semantic"/u,
          `${pack.id}/${iconId} keeps its semantic hook in ${spritePath}`
        );
        assert.match(
          symbol,
          /\bdata-icon-prototype="reference-led-v1"/u,
          `${pack.id}/${iconId} keeps its prototype version in ${spritePath}`
        );
      }
    }
  }
});

test("retro-glass frame highlight avoids the legacy comment-bubble oval", async () => {
  const retroGlassPack = registry.packs.find(({ id }) => id === "retro-glass");
  assert.ok(retroGlassPack, "retro-glass pack is registered");

  const legacyOval =
    /<ellipse(?=[^>]*\bdata-icon-frame="decor")(?=[^>]*\bclass="rg-i-gloss")(?=[^>]*\bcx="100")(?=[^>]*\bcy="62")(?=[^>]*\brx="54")(?=[^>]*\bry="13")[^>]*\/>/u;
  const oldTopRim = /M58 46H118M168 46H196M50 194H112M152 194H206/u;
  const refinedSheen = /\bclass="rg-i-sheen"[^>]*\bd="M70 48C56 51 48 62 47 80M88 46H122"/u;

  for (const icon of [...retroGlassPack.coreIcons, ...retroGlassPack.optionalIcons]) {
    const source = await readFile(join(root, retroGlassPack.sourcePath, icon.file), "utf8");

    assert.doesNotMatch(source, legacyOval, `retro-glass/${icon.id} has legacy oval gloss`);
    assert.doesNotMatch(source, oldTopRim, `retro-glass/${icon.id} has legacy top rim`);
    assert.match(source, refinedSheen, `retro-glass/${icon.id} has refined corner sheen`);
  }

  for (const spritePath of [retroGlassPack.sprite, retroGlassPack.inlineSprite]) {
    const sprite = await readFile(join(root, spritePath), "utf8");

    assert.doesNotMatch(sprite, legacyOval, `${spritePath} has legacy oval gloss`);
    assert.doesNotMatch(sprite, oldTopRim, `${spritePath} has legacy top rim`);
    assert.match(sprite, refinedSheen, `${spritePath} has refined corner sheen`);
  }
});

test("folder tab highlights are attached strokes instead of gray gloss smudges", async () => {
  const cases = [
    {
      packId: "y2k",
      legacy:
        /<ellipse data-icon-audit="decorative" class="y2k-i-gloss" cx="112" cy="96" rx="34" ry="8"\/>/u,
      replacement:
        /<path data-icon-audit="decorative" class="y2k-i-line-3" d="M70 98H102L112 108" opacity="\.72"\/>/u
    },
    {
      packId: "retro-glass",
      legacy:
        /<ellipse data-icon-audit="decorative" class="rg-i-gloss" cx="112" cy="98" rx="35" ry="8"\/>/u,
      replacement:
        /<path data-icon-audit="decorative" class="rg-i-rim" d="M70 100H102L112 109" opacity="\.72"\/>/u
    }
  ];

  for (const { packId, legacy, replacement } of cases) {
    const pack = registry.packs.find(({ id }) => id === packId);
    assert.ok(pack, `${packId} is registered`);
    const folder = await readFile(
      join(root, pack.sourcePath, "icons", "folder.svg"),
      "utf8"
    );

    assert.doesNotMatch(folder, legacy, `${packId}/folder removes the filled oval`);
    assert.match(
      folder,
      replacement,
      `${packId}/folder follows the tab edge with a line highlight`
    );
  }
});

test("package export targets exist", async () => {
  const targets = [];

  for (const value of Object.values(packageJson.exports)) {
    if (typeof value === "string") {
      targets.push(value);
    } else if (value?.import) {
      targets.push(value.import);
    }
    if (value?.types) {
      targets.push(value.types);
    }
  }

  for (const target of targets.filter((value) => !value.includes("*"))) {
    await access(join(root, target));
  }
});

test("style aliases provide deterministic fallbacks", () => {
  assert.equal(registry.styleAliases.retrofuturism, "synthwave");
  assert.equal(registry.styleAliases.bauhaus, "system");
  assert.equal(registry.styleAliases.skeuomorphic, "tactile");
  assert.deepEqual(registry.uiStyleKitCssCompatibility.modes, [
    "light",
    "dark",
    "contrast"
  ]);
  assert.equal(
    registry.uiStyleKitCssCompatibility.versionRange,
    packageJson.peerDependencies["ui-style-kit-css"]
  );
});

test("runtime resolves self-hosted asset bases", async () => {
  const runtime = await import("../dist/ui-style-kit-icons.js");

  assert.equal(runtime.packageName, packageJson.name);
  assert.equal(runtime.packageVersion, packageJson.version);
  assert.equal(runtime.contractVersion, contract.schemaVersion);
  assert.equal(runtime.requiredIconCount, contract.requiredIconCount);
  assert.equal(runtime.packCount, registry.packCount);
  assert.equal(
    runtime.setAssetBaseUrl("https://static.example.com/ui-style-kit-icons"),
    "https://static.example.com/ui-style-kit-icons/"
  );
  assert.equal(
    runtime.resolveIconUrl("dashboard", "bento"),
    "https://static.example.com/ui-style-kit-icons/packs/bento/icons/dashboard.svg"
  );
  assert.equal(
    runtime.getAssetBaseUrl(),
    "https://static.example.com/ui-style-kit-icons/"
  );
});

test("visual audit validates options before startup and always cleans resources", async () => {
  const source = await readFile(
    join(root, "scripts", "check-svg-visuals.mjs"),
    "utf8"
  );
  const validationIndex = source.indexOf("Unsupported SVG audit browser");
  const serverIndex = source.indexOf("const server = spawn");

  assert.ok(validationIndex >= 0 && validationIndex < serverIndex);
  assert.match(
    source,
    /let browser;\s*try\s*\{[\s\S]*browser = await chromium\.launch/u
  );
  assert.match(
    source,
    /finally\s*\{[\s\S]*await browser\?\.close\(\);[\s\S]*await stopServer\(server\);/u
  );
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
