# Simple JavaScript Tokenizer (Node CLI)

A minimal **custom tokenizer** written in JavaScript for Node.js, that:

- **Learns vocabulary** from a given text corpus.
- **Encodes** text into token IDs.
- **Decodes** token IDs back into text.
- Supports **special tokens**:
  - `<PAD>` — padding  
  - `<UNK>` — unknown token  
  - `<START>` — start of sequence  
  - `<END>` — end of sequence  


## 📦 Setup

1. Make sure you have **Node.js** installed.
2. Clone or download this project.
3. Place your learning corpus in a file named `corpus.txt`.
4. Run the learning command to generate or update the vocabulary file.


## 🚀 Usage

### **Learn Vocabulary**
From `corpus.txt`:
```bash
node tokenizer.js learn corpus.txt
# Vocabulary learned and saved. Vocabulary size: 178
```

---

### **Encode Text → Token IDs**
```bash
node tokenizer.js encode "Welcome to chai aur code"
# Encoded: [ 2, 24, 25, 130, 165, 105, 3 ]
```

---

### **Decode Token IDs → Text**
```bash
node tokenizer.js decode "[2,167,168,169,40,106,3]"
# Decoded: learning generative ai in javascript
```

---

## Example Workflow
```bash
# Learn vocabulary
node tokenizer.js learn corpus.txt  

# Encode a sentence
node tokenizer.js encode "chai aur code is awesome"

# Decode token IDs back to text
node tokenizer.js decode "[2,90,45,102,87,3]"
```

***

## 📂 Project Files
- `tokenizer.js` — main CLI tokenizer script.
- `corpus.txt` — sample training text.
- `vocab.json` — generated vocabulary mapping words → token IDs.
- `README.md` — project documentation.

***

## 🛠 Notes
- You can re-run the **learn** command to update `vocab.json` with new words.
- Unknown words in `encode` will be mapped to `<UNK>`.
- Start and end tokens are always automatically added in encoding.
