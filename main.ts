// main.ts — news-image-20261118 entry runner (v3)
// Reads entry.png next to this file, validates it, and writes it byte-for-byte
// to $MAKEFUN_OUTPUT_DIR/entry.png. Deterministic: same input -> same bytes.
const fs = require("node:fs");
const path = require("node:path");

const SRC = path.join(__dirname, "entry.png");
const MAX_BYTES = 1024 * 1024;
const MAX_DIM = 1024;

function fail(msg) {
  console.error("entry.png is not valid: " + msg);
  process.exit(1);
}

const buf = fs.readFileSync(SRC);

// PNG signature: 89 50 4E 47 0D 0A 1A 0A
const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (buf.length < 8 || !buf.subarray(0, 8).equals(SIG)) {
  fail("bad signature (got " + buf.length + " bytes, not a PNG)");
}
// IHDR chunk: type "IHDR" at bytes 12-15, width at 16-19, height at 20-23
// (big-endian uint32).
if (buf.length < 24 || buf.toString("ascii", 12, 16) !== "IHDR") {
  fail("missing IHDR chunk");
}
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
if (width > MAX_DIM || height > MAX_DIM) {
  fail("dimensions " + width + "x" + height + " exceed " + MAX_DIM + "x" + MAX_DIM);
}
if (buf.length > MAX_BYTES) {
  fail("size " + buf.length + " bytes exceeds 1 MiB");
}
console.log("entry.png is " + width + "x" + height);

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  fail("MAKEFUN_OUTPUT_DIR is not set");
}
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "entry.png");
fs.writeFileSync(outPath, buf);
// Verify the write: read the output back and compare it byte-for-byte
// with the source, so a truncated or corrupted write is caught here.
const written = fs.readFileSync(outPath);
if (written.length !== buf.length || !written.equals(buf)) {
  fail("write check failed: output differs from source");
}
console.log("wrote entry.png (" + buf.length + " bytes, verified)");
