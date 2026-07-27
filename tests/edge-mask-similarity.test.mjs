import assert from "node:assert/strict";
import { test } from "node:test";
import { edgeMaskSimilarity } from "../scripts/edge-mask-similarity.mjs";

test("edge mask similarity recognizes effectively identical geometry", () => {
  const first = [0, 1, 1, 0, 1, 0, 0, 1];
  const second = [0, 0.999, 1, 0, 1, 0, 0, 1];

  assert.ok(edgeMaskSimilarity(first, second) >= 0.985);
});

test("edge mask similarity rejects materially different geometry", () => {
  const first = [0, 1, 1, 0, 1, 0, 0, 1];
  const second = [1, 0, 0, 1, 0, 1, 1, 0];

  assert.ok(edgeMaskSimilarity(first, second) < 0.985);
});

test("edge mask similarity rejects incompatible masks", () => {
  assert.equal(edgeMaskSimilarity([], []), 0);
  assert.equal(edgeMaskSimilarity([1], [1, 0]), 0);
});
