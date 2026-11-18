// Tuesday 17 November 2026 on one front page. The picture is entry.png beside this file, drawn ahead of time from
// poster.html by render.mjs; the grader has no network and no browser, so this program only copies those bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PNG_SIGNATURE: number[] = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const MAX_BYTES: number = 1024 * 1024;

const image: Buffer = readFileSync(new URL('./entry.png', import.meta.url));
if (!PNG_SIGNATURE.every((b, i) => image[i] === b)) throw new Error('entry.png is not a PNG');
if (image.length > MAX_BYTES) throw new Error(`entry.png is ${image.length} bytes, over the 1 MiB cap`);
const width: number = image.readUInt32BE(16);
const height: number = image.readUInt32BE(20);
if (width > 1024 || height > 1024) throw new Error(`entry.png is ${width}x${height}, over 1024x1024`);

const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), image);
