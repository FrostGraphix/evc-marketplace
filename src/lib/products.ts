import { Category, ColorDef, ColorKey, DeliveryOption, DeliveryType, Product } from '@/types';

export const CFG = {
  name: 'EVC Nig. Ltd',
  shortName: 'EVC',
  tagline: 'Experience Vision Creations — Real Estate & Land Marketplace',
  url: 'https://evcng.com',
  buyLandUrl: 'https://evcng.com/buy-land',
  whyUsUrl: 'https://evcng.com/why-us',
  phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '2347082938870',
  phoneDisp: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '+234 708 293 8870',
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contact@evcng.com',
  freeOver: 10000000,
  whyUs: {
    vision: 'To be a Real Estate Magnate in the Nigerian industry propelled by Crafts, Expertise & innovation.',
    mission: 'To redefine the concepts of comfort and expertise locally through a global compass bearing in mind luxury and affordability.',
    allInOne: 'EVC excels as a Land and Construction company due to our unique blend of expertise in property acquisition, development and building, providing clients with a seamless, all-in-one solution for their real estate needs.',
    pillars: [
      {
        id: 'affordability',
        title: 'Affordability & Flexible Installments',
        desc: 'Begin your home ownership journey on a budget and ease you have never seen before with our structured installment plans and convenient payment methods tailored for both young and old.',
      },
      {
        id: 'expert-engagements',
        title: 'Expert Engagements',
        desc: 'With the help of our trained and experienced property consultants, be assured you are in safe, verified hands every step of the way.',
      },
      {
        id: 'valuable-information',
        title: 'Valuable Information & Market Trends',
        desc: 'Our professionals have the nose for details and a penchant for the next big growth wave. Deep industry insights and corridor trends will surely be at your advantage with EVC on board.',
      },
      {
        id: 'strategic-investments',
        title: 'Strategic Investments & Prime Locations',
        desc: 'Location is indispensable in real estate. We understand growth corridors and play strictly by the rules always to guarantee your fulfillment and assured prosperity.',
      },
    ],
    leadership: [
      {
        name: 'Engr. Fola Oyedeji',
        role: 'Executive Directorate',
        desc: 'Pioneering strategic infrastructure and high-yield real estate acquisitions.',
      },
      {
        name: 'Babatunde Mahmud',
        role: 'Operations Manager',
        desc: 'Directing estate layout demarcations, site operations, and logistical excellence.',
      },
      {
        name: 'Olumide Olubori',
        role: 'Property & Procurement Manager',
        desc: 'Securing prime acreage, legal title verifications, and development materials.',
      },
      {
        name: 'Oluwaseun Akinola',
        role: 'Sales Team Lead',
        desc: 'Guiding clients through transparent allocations, investment matching, and deed dispatch.',
      },
    ],
    testimonials: [
      {
        quote: 'EVC’s payment plan is transparent, effective and accommodative, and also feasible to both young and old. It has helped a lot of people become landowners and reduced the rate of homelessness. Thank you, EVC!',
        author: 'CEO',
        role: 'Tech Innovations',
      },
      {
        quote: '‘You no get property for yourself ke? Oya rush to EVC and you will never regret it’. EVC is the best when it comes to real estate. I love the fact that they make the real estate market easy for everyone. The go-to brand when it comes to everything investment.',
        author: 'Hussaini Khadijat',
        role: 'Private Investor',
      },
      {
        quote: 'EVC exhibits leading qualities in their field which makes them stand out with their expertise and reputation in real estate, reflecting high standards and reliability which makes them an exceptional brand to reckon with.',
        author: 'Lead Designer',
        role: 'Dynamics Agency',
      },
      {
        quote: 'EVC stands out for their commitment to excellence and I’m a huge fan of their work! EVC truly deserves recognition for their hard work and dedication to making lives better. I’m excited to see what the future holds for this exceptional brand.',
        author: 'Founder',
        role: 'Mobile Dynamics Startup',
      },
    ],
  },
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
      address: 'Plot 7A, Adelodun Road, Bodunde Street Flower Garden G.R.A, Ilorin, Kwara State',
      phone: '+234 708 293 8870',
    },
    {
      city: 'Ibadan',
      state: 'Oyo State',
      name: 'EVC Oyo Experience Center',
      address: 'Plot 11, Oluyoro Avenue, Off Awolowo Rd, Bodija, Ibadan, Oyo State',
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
      label: 'Nationwide Registered Courier (Abuja)',
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
    accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'EVC Nig. Ltd',
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
  ivory: { n: 'Architectural Ivory', main: '#eae8e1', dark: '#dedcd3', light: '#eae8e1', deep: '#c8c6be' },
  gold: { n: 'Brass Gold', main: '#b8862e', dark: '#855d1a', light: '#deb868', deep: '#54390b' },
  blue: { n: 'Electric Blue', main: '#38bdf8', dark: '#0284c7', light: '#7dd3fc', deep: '#0369a1' },
  slate: { n: 'Anodized Slate', main: '#64748b', dark: '#334155', light: '#94a3b8', deep: '#1e293b' },
  brand: { n: 'EVC Orange', main: '#f26522', dark: '#c24912', light: '#ff8547', deep: '#872e05' },
  white: { n: 'Warm Ivory', main: '#eae8e1', dark: '#dedcd3', light: '#eae8e1', deep: '#cbd5e1' },
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

export const PRODUCTS: Product[] = [
  {
    "id": 1,
    "name": "Afonja Boulevard District 1",
    "slug": "afonja-boulevard",
    "cat": "residential-estates",
    "price": 1800000,
    "was": 1500000,
    "art": "estate",
    "colors": [
      "orange",
      "navy",
      "gold",
      "slate"
    ],
    "sizes": [
      "300 SQM (₦1.8M - Dep ₦300K)",
      "500 SQM (₦3M - Dep ₦500K)",
      "1 Acre Residential (₦10.8M)",
      "1 Acre Commercial (₦18M)"
    ],
    "badge": "C of O in View",
    "desc": "Embodying the future of urban lifestyle where visionary design and cutting-edge infrastructure converge. Afonja Boulevard District 1 is strategically located in Oke Oyi, Ilorin, offering 100% dry table land, modern road networks, commercial zones, and rapid capital appreciation in the Kwara State growth corridor.",
    "feat": [
      "Title: C of O in View",
      "Free Provisional Survey (in client’s name)",
      "Registered Deed of Assignment",
      "Location: Oke Oyi, Ilorin, Kwara State",
      "100% Dry Table Land ready for immediate building",
      "300 SQM: ₦1,800,000 (Initial Deposit: ₦300,000)",
      "500 SQM: ₦3,000,000 (Initial Deposit: ₦500,000)",
      "1 Acre Residential: ₦10,800,000 (Initial Deposit: ₦1.8M)",
      "1 Acre Commercial: ₦18,000,000 (Initial Deposit: ₦3M)",
      "Flexible payment plans up to 12 months",
      "Perimeter fencing & modern gatehouse layout"
    ],
    "images": [
      "/images/projects/afonja-boulevard.png",
      "https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png",
      "https://framerusercontent.com/images/blOJPGX0VAy46Sr0PkBkZ0Bh30.png",
      "https://framerusercontent.com/images/T6j9XjxzmbLmuO8ygeXmh8pJNEM.png"
    ],
    "stock": 24,
    "status": "active"
  },
  {
    "id": 2,
    "name": "Broadway Residentials",
    "slug": "broadway-residentials",
    "cat": "housing-developments",
    "price": 2000000,
    "was": 2500000,
    "art": "building",
    "colors": [
      "orange",
      "glow",
      "navy",
      "black"
    ],
    "sizes": [
      "300 SQM Land (₦2M)",
      "500 SQM Land (₦3.2M)",
      "Room & Parlour Studio Flat (₦25M)",
      "2 Bedroom Bungalow (₦45M)"
    ],
    "badge": "Solar Powered Estate",
    "desc": "Granting access to smarter communal living in the high-demand host community of Kwara State University (KWASU), Malete. Broadway Residentials combines serviced residential plots with turn-key, solar-powered apartments delivering guaranteed high student and executive rental yields.",
    "feat": [
      "Title: Certificate of Occupancy (C of O)",
      "Free Provisional Survey & Registered Deed of Assignment",
      "Location: Malete, Kwara State University (KWASU Corridor)",
      "Solar-powered uninterrupted clean electricity estate grid",
      "Land Plots: 300 SQM (₦2M), 500 SQM (₦3.2M)",
      "Room & Parlour Studio Apartment: ₦25,000,000",
      "2 Bedroom Luxury Bungalow: ₦45,000,000",
      "Initial deposit: ₦2,000,000 for housing units",
      "High rental yield from university student & faculty influx",
      "Paved access roads, drainage systems, and 24/7 security patrol"
    ],
    "images": [
      "/images/projects/broadway-2bed.png",
      "/images/projects/broadway-studio.png",
      "https://framerusercontent.com/images/kbRFYh9OoPZpzrl0d7cY7dJZGk8.png",
      "https://framerusercontent.com/images/4Tb7BuM5ZXAEoaIlC9k8xdoug.png"
    ],
    "stock": 15,
    "status": "active"
  },
  {
    "id": 3,
    "name": "Eden Crest",
    "slug": "eden-crest",
    "cat": "residential-estates",
    "price": 3000000,
    "was": 2500000,
    "art": "estate",
    "colors": [
      "gold",
      "orange",
      "navy",
      "ivory"
    ],
    "sizes": [
      "300 SQM (₦3M - Dep ₦500K)",
      "500 SQM (₦4.8M - Dep ₦1M)",
      "1,000 SQM (₦9.6M - Dep ₦1M)",
      "1 Acre / 300 SQM (₦15M - Dep ₦3M)",
      "1 Acre / 500 SQM (₦24M - Dep ₦5M)",
      "1 Acre / 1000 SQM (₦48M - Dep ₦10M)"
    ],
    "badge": "Lagos-Ibadan Corridor",
    "desc": "Where every sunrise signals opportunity. Eden Crest is a premium residential development situated along the Siun Interchange / Abeokuta Expressway. Designed to re-awaken heritage and luxury living, it delivers the strategic dual benefit of Lagos-Ibadan expressway connectivity and exceptional land appreciation.",
    "feat": [
      "Title: C of O in View",
      "Free Provisional Survey (in client’s name) & Deed of Assignment",
      "Location: Siun Interchange / Abeokuta Expressway",
      "100% Dry Table Land with zero flood risk",
      "300 SQM: ₦3,000,000 (Initial Deposit: ₦500,000)",
      "500 SQM: ₦4,800,000 (Initial Deposit: ₦1,000,000)",
      "1,000 SQM: ₦9,600,000 (Initial Deposit: ₦1,000,000)",
      "Acre Packages: 300 SQM Acre (₦15M), 500 SQM Acre (₦24M), 1000 SQM Acre (₦48M)",
      "Perimeter fencing & gated security architecture",
      "Instant allocation upon completion of initial commitments"
    ],
    "images": [
      "/images/projects/eden-crest.png",
      "/images/projects/eden-crest-price.png",
      "https://framerusercontent.com/images/IkRFbDpoMDnpxsbQDOf9zBhK8EQ.png",
      "https://framerusercontent.com/images/dUZvASmZvj4xtZCZLjLr0yAXm4.png"
    ],
    "stock": 30,
    "status": "active"
  },
  {
    "id": 4,
    "name": "Idera Farm City",
    "slug": "idera-farm-city",
    "cat": "farmland-agricultural",
    "price": 4500000,
    "was": 3000000,
    "art": "farmland",
    "colors": [
      "gold",
      "slate",
      "orange",
      "ivory"
    ],
    "sizes": [
      "500 SQM Smart Farming (₦4.5M)",
      "1,000 SQM Smart Farming (₦9M)",
      "3,000 SQM Smart Farming (₦27M)"
    ],
    "badge": "Farmland & Agro-City",
    "desc": "“Idera” meaning Ease, Peace & Relief. Located in Ado Awaye, Iseyin, Oyo State, near the famed suspended lake. IDERA FARMS is more than farmland—it is an inter-generational gateway into food security wealth, commercial agriculture, and high land appreciation with functional water sources and solar street lighting.",
    "feat": [
      "Title: C of O in View & Surveyed Farmland Parcels",
      "Free Provisional Survey (in client’s name) & Registered Deed",
      "Location: Ado Awaye, Iseyin, Oyo State (Agro-tourism corridor)",
      "500 SQM Smart Farming: ₦4,500,000",
      "1,000 SQM Smart Farming: ₦9,000,000",
      "3,000 SQM Smart Farming: ₦27,000,000",
      "Functional year-round agricultural water source & irrigation layout",
      "Solar-powered perimeter lighting and security guard posts",
      "Direct farm-to-market road access connecting Oyo and Ibadan"
    ],
    "images": [
      "/images/projects/idera-farm-city.png",
      "https://framerusercontent.com/images/9fqTXq8yaPPUtZzQt6YuOIWa4.png",
      "https://framerusercontent.com/images/t86q15iDhqlSTXV3YErgDQDegNE.png",
      "https://framerusercontent.com/images/G9uTJ1zaMXb8x7hYRKfrQQlu8c.png"
    ],
    "stock": 45,
    "status": "active"
  },
  {
    "id": 5,
    "name": "The Providence — Alabata (Abeokuta)",
    "slug": "the-providence-alabata",
    "cat": "corridor-developments",
    "price": 1200000,
    "was": 800000,
    "art": "estate",
    "colors": [
      "orange",
      "slate",
      "navy",
      "gold"
    ],
    "sizes": [
      "300 SQM (₦1.2M - Dep ₦300K)",
      "500 SQM (₦2M - Dep ₦500K)",
      "1,000 SQM (₦4M - Dep ₦1M)"
    ],
    "badge": "100% Dry Land",
    "desc": "Tucked between nature and promise. The Providence Alabata, Abeokuta (Ogun State) brings envisioned comfort into reality along the strategic Abeokuta-Ibadan expressway. An accessible investment corridor boasting 100% dry terrain, serene green views, and verified title documentation.",
    "feat": [
      "Title: C of O in View",
      "Free Provisional Survey & Registered Deed of Assignment",
      "Location: Alabata, Abeokuta, Ogun State",
      "100% dry terrain with immediate layout demarcation",
      "300 SQM: ₦1,200,000 (Initial Deposit: ₦300,000)",
      "500 SQM: ₦2,000,000 (Initial Deposit: ₦500,000)",
      "1,000 SQM: ₦4,000,000 (Initial Deposit: ₦1,000,000)",
      "Direct connectivity to Abeokuta metropolitan center and federal highway"
    ],
    "images": [
      "/images/projects/tp-alabata.png",
      "https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png",
      "https://framerusercontent.com/images/UXVhgcUSulXRvYzGZCmtJTbzHw.png",
      "https://framerusercontent.com/images/95oFgmJhGUmueUW57ndCFE0pNBY.png"
    ],
    "stock": 20,
    "status": "active"
  },
  {
    "id": 6,
    "name": "The Providence — Moniya (Ibadan)",
    "slug": "the-providence-moniya",
    "cat": "corridor-developments",
    "price": 2400000,
    "was": 2000000,
    "art": "estate",
    "colors": [
      "orange",
      "navy",
      "gold",
      "ivory"
    ],
    "sizes": [
      "300 SQM (₦2.4M - Dep ₦500K)",
      "450 SQM (₦3.6M - Dep ₦500K)",
      "600 SQM (₦4.8M - Dep ₦1M)"
    ],
    "badge": "Train Station Hub",
    "desc": "Planting your dreams on solid grounds! Situated in Moniya, Akinyele Local Government, Ibadan—the epicentre of Oyo State’s modern transportation network. Minutes from the Obafemi Awolowo Train Station, Inland Dry Port, and the Ibadan Circular Road.",
    "feat": [
      "Title: C of O in View",
      "Free Provisional Survey & Deed of Assignment in client’s name",
      "Location: Moniya, Akinyele LGA, Ibadan, Oyo State",
      "Proximity to Moniya Train Terminal & Ibadan Circular Road",
      "300 SQM: ₦2,400,000 (Initial Deposit: ₦500,000)",
      "450 SQM: ₦3,600,000 (Initial Deposit: ₦500,000)",
      "600 SQM: ₦4,800,000 (Initial Deposit: ₦1,000,000)",
      "Fast-track capital appreciation backed by massive state infrastructure"
    ],
    "images": [
      "/images/projects/tp-moniya.png",
      "https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png",
      "https://framerusercontent.com/images/UXVhgcUSulXRvYzGZCmtJTbzHw.png",
      "https://framerusercontent.com/images/95oFgmJhGUmueUW57ndCFE0pNBY.png"
    ],
    "stock": 18,
    "status": "active"
  },
  {
    "id": 7,
    "name": "The Providence — Omu, Epe (Lagos)",
    "slug": "the-providence-omu-epe",
    "cat": "corridor-developments",
    "price": 2250000,
    "was": 2900000,
    "art": "estate",
    "colors": [
      "orange",
      "blue",
      "navy",
      "gold"
    ],
    "sizes": [
      "300 SQM (₦2.25M)",
      "500 SQM (₦3.75M)",
      "1000 SQM (₦7.5M)",
      "1 Acre (₦13.5M)"
    ],
    "badge": "Lagos Epe Hub",
    "desc": "Enjoy Lagos access without the stress! Located in Omu, Epe—the emerging goldmine of new Lagos. Positioned within rapid reach of the Lekki-Epe expressway, the proposed Lekki International Airport, and major commercial logistics corridors.",
    "feat": [
      "Title: C of O in View & Registered Survey",
      "Free Provisional Survey (in client’s name) & Deed of Assignment",
      "Location: Omu, Epe Corridor, Lagos State",
      "Perimeter fencing & secured gated entrance",
      "Landscaping, green recreational pockets & good estate layout",
      "Cornerpiece allocation & estate electrical plan",
      "Sizes: 300 SQM (₦2.25M), 500 SQM (₦3.75M), 1000 SQM (₦7.5M)",
      "Initial Deposit: ₦500,000"
    ],
    "images": [
      "/images/projects/tp-omu-epe.jpg",
      "https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png",
      "https://framerusercontent.com/images/UXVhgcUSulXRvYzGZCmtJTbzHw.png",
      "https://framerusercontent.com/images/dJ4DsaWLcjmQNZd18IOgK1IRCv4.png"
    ],
    "stock": 22,
    "status": "active"
  },
  {
    "id": 8,
    "name": "The Providence Prime Portfolio",
    "slug": "the-providence",
    "cat": "corridor-developments",
    "price": 1200000,
    "was": 1800000,
    "art": "estate",
    "colors": [
      "orange",
      "navy",
      "gold",
      "slate"
    ],
    "sizes": [
      "Alabata 300 SQM (₦1.2M)",
      "Moniya 300 SQM (₦2.4M)",
      "Omu Epe 300 SQM (₦2.25M)",
      "1 Acre Multi-Hub Options"
    ],
    "badge": "Multi-State Corridor",
    "desc": "The Providence is EVC Nig. Ltd’s signature multi-state land development brand spanning strategic economic corridors across Lagos, Ibadan, and Ogun State. Unlocking accessibility, 100% dry land, and verified ownership for smart property investors.",
    "feat": [
      "Title: C of O in View across all three project hubs",
      "Free Provisional Survey in client’s name & Registered Deed",
      "Strategic locations in Lagos (Omu, Epe), Oyo (Moniya), and Ogun (Alabata)",
      "100% Dry Land guarantee with physical verification visits",
      "Entry pricing: Alabata (₦1.2M), Moniya (₦2.4M), Omu Epe (₦2.25M)",
      "Initial deposits starting from ₦300,000",
      "Flexible installment options: Outright, 3 Months, 6 Months, 12 Months",
      "Scheduled weekly site inspections (Tuesdays, Thursdays, Saturdays)"
    ],
    "images": [
      "/images/projects/tp-alabata.png",
      "/images/projects/tp-moniya.png",
      "/images/projects/tp-omu-epe.jpg",
      "https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png"
    ],
    "stock": 35,
    "status": "active"
  },
  {
    "id": 9,
    "name": "Vision Smart City (Phase 1 & 2)",
    "slug": "vision-smart-city",
    "cat": "smart-tech-cities",
    "price": 2400000,
    "was": 2000000,
    "art": "city",
    "colors": [
      "black",
      "orange",
      "glow",
      "slate"
    ],
    "sizes": [
      "300 SQM (₦2.4M)",
      "450 SQM (₦3.6M)",
      "600 SQM (₦4.8M)",
      "1 Acre (₦7.2M)"
    ],
    "badge": "SOLD OUT",
    "desc": "SOLD OUT. A landmark project that set new standards for real estate excellence in Ibadan. Located in Ido, Ibadan, minutes from the railway terminal. Phase 1 & 2 sold out completely with 100% subscriber allocations and ongoing infrastructure realization.",
    "feat": [
      "Status: 100% SOLD OUT",
      "Title: Certificate of Occupancy (C of O)",
      "Location: Ido, Ibadan, Oyo State",
      "Proximity to Ibadan Train Station and Ido Local Govt Secretariat",
      "Historical Pricing: 300 SQM (₦2.4M), 450 SQM (₦3.6M), 600 SQM (₦4.8M)",
      "All plots allocated to verified subscribers",
      "Internal drainage, perimeter wall, and solar streetlights active",
      "Inquire with EVC sales desk for resale opportunities or Phase 3 alerts"
    ],
    "images": [
      "/images/projects/vision-smart-city.png",
      "https://framerusercontent.com/images/AONfpWfc0Kh6HV9vx9KFwgjydxg.png",
      "https://framerusercontent.com/images/JLOv3dBORetS3V2IQIKcbI589S0.webp",
      "https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png"
    ],
    "stock": 0,
    "status": "archived"
  },
  {
    "id": 10,
    "name": "Riyadh Golf City",
    "slug": "riyadh-golf-city",
    "cat": "residential-estates",
    "price": 1000000,
    "was": 3000000,
    "art": "estate",
    "colors": [
      "black",
      "gold",
      "orange",
      "navy"
    ],
    "sizes": [
      "150 SQM (₦1M)",
      "300 SQM (₦3M)",
      "450 SQM (₦4.5M)",
      "600 SQM (₦6M)"
    ],
    "badge": "SOLD OUT",
    "desc": "SOLD OUT. An embodiment of luxury residential living intertwined with waterfront serenity in prime Asa Dam, Ilorin, Kwara State. Featuring an executive mini golf course, pristine lakeshore calm, and high-status living that fully sold out to investors and homeowners.",
    "feat": [
      "Status: 100% SOLD OUT",
      "Title: C of O in View & Registered Layout",
      "Location: Asa Dam, Ilorin, Kwara State (High-end GRA Extension)",
      "Waterfront views overlooking the calm waves of Asa Dam",
      "Private executive Mini Golf Course for estate residents",
      "Historical plot pricing: 150 SQM (₦1M) up to 600 SQM (₦6M)",
      "Smart security gatehouse with automated access control",
      "Completed subscription run—contact desk for secondary market inquiries"
    ],
    "images": [
      "https://framerusercontent.com/images/0YhBffpM2P1Z00k96j40F2r9LpA.png",
      "https://framerusercontent.com/images/e3GKNtNOB8XOLxxvzSmyD5xmvKc.png",
      "https://framerusercontent.com/images/WiBIxL9lfO7Y5JoMESN7Dxl1Iw.png",
      "https://framerusercontent.com/images/Ocs5ycFPrY1OrwO0VlsaYGvY.png"
    ],
    "stock": 0,
    "status": "archived"
  },
  {
    "id": 11,
    "name": "Almond Garden",
    "slug": "almond-garden",
    "cat": "residential-estates",
    "price": 500000,
    "was": 1500000,
    "art": "estate",
    "colors": [
      "black",
      "orange",
      "slate",
      "ivory"
    ],
    "sizes": [
      "150 SQM (₦500K)",
      "300 SQM (₦1M)",
      "500 SQM (₦1.5M)"
    ],
    "badge": "SOLD OUT",
    "desc": "SOLD OUT. Affordability met high rental yield in the KWASU host community of Malete, Kwara State. Almond Gardens closed the housing deficit for students and faculty with secure gate housing, perimeter fencing, and verified survey allocations.",
    "feat": [
      "Status: 100% SOLD OUT",
      "Title: Registered Survey & Deed of Assignment",
      "Location: Malete, Kwara State (Kwara State University Community)",
      "Gated housing estate with complete perimeter fencing",
      "Historical plot entry from ₦500,000",
      "Instant cornerpiece allocations completed",
      "Delivered exponential capital growth to early subscribers",
      "Contact EVC Nig. Ltd for next Malete investment releases"
    ],
    "images": [
      "https://framerusercontent.com/images/TNqXPeSRISpqi0P6YFPJkOyMqRs.png",
      "https://framerusercontent.com/images/m2jRtVCT541asDOtKGlo39N0iU.jpeg",
      "https://framerusercontent.com/images/tUq4UPMXnfD1GXrLOfcptyZmI.png",
      "https://framerusercontent.com/images/sf1JeTDyOAcZMOUJ5vBsPHnKZ78.png"
    ],
    "stock": 0,
    "status": "archived"
  },
  {
    "id": 12,
    "name": "Riyadh Tech City",
    "slug": "riyadh-tech-city",
    "cat": "smart-tech-cities",
    "price": 750000,
    "was": 2250000,
    "art": "city",
    "colors": [
      "black",
      "blue",
      "orange",
      "slate"
    ],
    "sizes": [
      "150 SQM (₦750K)",
      "300 SQM (₦1.5M)",
      "450 SQM (₦2.25M)",
      "600 SQM (₦3M)"
    ],
    "badge": "SOLD OUT",
    "desc": "SOLD OUT. The pioneering smart residential and business-friendly tech enclave in Asa Dam, Ilorin. Designed by EVC with fiber-conduit infrastructure and solar power integration, Riyadh Tech City was a resounding sellout success that inspired Riyadh Golf City.",
    "feat": [
      "Status: 100% SOLD OUT",
      "Title: C of O in View & Registered Survey",
      "Location: Asa Dam, Ilorin, Kwara State Capital",
      "Tech-enabled layout with fiber broadband ducts and solar street lighting",
      "Historical pricing from ₦750,000 for 150 SQM to ₦3,000,000 for 600 SQM",
      "Fully subscribed and documented by EVC Legal & Survey Team",
      "Rapid neighborhood appreciation among Kwara high-net-worth investors",
      "View Broadway Residentials or Afonja Boulevard for active projects"
    ],
    "images": [
      "https://framerusercontent.com/images/UsmupdXlDIirjWUi9CJhSJc9sA8.png",
      "https://framerusercontent.com/images/MCM2PlCECWPqCN3voEfgTzmVwc.png",
      "https://framerusercontent.com/images/WiBIxL9lfO7Y5JoMESN7Dxl1Iw.png",
      "https://framerusercontent.com/images/Ocs5ycFPrY1OrwO0VlsaYGvY.png"
    ],
    "stock": 0,
    "status": "archived"
  },
  {
    "id": 13,
    "name": "The Castle",
    "slug": "the-castle",
    "cat": "residential-estates",
    "price": 1800000,
    "was": 2400000,
    "art": "estate",
    "colors": [
      "black",
      "gold",
      "slate",
      "orange"
    ],
    "sizes": [
      "450 SQM (₦1.8M)",
      "600 SQM (₦2.4M)"
    ],
    "badge": "SOLD OUT",
    "desc": "SOLD OUT. Experience the opulent lifestyle of a castle. The Castle was carefully planned as an exclusive, low-density residential enclave in Malete, Kwara State, under 30 minutes from the capital city of Ilorin. Fully subscribed and sold out.",
    "feat": [
      "Status: 100% SOLD OUT",
      "Title: Registered Survey & Deed of Assignment",
      "Location: Malete, Moro Local Government, Kwara State",
      "Less than 30 minutes drive from Ilorin capital city",
      "Historical plot pricing: 450 SQM (₦1.8M), 600 SQM (₦2.4M)",
      "Cornerpiece and executive plot allocations finalized",
      "All rights and provisional surveys handed over to subscribers",
      "Contact sales desk for secondary resale verification"
    ],
    "images": [
      "https://framerusercontent.com/images/UcPdwNlRTFuVV0vjo0FL5T6ic6w.jpg",
      "https://framerusercontent.com/images/KHUGoOxeC7EAbTwjuB2I2x4L3o.png",
      "https://framerusercontent.com/images/M4wgDNOJYbxlPkLINNrLRz4Xqw.png",
      "https://framerusercontent.com/images/k2OwjUBlB76NyQVxznLcm7dwg0.png"
    ],
    "stock": 0,
    "status": "archived"
  }
];

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
      blurb: 'Verified EVC Nig. Ltd property investments and real estate developments.',
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
