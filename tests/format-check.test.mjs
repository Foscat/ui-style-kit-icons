import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const formatCheck = join(root, "scripts", "format-check.mjs");

test("format check rejects trailing whitespace in CRLF files", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "usk-icons-format-"));

  try {
    await writeFile(
      join(fixture, "fixture.svg"),
      '<svg viewBox="0 0 1 1"> \r\n</svg>\r\n',
      "utf8"
    );

    const result = spawnSync(process.execPath, [formatCheck], {
      cwd: fixture,
      encoding: "utf8"
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /fixture\.svg:1: trailing whitespace/u);
  } finally {
    await rm(fixture, { force: true, recursive: true });
  }
});
