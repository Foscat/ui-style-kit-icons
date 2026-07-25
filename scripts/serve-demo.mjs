#!/usr/bin/env node
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT ?? process.argv[2] ?? 4173);
const host = process.env.HOST ?? "127.0.0.1";
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"]
]);

function fileForRequest(url) {
  let requestedPath;

  try {
    requestedPath = decodeURIComponent(
      new URL(url, `http://${host}:${port}`).pathname
    );
  } catch {
    return null;
  }

  const normalizedPath = path.normalize(requestedPath).replace(/^([/\\])+/, "");
  const filePath = path.join(root, normalizedPath || "index.html");
  const resolvedPath = path.resolve(filePath);

  if (!resolvedPath.startsWith(`${root}${path.sep}`) && resolvedPath !== root) {
    return null;
  }

  return fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()
    ? path.join(resolvedPath, "index.html")
    : resolvedPath;
}

const server = http.createServer((request, response) => {
  const filePath = fileForRequest(request.url ?? "/");

  if (!filePath || !fs.existsSync(filePath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const ext = path.extname(filePath);
  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": mimeTypes.get(ext) ?? "application/octet-stream"
  });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`UI Style Kit Icons demo running at http://${host}:${port}/`);
});
