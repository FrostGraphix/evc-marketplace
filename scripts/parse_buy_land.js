const fs = require('fs');

const html = fs.readFileSync('scripts/live_buy_land.html', 'utf8');

// In Framer sites, data is embedded in scripts or text. Let's find project names, prices, tags, and "sold out" text.
const textMatches = html.match(/>([^<]{3,100})</g) || [];
const cleanText = textMatches.map(t => t.replace(/[><]/g, '').trim()).filter(t => t.length > 2);

console.log('Clean text snippet around "sold" or "out":');
cleanText.forEach((t, i) => {
  if (t.toLowerCase().includes('sold') || t.toLowerCase().includes('out') || t.toLowerCase().includes('active') || t.toLowerCase().includes('available') || t.toLowerCase().includes('sqm') || t.toLowerCase().includes('₦') || t.toLowerCase().includes('naira')) {
    console.log(`[${i}]`, t, '--- Context:', cleanText.slice(Math.max(0, i-3), i+4).join(' | '));
  }
});
