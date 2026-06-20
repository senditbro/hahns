/*
 * serve.js — tiny no-cache static server for local previewing.
 * No dependencies. The no-store header means a plain refresh always pulls the
 * newest build, so you never see a stale copy.  Run via the preview tool.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const PORT = 8755;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css"
};

http.createServer(function (req, res) {
  var rel = decodeURIComponent(req.url.split("?")[0]);
  if (rel === "/") rel = "/dist/HAHNS.html";
  var fp = path.normalize(path.join(root, rel));
  if (fp.indexOf(root) !== 0) { res.writeHead(403); return res.end("forbidden"); }
  fs.readFile(fp, function (err, data) {
    if (err) { res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(fp)] || "application/octet-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate"
    });
    res.end(data);
  });
}).listen(PORT, function () {
  console.log("VW Job Buddy preview (no-cache) on http://localhost:" + PORT + "/");
});
