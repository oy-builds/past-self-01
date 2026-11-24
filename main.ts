// Two Lines to Your Past Self — make.fun entry (u-suga-two-lines-to-your-past-self-f36c83ca)
//
// Writes a two-line warning to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output/entry.txt), validates the competition gate
// (UTF-8, 1-280 chars, exactly two lines, no leading/trailing
// whitespace), then reads the file back and verifies it matches
// byte for byte.
//
// Node 22+, standard library only. Run with: node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "When Dad calls from the hospital car park at two in the morning on the night you turn sixteen, pick up before the third ring.\n" +
  "You let it ring out, and by the time you finally heard him say your mother was gone, the funeral was already over and the house was already empty.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate: UTF-8 text, 1-280 characters, not only whitespace, exactly two
// lines, each a single sentence. Also reject leading/trailing whitespace:
// the file must hold exactly the two lines, with no padding the judge
// would read as filler.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 280) {
  fail(`entry is ${chars.length} characters, must be 1-280`);
}
if (ENTRY.trim().length === 0) {
  fail("entry must not be only whitespace");
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry must not start or end with whitespace");
}
const lines = ENTRY.split("\n");
if (lines.length !== 2) {
  fail(`entry must be exactly two lines, got ${lines.length}`);
}
for (const line of lines) {
  if (line.trim().length === 0) {
    fail("each line must hold text, not only whitespace");
  }
  if (line !== line.trim()) {
    fail("lines must not start or end with whitespace");
  }
  if ((line.match(/\./g) ?? []).length !== 1) {
    fail("each line must be exactly one sentence");
  }
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-identical output.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  fail("verification failed: entry.txt does not match the entry");
}

console.log(`wrote ${outPath} (${chars.length} chars)`);
console.log(written);
