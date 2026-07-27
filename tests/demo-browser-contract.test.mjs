import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

test("shared browser QA covers ecosystem ownership and stable geometry", async () => {
  const contract = await readFile(
    join(root, "scripts", "demo-browser-contract.mjs"),
    "utf8"
  );

  for (const requiredCheck of [
    "assertDemoEcosystemOwnership",
    "stylesheetHrefs",
    "data-surface-level",
    "focus-visible",
    "ly-sidebar",
    "ly-grid",
    "stableGallery",
    "personalityGrid",
    "packLayoutMappings"
  ]) {
    assert.match(
      contract,
      new RegExp(requiredCheck, "u"),
      `Missing rendered ecosystem check: ${requiredCheck}`
    );
  }
});
