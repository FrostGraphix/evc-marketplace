const fs = require('fs');

const products = require('./generated_land_products.json');

const code = `import { Category, ColorDef, ColorKey, DeliveryOption, DeliveryType, Product } from '@/types';

export const CFG = {
  name: 'EVC Nigeria',
  shortName: 'EVC',
  tagline: 'Experience Vision Creations — Real Estate & Land Marketplace',
  url: 'https://evcng.com',
  buyLandUrl: 'https://evcng.com/buy-land',
  phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '2347082938870',
  phoneDisp: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '+234 708 293 8870',
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contact@evcng.com',
  freeOver: 10000000,
  socials: {
    instagram: 'https://www.instagram.com/evc_ng/',
    x: 'https://x.com/evcnigeria',
    linkedin: 'https://www.linkedin.com/company/evc-nigeria/',
    youtube: 'https://www.youtube.com/@evcnigeria',
    facebook: 'https://www.facebook.com/evcnigeria',
    tiktok: 'https://www.tiktok.com/@evcnigeria',
  },
  offices: [
    {
      city: 'Ilorin',
      state: 'Kwara State',
      name: 'EVC Kwara Hub',
      address: 'Suite C1, Kajo Mall, Opposite Fresh Hotel, Fate / Plot 7A, Adelodun Road, Bodunde Street, Flower Garden G.R.A., Ilorin, Kwara State',
      phone: '+234 708 293 8870',
    },
    {
      city: 'Ibadan',
      state: 'Oyo State',
      name: 'EVC Oyo Experience Center',
      address: 'Plot 11, Oluyoro Avenue, Off Awolowo Road, Bodija, Ibadan, Oyo State',
      phone: '+234 708 293 8870',
    },
    {
      city: 'Abuja',
      state: 'FCT Abuja',
      name: 'EVC Corporate FCT',
      address: 'EVC Corporate / FCT Abuja',
      phone: '+234 708 293 8870',
    },
  ],
  delivery: {
    ilorin: {
      label: 'Kwara Hub Deed Dispatch',
      eta: '24 to 48 hours',
      fee: 0,
    },
    ibadan: {
      label: 'Oyo Hub Deed Dispatch',
      eta: '24 to 48 hours',
      fee: 0,
    },
    abuja: {
      label: 'Abuja Corporate Courier',
      eta: '24 to 72 hours',
      fee: 0,
    },
    nationwide: {
      label: 'Registered Nationwide Courier Delivery',
      eta: '3 to 5 working days',
      fee: 5000,
    },
    pickup: {
      label: 'Physical Collection at Regional EVC Office',
      eta: 'Immediate upon verification',
      fee: 0,
    },
  } as Record<DeliveryType, DeliveryOption>,
  bank: {
    name: process.env.NEXT_PUBLIC_BANK_NAME || 'Stanbic IBTC Bank',
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || '0049281726',
    accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'EVC Nigeria Technology Ltd',
  },
  promo: {
    code: 'EVC2026',
    pct: 5,
  },
};

export const STATES = [
  'Abuja (FCT)',
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

export const PAL: Record<ColorKey, ColorDef> = {
  orange: { n: 'EVC Orange', main: '#f26522', dark: '#c24912', light: '#ff8547', deep: '#872e05' },
  navy: { n: 'Deep Navy', main: '#0a1628', dark: '#040810', light: '#1e293b', deep: '#020617' },
  glow: { n: 'Solar Glow', main: '#ff7a33', dark: '#e05b14', light: '#ffa066', deep: '#b34106' },
  black: { n: 'Obsidian Black', main: '#03090a', dark: '#000000', light: '#1e293b', deep: '#010405' },
  ivory: { n: 'Architectural Ivory', main: '#f8fafc', dark: '#e2e8f0', light: '#ffffff', deep: '#cbd5e1' },
  gold: { n: 'Brass Gold', main: '#b8862e', dark: '#855d1a', light: '#deb868', deep: '#54390b' },
  blue: { n: 'Electric Blue', main: '#38bdf8', dark: '#0284c7', light: '#7dd3fc', deep: '#0369a1' },
  slate: { n: 'Anodized Slate', main: '#64748b', dark: '#334155', light: '#94a3b8', deep: '#1e293b' },
  brand: { n: 'EVC Orange', main: '#f26522', dark: '#c24912', light: '#ff8547', deep: '#872e05' },
  white: { n: 'Pure White', main: '#ffffff', dark: '#e2e8f0', light: '#ffffff', deep: '#cbd5e1' },
  silver: { n: 'Brushed Silver', main: '#cbd5e1', dark: '#94a3b8', light: '#f1f5f9', deep: '#64748b' },
  amber: { n: 'Solar Amber', main: '#f59e0b', dark: '#b45309', light: '#fcd34d', deep: '#78350f' },
  charcoal: { n: 'Charcoal Grey', main: '#1f2937', dark: '#111827', light: '#374151', deep: '#030712' },
  violet: { n: 'Electric Indigo', main: '#6366f1', dark: '#4338ca', light: '#a5b4fc', deep: '#312e81' },
  orchid: { n: 'Electric Orchid', main: '#c026d3', dark: '#86198f', light: '#f0abfc', deep: '#4a044e' },
  lilac: { n: 'Soft Lilac', main: '#a78bfa', dark: '#6d28d9', light: '#ede9fe', deep: '#4c1d95' },
  plum: { n: 'Royal Plum', main: '#6b21a8', dark: '#3b0764', light: '#d8b4fe', deep: '#1e0536' },
};

export const CATS: Category[] = [
  {
    id: 'residential-estates',
    name: 'Residential Land Estates',
    blurb: 'Master-planned residential communities, serviced land plots, perimeter fencing, and verified C of O documentation in Ilorin, Lagos & Ibadan.',
    art: ['estate', 'land', 'city'],
    cols: ['orange', 'navy', 'gold'],
    image: 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png',
  },
  {
    id: 'corridor-developments',
    name: 'Strategic Corridors',
    blurb: 'Prime economic corridors connecting Lagos, Ibadan, Ogun and Epe with massive upcoming road infrastructure and high capital appreciation.',
    art: ['estate', 'land', 'building'],
    cols: ['orange', 'glow', 'blue'],
    image: 'https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png',
  },
  {
    id: 'farmland-agricultural',
    name: 'Farmland & Agro-Cities',
    blurb: 'Large-scale surveyed agricultural farmland parcels with functional water sources, solar illumination, and agro-tourism appreciation in Oyo State.',
    art: ['farmland', 'estate'],
    cols: ['gold', 'slate', 'orange'],
    image: 'https://framerusercontent.com/images/9fqTXq8yaPPUtZzQt6YuOIWa4.png',
  },
  {
    id: 'housing-developments',
    name: 'Smart Housing & Apartments',
    blurb: 'Turn-key solar-powered apartments, executive studio flats, and communal residential housing in high student and executive demand zones.',
    art: ['building', 'estate'],
    cols: ['orange', 'glow', 'navy'],
    image: 'https://framerusercontent.com/images/kbRFYh9OoPZpzrl0d7cY7dJZGk8.png',
  },
  {
    id: 'smart-tech-cities',
    name: 'Smart Cities & Tech Enclaves',
    blurb: 'Technology-oriented residential and business hubs with planned fiber optic conduits, green energy zones, and 24/7 smart surveillance.',
    art: ['city', 'estate'],
    cols: ['blue', 'slate', 'black'],
    image: 'https://framerusercontent.com/images/AONfpWfc0Kh6HV9vx9KFwgjydxg.png',
  },
  {
    id: 'sold-out',
    name: 'Sold Out Developments',
    blurb: 'Archived landmark EVC projects—100% subscribed and delivered to proud property owners and institutional investors.',
    art: ['estate', 'city'],
    cols: ['black', 'orange', 'slate'],
    image: 'https://framerusercontent.com/images/0YhBffpM2P1Z00k96j40F2r9LpA.png',
  },
  // Backward compatibility alias IDs
  {
    id: 'all',
    name: 'All Land & Estates',
    blurb: 'Browse all active verified land projects and archived developments across Kwara, Oyo, Lagos, and Ogun States.',
    art: ['estate', 'land'],
    cols: ['orange', 'navy', 'gold'],
    image: 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png',
  },
  {
    id: 'smart-living',
    name: 'Residential Land Estates',
    blurb: 'Master-planned residential communities, serviced land plots, and verified C of O documentation.',
    art: ['estate', 'land'],
    cols: ['orange', 'navy'],
    image: 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png',
  },
  {
    id: 'solar-energy',
    name: 'Smart Housing & Apartments',
    blurb: 'Turn-key solar-powered apartments and serviced communal developments.',
    art: ['building'],
    cols: ['orange', 'glow'],
    image: 'https://framerusercontent.com/images/kbRFYh9OoPZpzrl0d7cY7dJZGk8.png',
  },
  {
    id: 'architectural',
    name: 'Strategic Corridors',
    blurb: 'High-growth investment corridors spanning Lagos, Ibadan, Ogun & Epe.',
    art: ['estate'],
    cols: ['black', 'gold'],
    image: 'https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png',
  },
  {
    id: 'furniture',
    name: 'Farmland & Agro-Cities',
    blurb: 'Surveyed agricultural farmland parcels with functional water sources.',
    art: ['farmland'],
    cols: ['gold', 'slate'],
    image: 'https://framerusercontent.com/images/9fqTXq8yaPPUtZzQt6YuOIWa4.png',
  },
  {
    id: 'infrastructure',
    name: 'Smart Cities & Tech Enclaves',
    blurb: 'Technology-oriented residential and business hubs.',
    art: ['city'],
    cols: ['blue', 'slate'],
    image: 'https://framerusercontent.com/images/AONfpWfc0Kh6HV9vx9KFwgjydxg.png',
  },
  {
    id: 'lifestyle',
    name: 'Sold Out Developments',
    blurb: 'Archived landmark EVC projects—100% subscribed.',
    art: ['estate'],
    cols: ['orange', 'black'],
    image: 'https://framerusercontent.com/images/0YhBffpM2P1Z00k96j40F2r9LpA.png',
  },
];

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export function byId(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function bySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function catOf(catId: string): Category {
  const found = CATS.find((c) => c.id === catId);
  return (
    found || {
      id: catId,
      name: catId.replace('-', ' '),
      blurb: 'Verified EVC Nigeria property investments and real estate developments.',
      art: ['estate'],
      cols: ['orange', 'navy'],
      image: 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png',
    }
  );
}

export function searchProducts(q: string, cat?: string): Product[] {
  const query = q.toLowerCase().trim();
  return PRODUCTS.filter((p) => {
    const matchesCat =
      !cat ||
      cat === 'all' ||
      p.cat === cat ||
      (cat === 'sold-out' && (p.status === 'sold_out' || p.status === 'archived' || p.badge === 'SOLD OUT')) ||
      (cat === 'active' && p.status === 'active');
    if (!matchesCat) return false;
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query) ||
      p.feat.some((f) => f.toLowerCase().includes(query)) ||
      (p.badge && p.badge.toLowerCase().includes(query)) ||
      (p.sizes && p.sizes.some((s) => s.toLowerCase().includes(query)))
    );
  });
}
`;

fs.writeFileSync('src/lib/products.ts', code, 'utf8');
console.log('Successfully updated src/lib/products.ts with 13 authentic EVC land projects!');
