const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'land_pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const projects = {};

for (const file of files) {
  const slug = file.replace('.html', '');
  const content = fs.readFileSync(path.join(dir, file), 'utf8');

  // Extract clean text snippets
  const textMatches = content.match(/>([^<]{2,120})</g) || [];
  const cleanTexts = textMatches.map(t => t.replace(/[><]/g, '').trim()).filter(t => t.length > 1);

  // Extract framer image URLs
  const imgRegex = /https:\/\/framerusercontent\.com\/images\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)/g;
  const images = [...new Set(content.match(imgRegex) || [])];

  // Search for prices: e.g. ₦, NGN, Million, M, ,000
  const priceSnippets = [];
  cleanTexts.forEach((t, i) => {
    if (t.includes('₦') || t.includes('Million') || t.toLowerCase().includes('price') || t.includes(',000') || t.toLowerCase().includes('initial deposit') || t.toLowerCase().includes('outright')) {
      priceSnippets.push(t);
    }
  });

  // Search for title documents
  const titleSnippets = [];
  cleanTexts.forEach((t) => {
    if (t.toLowerCase().includes('c of o') || t.toLowerCase().includes('governor') || t.toLowerCase().includes('survey') || t.toLowerCase().includes('deed') || t.toLowerCase().includes('excision') || t.toLowerCase().includes('gazette') || t.toLowerCase().includes('title')) {
      titleSnippets.push(t);
    }
  });

  // Search for plot sizes
  const sizeSnippets = [];
  cleanTexts.forEach((t) => {
    if (t.toLowerCase().includes('sqm') || t.toLowerCase().includes('plot') || t.toLowerCase().includes('acre') || t.toLowerCase().includes('hectare')) {
      sizeSnippets.push(t);
    }
  });

  projects[slug] = {
    slug,
    title: cleanTexts.slice(0, 30).find(t => t.length > 3 && !t.includes('Framer') && !t.includes('EVC') && !t.includes('Home')) || slug,
    cleanTextsSnippet: cleanTexts.slice(0, 50),
    priceSnippets: [...new Set(priceSnippets)],
    titleSnippets: [...new Set(titleSnippets)],
    sizeSnippets: [...new Set(sizeSnippets)],
    images: images.slice(0, 10),
  };
}

fs.writeFileSync('scripts/extracted_land_projects.json', JSON.stringify(projects, null, 2), 'utf8');
console.log('Saved scripts/extracted_land_projects.json');
for (const slug of Object.keys(projects)) {
  console.log(`\n=================== ${slug} ===================`);
  console.log('Title:', projects[slug].title);
  console.log('Prices:', projects[slug].priceSnippets.slice(0, 6));
  console.log('Titles:', projects[slug].titleSnippets.slice(0, 4));
  console.log('Sizes:', projects[slug].sizeSnippets.slice(0, 6));
  console.log('Image count:', projects[slug].images.length);
}
