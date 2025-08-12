import fs from "node:fs/promises"

const SPECIAL_TOKENS = ["<PAD>", "<UNK>", "<START>", "<END>"]

// Util Function
async function saveVocab(vocab, path = "vocab.json") {
  await fs.writeFile(path, JSON.stringify(vocab, null, 2))
}

async function loadVocab(invVocal = false, path = "vocab.json") {
  const raw = await fs.readFile(path, "utf-8")
  const vocab = JSON.parse(raw)

  if(!invVocal) return new Map(Object.entries(vocab))

  return Object.entries(vocab).reduce((mapObj, [key, value ]) => {
    mapObj.set(value, key)
    return mapObj
  }, new Map())
}

function spiltAndFilterSentence(sentence) {
  return sentence.replaceAll("\n", " ").split(" ").filter(Boolean).map(value => value.toLowerCase())
}


// Learn Vocabulary from the corpus
async function learnVocab(corpusFile) {
  const raw = await fs.readFile(corpusFile, "utf-8")
  const words = new Set(spiltAndFilterSentence(raw))

  const vocab = new Map()
  let idx = 0;

  SPECIAL_TOKENS.forEach(token => vocab.set(token, idx++))

  words.forEach(word => {
    if (vocab.has(word)) return
    vocab.set(word, idx++)
  })
  
  saveVocab(Object.fromEntries(vocab))

  console.log(`Vocabulary learned and saved, Vocabulary size ${vocab.size}`);
}


// Encode text into token ids
async function encode(userQuery) {
  const vocab = await loadVocab()
  const tokens = []
  
  tokens.push(vocab.get("<START>"))
  spiltAndFilterSentence(userQuery).forEach(word => {
    if (vocab.has(word))
      tokens.push(vocab.get(word))
    else tokens.push(vocab.get("<UNK>"))
  })
  tokens.push(vocab.get("<END>"))

  console.log("Encoded:", tokens);
  return tokens;
}


async function decode(ids) {
  const invVocab = await loadVocab(true)
  // console.log(vocab)
  const words = ids.map(id => invVocab.get(id) ?? "<UNK>");
  // Remove <START> and <END> for output
  const output = words.filter(w => !["<START>", "<END>", "<PAD>"].includes(w)).join(' ');
  console.log("Decoded:", output);
  return output;
}


// Simple CLI
const [,, command, arg] = process.argv


switch (command) {
  case "learn": 
    await learnVocab(arg)
    break;
  case "encode":
    await encode(arg)
    break;
  case "decode":
    const ids = (arg || "").replace((/(\[|\])+/g), "").split(",").map(Number)
    await decode(ids)
    break
  default:
    console.log(`Usage: node tokenizer.js [ train corpus.txt | encode "text" | decode "[idx, idx, idx]" ]`)
    break; 
}
