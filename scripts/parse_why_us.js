const fs = require('fs');

const html = fs.readFileSync('scripts/why_us.html', 'utf8');

// Extract all visible text snippets
const textBlocks = [];
const regex = />([^<]{15,})</g;
let match;
const seen = new Set();

while ((match = regex.exec(html)) !== null) {
  let text = match[1]
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

  // Filter out scripts/styles/json
  if (
    text.length >= 15 &&
    !seen.has(text) &&
    !text.startsWith('{"') &&
    !text.includes('var ') &&
    !text.includes('function(') &&
    !text.includes('@keyframes') &&
    !text.includes('__framer')
  ) {
    seen.add(text);
    textBlocks.push(text);
  }
}

fs.writeFileSync('scripts/why_us_text.json', JSON.stringify(textBlocks, null, 2), 'utf8');
console.log('Extracted', textBlocks.length, 'meaningful text blocks.');
textBlocks.forEach((t, i) => console.log(`${i + 1}. ${t}`));
