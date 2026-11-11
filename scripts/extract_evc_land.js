const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('Fetching https://evcng.com/buy-land...');
    const html = await fetchUrl('https://evcng.com/buy-land');
    fs.writeFileSync('scripts/live_buy_land.html', html, 'utf8');
    console.log('Saved scripts/live_buy_land.html, length:', html.length);

    // Extract links
    const regex = /href=["']([^"']+)["']/g;
    let match;
    const links = new Set();
    while ((match = regex.exec(html)) !== null) {
      links.add(match[1]);
    }
    console.log('All links found in buy-land:');
    for (const l of links) {
      if (!l.startsWith('#') && !l.startsWith('tel:') && !l.startsWith('mailto:')) {
        console.log(' -', l);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
