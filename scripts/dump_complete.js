const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'land_pages');
const slugs = [
  'broadway-residentials',
  'eden-crest',
  'idera-farm-city',
  'the-providence',
  'alabata',
  'moniya',
  'omu-epe',
  'afonja-boulevard',
  'vision-smart-city',
  'riyadh-golf-city',
  'almond-garden',
  'riyadh-tech-city',
  'the-castle'
];

const result = {};

for (const slug of slugs) {
  const p = path.join(dir, `${slug}.html`);
  if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, 'utf8');

  // Find all text blocks > 15 chars
  const rawMatches = html.match(/>([^<]{10,400})</g) || [];
  const lines = rawMatches.map(t => t.replace(/[><]/g, '').trim())
    .filter(t => !t.includes('{') && !t.includes('function') && !t.includes('var ') && !t.includes('Framer') && !t.includes('Cookie'));

  // Find specific images
  const imgs = [...new Set(html.match(/https:\/\/framerusercontent\.com\/images\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)/g) || [])]
    .filter(u => !u.includes('SOYxpOWeDRgswspC9laulqTxpsk') && !u.includes('ZYAfjeLZUp1ggGcxuCP4aM5zuE') && !u.includes('BGwA7NSi2t9fhyan2qNdQNdcN7o'));

  result[slug] = {
    slug,
    lines,
    imgs
  };
}

fs.writeFileSync('scripts/complete_land_dump.json', JSON.stringify(result, null, 2), 'utf8');
console.log('Saved scripts/complete_land_dump.json');
