import fs from "node:fs/promises"
import { loadVocab, parseArray, saveVocab, tokenize } from "./utils/index.js"


const VOCAB_PATH = "data/vocab.json";
const SPECIAL_TOKENS = ["<PAD>", "<UNK>", "<START>", "<END>"];


/**  
 * Learn vocabulary from corpus. 
 * generates a mapping from words to unique token IDs, and saves it to `data/vocab.json`. 
 */
async function learnVocab(corpusFile) {
  try {
    console.log("")
    const raw = await fs.readFile(corpusFile, "utf-8");
    const words = new Set(tokenize(raw));

    const vocab = new Map();
    let idx = 0;

    // Add special tokens first
    SPECIAL_TOKENS.forEach(token => vocab.set(token, idx++));

    // Add unique words from corpus
    words.forEach(word => {
      if (!vocab.has(word)) vocab.set(word, idx++);
    });

    await saveVocab(VOCAB_PATH, vocab);
    console.log(`Vocabulary learned and saved. Vocabulary size: ${vocab.size}`);
  } catch (err) {
    console.error(`Error: Could not read corpus file "${corpusFile}"`);
    process.exit(1);
  }
}


/** Encode text into token IDs. */
async function encode(text) {
  const vocab = await loadVocab(VOCAB_PATH);
  const tokens = [vocab.get("<START>")];

  tokenize(text).forEach(word => {
    // Check the word in vocab if not present push <UNK>
    tokens.push(vocab.has(word) ? vocab.get(word) : vocab.get("<UNK>"));
  });

  tokens.push(vocab.get("<END>"));
  console.log("Encoded:", tokens);
  return tokens;
}


/** Decode token IDs → text. */
async function decode(ids) {
  const invVocab = await loadVocab(VOCAB_PATH, true);
  
  const words = ids 
    // Get decode text and if not present <UNK>
    .map(id => invVocab.get(id) ?? "<UNK>")  
    // remove special token except <UNK>
    .filter(word => !["<START>", "<END>", "<PAD>"].includes(word)); 

  const output = words.join(" ");
  console.log("Decoded:", output);
  return output;
}


// ==========================
// CLI Handler
// ==========================
async function main() {
  const [, , command, arg] = process.argv;

  switch (command) {
    case "learn":
      if (!arg) {
        console.error("Usage: node tokenizer.js learn <corpus.txt>");
        process.exit(1);
      }
      await learnVocab(arg);
      break;

    case "encode":
      if (!arg) {
        console.error('Usage: node tokenizer.js encode "your text"');
        process.exit(1);
      }
      await encode(arg);
      break;

    case "decode":
      if (!arg) {
        console.error('Usage: node tokenizer.js decode "[id,id,id]"');
        process.exit(1);
      }
      const ids = parseArray(arg);
      await decode(ids);
      break;

    default:
      console.log(`Usage:
  node tokenizer.js learn <corpus.txt>
  node tokenizer.js encode "your text"
  node tokenizer.js decode "[id,id,id]"`);
  }
}

main()
