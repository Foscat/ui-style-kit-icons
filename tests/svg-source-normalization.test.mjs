import assert from "node:assert/strict";
import { test } from "node:test";

import { stripGeneratedArtifactLayers } from "../scripts/svg-source-normalization.mjs";

const generatedSource = `<svg viewBox="0 0 256 256">
  <style>.line{fill:none;stroke:currentColor}</style>
  <rect data-icon-frame="surface" class="surface" x="20" y="20" width="216" height="216"/>
  <g data-icon-artifact-underlay="sample" data-icon-audit="decorative">
    <path class="line" d="M50 50H90"/>
  </g>
  <g data-icon-artifact="sample" data-icon-artifact-kind="generated" data-icon-artifact-signature="true">
    <circle class="line" cx="128" cy="128" r="12"/>
  </g>
  <g data-icon-artifact="base">
    <g data-icon-glyph="semantic">
      <path data-icon-part="cloud-shell" class="line" d="M60 160H196Z"/>
    </g>
  </g>
  <path data-icon-frame="decor" class="line" d="M40 210H80"/>
</svg>`;

test("generated artifact cleanup preserves authored semantic and frame layers", () => {
  const cleaned = stripGeneratedArtifactLayers(generatedSource);

  assert.doesNotMatch(cleaned, /\bdata-icon-artifact/u);
  assert.doesNotMatch(cleaned, /M50 50H90|cx="128"/u);
  assert.match(cleaned, /\bdata-icon-glyph="semantic"/u);
  assert.match(cleaned, /\bdata-icon-part="cloud-shell"/u);
  assert.match(cleaned, /\bdata-icon-frame="surface"/u);
  assert.match(cleaned, /\bdata-icon-frame="decor"/u);
});

test("generated artifact cleanup is idempotent", () => {
  const cleaned = stripGeneratedArtifactLayers(generatedSource);

  assert.equal(stripGeneratedArtifactLayers(cleaned), cleaned);
});
