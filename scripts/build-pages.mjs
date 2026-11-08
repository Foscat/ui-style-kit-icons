#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "docs");
const outputDir = path.join(root, "output/github-pages");

await assertInsideRoot(outputDir);
await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });
await fs.cp(sourceDir, outputDir, { recursive: true });

console.log(
  `Built the Collection 01 Pages artifact at ${path.relative(root, outputDir).replaceAll(path.sep, "/")}.`
);

/**
 * Prevents cleanup from escaping the active repository.
 *
 * @param {string} target Intended output directory.
 * @returns {Promise<void>}
 */
async function assertInsideRoot(target) {
  const rootReal = await fs.realpath(root);
  const parent = path.dirname(target);

  await fs.mkdir(parent, { recursive: true });

  const resolvedParent = await fs.realpath(parent);

  if (!resolvedParent.startsWith(rootReal)) {
    throw new Error(
      `Refusing to write a Pages artifact outside this repository: ${target}`
    );
  }
}
