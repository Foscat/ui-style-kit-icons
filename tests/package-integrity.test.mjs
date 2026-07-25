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
const requiredIds = contract.icons.map(({ id }) => id);
const safeViewBoxIconIds = new Set([
  "browser",
  "bug",
  "calendar",
  "cloud",
  "credit-card",
  "link",
  "lock",
  "mail",
  "megaphone",
  "network",
  "palette",
  "server",
  "stack",
  "users",
  "warning"
]);

test("registry publishes the complete shared contract", () => {
  assert.equal(registry.name, packageJson.name);
  assert.equal(registry.version, packageJson.version);
  assert.equal(registry.contractVersion, contract.schemaVersion);
  assert.equal(registry.requiredIconCount, 64);
  assert.equal(registry.packCount, 12);
  assert.deepEqual(registry.coreIconIds, requiredIds);
  assert.equal(new Set(registry.coreIconIds).size, 64);
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

      if (safeViewBoxIconIds.has(icon.id)) {
        assert.match(
          source,
          /viewBox="-8 -8 272 272"/u,
          `${pack.id}/${icon.id} uses the safe clipping viewBox`
        );
      }
    }
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
      /<path data-icon-frame="decor" class="saas-i-muted" d="M58 74H92/u,
      `minimal-saas/${icon.id} top guides hide with frame="none"`
    );
    assert.match(
      source,
      /<path data-icon-frame="decor" class="saas-i-muted" d="M68 206H116/u,
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
