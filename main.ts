// main.ts — entry program for news-image-20261123 ("The World in One Day").
// The entry is a single poster image. This program copies entry.png, which is
// shipped in the repository next to this file, into the grader's output
// directory. Node 22, standard library only, no network, no randomness:
// running it twice always writes the exact same bytes.

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function main() {
  const source = path.join(__dirname, "entry.png");
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  const target = path.join(outDir, "entry.png");

  if (!fs.existsSync(source)) {
    throw new Error("entry.png is missing next to main.ts");
  }
  const bytes = fs.readFileSync(source);
  if (bytes.length === 0) {
    throw new Error("entry.png is empty");
  }
  const digest = sha256(bytes);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(target, bytes);

  // Re-read the copy and verify it byte for byte before reporting success.
  const copied = fs.readFileSync(target);
  if (sha256(copied) !== digest) {
    throw new Error("output bytes do not match entry.png");
  }
  console.log(
    "wrote " + target + " (" + bytes.length + " bytes, sha256 " + digest + ")"
  );
}

main();
