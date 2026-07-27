#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { basename, join, sep } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const packageJson = JSON.parse(
  await readFile(join(root, "package.json"), "utf8")
);
const prefix = "ui-style-kit-icons-consumer-";
const temporaryRoot = await mkdtemp(join(tmpdir(), prefix));
const projectRoot = join(temporaryRoot, "project");
let completed = false;

try {
  const packed = runNpm([
    "pack",
    "--json",
    "--ignore-scripts",
    "--pack-destination",
    temporaryRoot
  ]);
  const [metadata] = JSON.parse(packed);
  const tarball = join(temporaryRoot, basename(metadata.filename));

  await mkdir(projectRoot, { recursive: true });
  await writeFile(
    join(projectRoot, "package.json"),
    `${JSON.stringify(
      {
        name: "ui-style-kit-icons-consumer-check",
        private: true,
        type: "module"
      },
      null,
      2
    )}\n`
  );
  runNpm(
    ["install", "--ignore-scripts", "--no-audit", "--no-fund", tarball],
    projectRoot
  );

  const consumerRequire = createRequire(join(projectRoot, "package.json"));
  const entrypoints = [
    "ui-style-kit-icons",
    "ui-style-kit-icons/element",
    "ui-style-kit-icons/registry",
    "ui-style-kit-icons/registry.json",
    "ui-style-kit-icons/contract.json",
    "ui-style-kit-icons/css.css",
    "ui-style-kit-icons/css/all.css",
    "ui-style-kit-icons/sprite.svg",
    "ui-style-kit-icons/icons/home.svg",
    "ui-style-kit-icons/packs/synthwave/icons/cassette.svg"
  ];

  for (const entrypoint of entrypoints) {
    await access(consumerRequire.resolve(entrypoint));
  }

  const runtime = await import(
    pathToFileURL(consumerRequire.resolve("ui-style-kit-icons")).href
  );
  const registry = await import(
    pathToFileURL(consumerRequire.resolve("ui-style-kit-icons/registry")).href
  );

  assert.equal(registry.packs.length, 12);
  assert.equal(registry.packageVersion, packageJson.version);
  assert.equal(runtime.packageVersion, registry.packageVersion);
  assert.equal(runtime.contractVersion, registry.contractVersion);
  assert.equal(runtime.getPack("retrofuturism").id, "synthwave");
  assert.equal(runtime.getPack("bauhaus").id, "system");

  // The optional peer must not be required for a clean standalone install.
  await assert.rejects(
    access(join(projectRoot, "node_modules", "ui-style-kit-css"))
  );

  completed = true;
  console.log("Fresh standalone tarball install and public entrypoints passed.");
} finally {
  if (completed) {
    await removeSafeTemporaryDirectory(temporaryRoot);
  } else {
    console.error(`Consumer-check artifacts retained at ${temporaryRoot}`);
  }
}

function runNpm(args, cwd = root) {
  const npmExecPath = process.env.npm_execpath;
  const command = npmExecPath
    ? process.execPath
    : process.platform === "win32"
      ? "npm.cmd"
      : "npm";
  const commandArgs = npmExecPath ? [npmExecPath, ...args] : args;
  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32" && !npmExecPath
  });

  if (result.status !== 0) {
    throw new Error(
      [result.error?.message, result.stdout, result.stderr]
        .filter(Boolean)
        .join("\n")
    );
  }

  return result.stdout;
}

async function removeSafeTemporaryDirectory(directory) {
  const expectedRoot = `${tmpdir()}${sep}${prefix}`;

  if (!directory.startsWith(expectedRoot)) {
    throw new Error(`Refusing to remove unexpected consumer-check path: ${directory}`);
  }

  await rm(directory, { recursive: true, force: true });
}
