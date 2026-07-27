#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([
  ".git",
  ".cache",
  ".agents",
  ".codex",
  ".npm-cache",
  ".tmp",
  "coverage",
  "node_modules",
  "output",
  "playwright-report",
  "test-results",
  "tmp"
]);
const checkedExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".txt",
  ".webmanifest",
  ".xml"
]);
const errors = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        walk(path.join(dir, entry.name));
      }
      continue;
    }

    const ext = path.extname(entry.name);
    if (!checkedExtensions.has(ext)) {
      continue;
    }

    const file = path.join(dir, entry.name);
    const relative = path.relative(root, file).replaceAll(path.sep, "/");
    const text = fs.readFileSync(file, "utf8");

    if (!text.endsWith("\n")) {
      errors.push(`${relative}: missing final newline`);
    }

    text.split(/\r?\n/u).forEach((line, index) => {
      if (/[ \t]$/.test(line)) {
        errors.push(`${relative}:${index + 1}: trailing whitespace`);
      }
    });

    if (ext === ".json" || ext === ".webmanifest") {
      try {
        JSON.parse(text);
      } catch (error) {
        errors.push(`${relative}: invalid JSON: ${error.message}`);
      }
    }
  }
}

walk(root);

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Format check passed.");
