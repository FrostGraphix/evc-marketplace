const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (loc.startsWith('/')) loc = 'https://evcng.com' + loc;
        return fetchUrl(loc).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

const projects = [
  'broadway-residentials',
  'eden-crest',
  'idera-farm-city',
  'the-providence',
  'afonja-boulevard',
  'vision-smart-city',
  'riyadh-golf-city',
  'almond-garden',
  'riyadh-tech-city',
  'the-castle',
  'alabata',
  'moniya',
  'omu-epe'
];

async function main() {
  const dir = path.join(__dirname, 'land_pages');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const slug of projects) {
    const url = `https://evcng.com/${slug}`;
    console.log(`Fetching ${url}...`);
    try {
      const html = await fetchUrl(url);
      fs.writeFileSync(path.join(dir, `${slug}.html`), html, 'utf8');
      console.log(`Saved ${slug}.html (${html.length} bytes)`);
    } catch (e) {
      console.error(`Failed ${slug}:`, e.message);
    }
  }
}

main();
