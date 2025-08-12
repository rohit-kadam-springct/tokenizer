import fs from "node:fs/promises";

/**
 * Save vocabulary to JSON file.
 */
export async function saveVocab(path, vocab) {
  const rawData = JSON.stringify(Object.fromEntries(vocab), null, 2);
  await fs.writeFile(path, rawData);
}

/**
 * Load vocabulary from JSON file.
 */
export async function loadVocab(path, inverse = false) {
  try {
    const raw = await fs.readFile(path, "utf-8");
    const vocabObj = JSON.parse(raw);

    if (inverse) {
      return new Map(Object.entries(vocabObj).map(([word, id]) => [id, word]));
    }

    return new Map(Object.entries(vocabObj));
  } catch (err) {
    console.error(
      `Error: Could not load vocabulary from ${path}. Run "learn" first.`
    );
    process.exit(1);
  }
  return new Map()
}

/**
 * Split sentence into lowercase tokens.
 */
export function tokenize(sentence) {
  return sentence
    .replaceAll("\n", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

/**
 * Parse the stringified array
 */
export function parseArray(text) {
  return text.replace(/[\[\]\s]+/g, "").split(",").map(Number)
}