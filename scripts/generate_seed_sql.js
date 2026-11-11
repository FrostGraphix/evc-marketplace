const fs = require('fs');
const path = require('path');

const products = require('./generated_land_products.json');

const categories = [
  {
    id: 'residential-estates',
    name: 'Residential Land Estates',
    blurb: 'Master-planned residential communities, serviced land plots, perimeter fencing, and verified C of O documentation in Ilorin, Lagos & Ibadan.',
    art: ['estate', 'land', 'city'],
    colors: ['orange', 'navy', 'gold'],
    image: 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png'
  },
  {
    id: 'corridor-developments',
    name: 'Strategic Corridors',
    blurb: 'Prime economic corridors connecting Lagos, Ibadan, Ogun and Epe with massive upcoming road infrastructure and high capital appreciation.',
    art: ['estate', 'land', 'building'],
    colors: ['orange', 'glow', 'blue'],
    image: 'https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png'
  },
  {
    id: 'farmland-agricultural',
    name: 'Farmland & Agro-Cities',
    blurb: 'Large-scale surveyed agricultural farmland parcels with functional water sources, solar illumination, and agro-tourism appreciation in Oyo State.',
    art: ['farmland', 'estate'],
    colors: ['gold', 'slate', 'orange'],
    image: 'https://framerusercontent.com/images/9fqTXq8yaPPUtZzQt6YuOIWa4.png'
  },
  {
    id: 'housing-developments',
    name: 'Smart Housing & Apartments',
    blurb: 'Architectural residential developments, luxury modern bungalows, and serviced smart duplexes equipped with solar microgrids.',
    art: ['building', 'estate'],
    colors: ['orange', 'slate', 'black'],
    image: 'https://framerusercontent.com/images/blOJPGX0VAy46Sr0PkBkZ0Bh30.png'
  },
  {
    id: 'smart-tech-cities',
    name: 'Smart Cities & Tech Enclaves',
    blurb: 'High-tech residential and innovation districts planned for technology professionals, renewable power, and fiber optic connectivity.',
    art: ['city', 'building'],
    colors: ['blue', 'orange', 'navy'],
    image: 'https://framerusercontent.com/images/T6j9XjxzmbLmuO8ygeXmh8pJNEM.png'
  },
  {
    id: 'sold-out',
    name: 'Sold Out Developments',
    blurb: 'Completed and fully allocated landmark estates reflecting EVC’s proven track record of timely delivery and exponential value appreciation.',
    art: ['estate', 'city'],
    colors: ['slate', 'black', 'orange'],
    image: 'https://framerusercontent.com/images/wi76o9N6YnJ4vWkK4i4N30o3L10.png'
  }
];

function escapeSql(str) {
  if (str === null || str === undefined) return 'null';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeArray(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return 'array[]::text[]';
  const items = arr.map(item => `'${String(item).replace(/'/g, "''")}'`);
  return `array[${items.join(', ')}]`;
}

let seedSql = `-- =========================================================================
-- EVC Nigeria Marketplace — Official Supabase Seed Data
-- Database: unuhnhknczcgxqaekzrh
-- URL: https://unuhnhknczcgxqaekzrh.supabase.co
-- Extracted directly from evcng.com/buy-land and evcng.com/why-us
-- =========================================================================

-- 1. Insert Categories
`;

categories.forEach(cat => {
  seedSql += `INSERT INTO public.categories (id, name, blurb, art, colors, image) VALUES (
  ${escapeSql(cat.id)},
  ${escapeSql(cat.name)},
  ${escapeSql(cat.blurb)},
  ${escapeArray(cat.art)},
  ${escapeArray(cat.colors)},
  ${escapeSql(cat.image)}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  blurb = EXCLUDED.blurb,
  art = EXCLUDED.art,
  colors = EXCLUDED.colors,
  image = EXCLUDED.image;

`;
});

seedSql += `\n-- 2. Insert Canonical Land Products & Developments\n`;

products.forEach(p => {
  const isActive = p.status !== 'archived' && p.status !== 'draft';
  seedSql += `INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  ${p.id},
  ${escapeSql(p.name)},
  ${escapeSql(p.slug || '')},
  ${escapeSql(p.cat)},
  ${p.price},
  ${p.was ? p.was : 'null'},
  ${escapeSql(p.art || 'estate')},
  ${escapeArray(p.colors)},
  ${escapeArray(p.sizes)},
  ${escapeSql(p.badge)},
  ${escapeSql(p.desc)},
  ${escapeArray(p.feat)},
  ${escapeArray(p.images)},
  ${p.stock || 20},
  ${escapeSql(p.status || 'active')},
  ${isActive}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  cat = EXCLUDED.cat,
  price = EXCLUDED.price,
  was = EXCLUDED.was,
  art = EXCLUDED.art,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  badge = EXCLUDED.badge,
  "desc" = EXCLUDED."desc",
  feat = EXCLUDED.feat,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active;

`;
});

fs.writeFileSync(path.join(__dirname, '../supabase/seed.sql'), seedSql, 'utf8');
console.log('✅ Updated supabase/seed.sql successfully!');
