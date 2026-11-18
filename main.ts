// news-image-20261118: emit the pre-rendered front page as /output/entry.png.
// The image is a fixed, deterministic PNG built by build_page.py; this
// program only validates it and copies its bytes to the output directory.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1024 * 1024;
const MAX_DIMENSION = 1024;

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const bytes = readFileSync(src);

// Validate the PNG signature (8 bytes) and the IHDR chunk before writing,
// so a corrupt or truncated image fails loudly instead of being submitted.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (bytes.length < 33 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error(`entry.png is not a valid PNG (got ${bytes.length} bytes, bad signature or missing IHDR)`);
}
if (bytes.toString("ascii", 12, 16) !== "IHDR") {
  throw new Error("entry.png is not a valid PNG (missing IHDR chunk)");
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
  throw new Error(`entry.png is ${width}x${height}, over the ${MAX_DIMENSION}x${MAX_DIMENSION} limit`);
}
if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, bytes);
// Re-read the file we just wrote and confirm it matches the source bytes,
// so a truncated or partial write is caught instead of submitted silently.
if (readFileSync(outPath).length !== bytes.length) {
  throw new Error(`wrote ${readFileSync(outPath).length} bytes, expected ${bytes.length}`);
}
console.log(`entry.png is ${width}x${height}`);
console.log(`wrote entry.png (${bytes.length} bytes)`);
