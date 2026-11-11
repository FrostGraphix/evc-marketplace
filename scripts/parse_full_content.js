const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'land_pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const details = {};

for (const file of files) {
  const slug = file.replace('.html', '');
  const html = fs.readFileSync(path.join(dir, file), 'utf8');

  // Extract paragraphs or sentences
  const textMatches = html.match(/>([^<]{20,300})</g) || [];
  const cleanTexts = [...new Set(textMatches.map(t => t.replace(/[><]/g, '').trim()))]
    .filter(t => !t.includes('function') && !t.includes('{') && !t.includes('Framer') && !t.includes('Cookies') && !t.includes('window.'));

  // Extract framer images
  const imgMatches = html.match(/https:\/\/framerusercontent\.com\/images\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)/g) || [];
  const images = [...new Set(imgMatches)];

  details[slug] = {
    slug,
    texts: cleanTexts.slice(0, 20),
    images: images.slice(0, 8),
  };
}

fs.writeFileSync('scripts/detailed_land_content.json', JSON.stringify(details, null, 2), 'utf8');
console.log('Saved scripts/detailed_land_content.json');
