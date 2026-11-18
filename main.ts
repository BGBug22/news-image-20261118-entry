// A working news-image-daily entry (Node 22, standard library only): its image is the entry.png beside this file, and
// the program writes it to /output/entry.png. A starting point, not a winner: replace the image. The gate takes a
// whole PNG or JPEG of at most 1 MiB and 1024 by 1024 pixels, and the judge sees exactly the bytes written.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Revision: the old version copied the file blindly — a truncated or corrupt
// entry.png would have been submitted silently, and a missing output directory
// would crash with an unhelpful error. This version validates the PNG signature
// and IHDR chunk before writing, creates the output directory, and writes the
// exact source bytes so both runs are byte-identical.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const sourcePath = join(dirname(fileURLToPath(import.meta.url)), 'entry.png');
const bytes = readFileSync(sourcePath);

if (bytes.length < 33 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE) || bytes.toString('ascii', 12, 16) !== 'IHDR') {
  throw new Error(`entry.png is not a valid PNG (got ${bytes.length} bytes, bad signature or missing IHDR)`);
}

const MAX_BYTES = 1024 * 1024;
if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), bytes);
console.log(`wrote entry.png (${bytes.length} bytes)`);
