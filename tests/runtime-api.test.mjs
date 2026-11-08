import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { inlineSvg } from "../paint/inline-svg.mjs";
import {
  getPack,
  iconNames,
  resolveIconUrl,
  setDefaultPack
} from "../dist/ui-style-kit-icons.js";

const root = fileURLToPath(new URL("..", import.meta.url));

test("runtime resolves Collection 01 families and artwork variants", () => {
  const baseUrl = "https://cdn.example.test/ui-style-kit-icons/";

  assert.equal(getPack().id, "organic-modern");
  assert.equal(getPack("saas").id, "minimal-saas");
  assert.equal(getPack("editorial").id, "editorial-luxe");
  assert.equal(getPack("industrial-utility").id, "industrial-utility");
  assert.throws(() => getPack("synthwave"), RangeError);
  assert.equal(iconNames("retrofuturism").length, 174);
  assert.equal(
    resolveIconUrl("home", "bento", baseUrl),
    `${baseUrl}svg/bento/home.svg`
  );
  assert.equal(
    resolveIconUrl("home", "bento", baseUrl, "monochrome"),
    `${baseUrl}monochrome/bento/home.svg`
  );
  assert.equal(
    resolveIconUrl("chart", "technical-blueprint", baseUrl),
    `${baseUrl}svg/technical-blueprint/chart-bar.svg`
  );
  assert.throws(
    () => resolveIconUrl("home", "bento", baseUrl, "duotone"),
    RangeError
  );

  assert.equal(setDefaultPack("bauhaus"), "bauhaus");
  assert.equal(getPack().id, "bauhaus");
  setDefaultPack("organic-modern");
});

test("inline SVG normalization preserves theme variables with browser-safe paint", async () => {
  const source = await readFile(
    join(root, "svg", "minimal-saas", "home.svg"),
    "utf8"
  );
  const normalized = inlineSvg(source);

  assert.doesNotMatch(
    normalized,
    /(?:fill|stroke)="var\(--usi-/u,
    "CSS variables must not remain in SVG presentation attributes."
  );
  assert.match(normalized, /style="stroke:var\(--usi-ink, currentColor\)"/u);
});
