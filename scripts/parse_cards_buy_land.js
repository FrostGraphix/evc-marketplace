const fs = require('fs');

const html = fs.readFileSync('scripts/live_buy_land.html', 'utf8');

// Find all image tags or backgroundImage or framer picture elements and their nearest text
const cardMatches = [...html.matchAll(/href=["']\.\/([a-z0-9-]+)["'][^>]*>([\s\S]*?)<\/a>/g)];
console.log('Found', cardMatches.length, 'card links on buy-land:');

const cardData = [];
cardMatches.forEach(m => {
  const slug = m[1];
  const inner = m[2];
  const imgs = [...inner.matchAll(/https:\/\/framerusercontent\.com\/images\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)/g)].map(x => x[0]);
  const texts = [...inner.matchAll(/>([^<]+)</g)].map(x => x[1].trim()).filter(x => x.length > 1);
  cardData.push({ slug, imgs: [...new Set(imgs)], texts });
});

console.log(JSON.stringify(cardData, null, 2));
