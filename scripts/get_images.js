const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'land_pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const projectImages = {};

for (const file of files) {
  const slug = file.replace('.html', '');
  const html = fs.readFileSync(path.join(dir, file), 'utf8');

  // Look for large images or srcsets from framer
  const matches = [...html.matchAll(/https:\/\/framerusercontent\.com\/images\/([a-zA-Z0-9_-]+)\.(jpg|jpeg|png|webp)/g)];
  // Filter out tiny icons (SOYxpOWeDRgswspC9laulqTxpsk is usually logo or icon)
  const uniqueUrls = [...new Set(matches.map(m => m[0]))].filter(url => 
    !url.includes('SOYxpOWeDRgswspC9laulqTxpsk') && 
    !url.includes('ZYAfjeLZUp1ggGcxuCP4aM5zuE') &&
    !url.includes('BGwA7NSi2t9fhyan2qNdQNdcN7o')
  );

  projectImages[slug] = uniqueUrls;
}

console.log('Project images:');
for (const [k, v] of Object.entries(projectImages)) {
  console.log(k, v.length, 'images:', v.slice(0, 3));
}
fs.writeFileSync('scripts/project_images.json', JSON.stringify(projectImages, null, 2), 'utf8');
