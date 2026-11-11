-- =========================================================================
-- EVC Nigeria Marketplace — Official Supabase Seed Data
-- Database: unuhnhknczcgxqaekzrh
-- URL: https://unuhnhknczcgxqaekzrh.supabase.co
-- Extracted directly from evcng.com/buy-land and evcng.com/why-us
-- =========================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, blurb, art, colors, image) VALUES (
  'residential-estates',
  'Residential Land Estates',
  'Master-planned residential communities, serviced land plots, perimeter fencing, and verified C of O documentation in Ilorin, Lagos & Ibadan.',
  array['estate', 'land', 'city'],
  array['orange', 'navy', 'gold'],
  'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  blurb = EXCLUDED.blurb,
  art = EXCLUDED.art,
  colors = EXCLUDED.colors,
  image = EXCLUDED.image;

INSERT INTO public.categories (id, name, blurb, art, colors, image) VALUES (
  'corridor-developments',
  'Strategic Corridors',
  'Prime economic corridors connecting Lagos, Ibadan, Ogun and Epe with massive upcoming road infrastructure and high capital appreciation.',
  array['estate', 'land', 'building'],
  array['orange', 'glow', 'blue'],
  'https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  blurb = EXCLUDED.blurb,
  art = EXCLUDED.art,
  colors = EXCLUDED.colors,
  image = EXCLUDED.image;

INSERT INTO public.categories (id, name, blurb, art, colors, image) VALUES (
  'farmland-agricultural',
  'Farmland & Agro-Cities',
  'Large-scale surveyed agricultural farmland parcels with functional water sources, solar illumination, and agro-tourism appreciation in Oyo State.',
  array['farmland', 'estate'],
  array['gold', 'slate', 'orange'],
  'https://framerusercontent.com/images/9fqTXq8yaPPUtZzQt6YuOIWa4.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  blurb = EXCLUDED.blurb,
  art = EXCLUDED.art,
  colors = EXCLUDED.colors,
  image = EXCLUDED.image;

INSERT INTO public.categories (id, name, blurb, art, colors, image) VALUES (
  'housing-developments',
  'Smart Housing & Apartments',
  'Architectural residential developments, luxury modern bungalows, and serviced smart duplexes equipped with solar microgrids.',
  array['building', 'estate'],
  array['orange', 'slate', 'black'],
  'https://framerusercontent.com/images/blOJPGX0VAy46Sr0PkBkZ0Bh30.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  blurb = EXCLUDED.blurb,
  art = EXCLUDED.art,
  colors = EXCLUDED.colors,
  image = EXCLUDED.image;

INSERT INTO public.categories (id, name, blurb, art, colors, image) VALUES (
  'smart-tech-cities',
  'Smart Cities & Tech Enclaves',
  'High-tech residential and innovation districts planned for technology professionals, renewable power, and fiber optic connectivity.',
  array['city', 'building'],
  array['blue', 'orange', 'navy'],
  'https://framerusercontent.com/images/T6j9XjxzmbLmuO8ygeXmh8pJNEM.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  blurb = EXCLUDED.blurb,
  art = EXCLUDED.art,
  colors = EXCLUDED.colors,
  image = EXCLUDED.image;

INSERT INTO public.categories (id, name, blurb, art, colors, image) VALUES (
  'sold-out',
  'Sold Out Developments',
  'Completed and fully allocated landmark estates reflecting EVC’s proven track record of timely delivery and exponential value appreciation.',
  array['estate', 'city'],
  array['slate', 'black', 'orange'],
  'https://framerusercontent.com/images/wi76o9N6YnJ4vWkK4i4N30o3L10.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  blurb = EXCLUDED.blurb,
  art = EXCLUDED.art,
  colors = EXCLUDED.colors,
  image = EXCLUDED.image;


-- 2. Insert Canonical Land Products & Developments
INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  1,
  'Afonja Boulevard District 1',
  'afonja-boulevard',
  'residential-estates',
  650000,
  900000,
  'estate',
  array['orange', 'navy', 'gold', 'slate'],
  array['150 SQM (₦650K)', '300 SQM (₦1.3M)', '500 SQM (₦1.8M)', '1 Acre / 6 Plots (₦10.8M)'],
  'C of O in View',
  'Embodying the future of urban lifestyle where visionary design and cutting-edge infrastructure converge. Afonja Boulevard District 1 is strategically located in Oke Oyi, Ilorin, offering 100% dry table land, modern road networks, commercial zones, and rapid capital appreciation in the Kwara State growth corridor.',
  array['Title: C of O in View', 'Free Provisional Survey (in client’s name)', 'Registered Deed of Assignment', 'Location: Oke Oyi, Ilorin, Kwara State', '100% Dry Table Land ready for immediate building', 'Initial Deposit from only ₦200,000', 'Flexible payment plans up to 12 months', 'Perimeter fencing & modern gatehouse layout', 'Dedicated green community recreation & commercial spaces'],
  array['https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png', 'https://framerusercontent.com/images/blOJPGX0VAy46Sr0PkBkZ0Bh30.png', 'https://framerusercontent.com/images/T6j9XjxzmbLmuO8ygeXmh8pJNEM.png', 'https://framerusercontent.com/images/WiBIxL9lfO7Y5JoMESN7Dxl1Iw.png'],
  24,
  'active',
  true
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  2,
  'Broadway Residentials',
  'broadway-residentials',
  'housing-developments',
  2000000,
  2500000,
  'building',
  array['orange', 'glow', 'navy', 'black'],
  array['300 SQM Land (₦2M)', '500 SQM Land (₦3.2M)', 'Studio Apartment (₦18M)', '2 Bedroom Flat (₦35M)', '3 Bedroom Flat (₦40M)'],
  'Solar Powered Estate',
  'Granting access to smarter communal living in the high-demand host community of Kwara State University (KWASU), Malete. Broadway Residentials combines serviced residential plots with turn-key, solar-powered apartments (Studio, 2-Bedroom, and 3-Bedroom units) delivering guaranteed high student and executive rental yields.',
  array['Title: Certificate of Occupancy (C of O)', 'Free Provisional Survey (in client’s name) & Deed of Assignment', 'Location: Malete, Kwara State University (KWASU Corridor)', 'Solar-powered uninterrupted clean electricity estate grid', 'Land Plots: 300 SQM (₦2M), 500 SQM (₦3.2M)', 'Apartments: Studio (₦18M), 2-Bed (₦35M), 3-Bed (₦40M)', 'Initial deposit: ₦2,000,000 for housing units', 'High rental yield from university student & faculty influx', 'Paved access roads, drainage systems, and 24/7 security patrol'],
  array['https://framerusercontent.com/images/kbRFYh9OoPZpzrl0d7cY7dJZGk8.png', 'https://framerusercontent.com/images/4Tb7BuM5ZXAEoaIlC9k8xdoug.png', 'https://framerusercontent.com/images/RbQbI6tcH466lV1Ac7bijsLVw.png', 'https://framerusercontent.com/images/wEaw2mmuefKqnp8parWCjEFAgcc.webp'],
  15,
  'active',
  true
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  3,
  'Eden Crest',
  'eden-crest',
  'residential-estates',
  2100000,
  2800000,
  'estate',
  array['gold', 'orange', 'navy', 'ivory'],
  array['300 SQM (₦2.1M)', '500 SQM (₦3.5M)', '1000 SQM (₦7M)', '1 Acre / 6 Plots (₦12.6M)'],
  'Lagos Corridor',
  'Where every sunrise signals opportunity. Eden Crest is a premium residential development situated along the Ikorodu–Ogun State growth corridor, off Agbowa Ikosi. Designed to re-awaken heritage and luxury living, it delivers the strategic dual benefit of Lagos connectivity and exceptional land appreciation.',
  array['Title: C of O in View', 'Free Provisional Survey (in client’s name) & Deed of Assignment', 'Location: Off Agbowa Ikosi, Ikorodu–Ogun State Corridor', '100% Dry Table Land with zero flood risk', 'Initial Deposit: ₦500,000', 'Sizes: 300 SQM (₦2.1M), 500 SQM (₦3.5M), 1000 SQM (₦7M), 1 Acre (₦12.6M)', 'Perimeter fencing & gated security architecture', 'Close proximity to proposed Lagos Fourth Mainland Bridge route', 'Instant allocation upon completion of initial commitments'],
  array['https://framerusercontent.com/images/IkRFbDpoMDnpxsbQDOf9zBhK8EQ.png', 'https://framerusercontent.com/images/dUZvASmZvj4xtZCZLjLr0yAXm4.png', 'https://framerusercontent.com/images/wEaw2mmuefKqnp8parWCjEFAgcc.webp', 'https://framerusercontent.com/images/WiBIxL9lfO7Y5JoMESN7Dxl1Iw.png'],
  30,
  'active',
  true
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  4,
  'Idera Farm City',
  'idera-farm-city',
  'farmland-agricultural',
  750000,
  1000000,
  'farmland',
  array['gold', 'slate', 'orange', 'ivory'],
  array['500 SQM (₦750K)', '1,000 SQM (₦1.5M)', '3,000 SQM (₦4.5M)', '1 Acre (₦4.5M)', '1 Hectare / 10,000 SQM (₦11.25M)'],
  'Farmland & Agro-City',
  '“Idera” meaning Ease, Peace & Relief. Located in Ado Awaye, Iseyin, Oyo State, near the famed suspended lake. IDERA FARMS is more than farmland—it is an inter-generational gateway into food security wealth, commercial agriculture, and high land appreciation with functional water sources and solar street lighting.',
  array['Title: C of O in View & Surveyed Farmland Parcels', 'Free Provisional Survey (in client’s name) & Registered Deed', 'Location: Ado Awaye, Iseyin, Oyo State (Agro-tourism corridor)', 'Functional year-round agricultural water source & irrigation layout', 'Solar-powered perimeter lighting and security guard posts', 'Flexible sizes: 500 SQM to multi-hectare farm acquisitions', 'Initial Deposit: only ₦300,000', 'Ideal for crop farming, livestock, agro-processing, or land banking', 'Direct farm-to-market road access connecting Oyo and Ibadan'],
  array['https://framerusercontent.com/images/9fqTXq8yaPPUtZzQt6YuOIWa4.png', 'https://framerusercontent.com/images/t86q15iDhqlSTXV3YErgDQDegNE.png', 'https://framerusercontent.com/images/G9uTJ1zaMXb8x7hYRKfrQQlu8c.png', 'https://framerusercontent.com/images/wEaw2mmuefKqnp8parWCjEFAgcc.webp'],
  45,
  'active',
  true
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  5,
  'The Providence — Alabata (Abeokuta)',
  'the-providence-alabata',
  'corridor-developments',
  800000,
  1100000,
  'estate',
  array['orange', 'slate', 'navy', 'gold'],
  array['300 SQM (₦800K)', '500 SQM (₦1.5M)', '1000 SQM (₦3M)', '1 Acre (₦4.8M)'],
  '100% Dry Land',
  'Tucked between nature and promise. The Providence Alabata, Abeokuta (Ogun State) brings envisioned comfort into reality along the strategic Abeokuta-Ibadan expressway. An accessible investment corridor boasting 100% dry terrain, serene green views, and verified title documentation.',
  array['Title: C of O in View', 'Free Provisional Survey & Registered Deed of Assignment', 'Location: Alabata, Abeokuta, Ogun State', '100% dry terrain with immediate layout demarcation', 'Sizes: 300 SQM (₦800K), 500 SQM (₦1.5M), 1000 SQM (₦3M)', 'Initial Deposit: ₦300,000 with 6 to 12 months spread', 'Acre option: 1 Acre (₦4.8M)', 'Direct connectivity to Abeokuta metropolitan center and federal highway'],
  array['https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png', 'https://framerusercontent.com/images/UXVhgcUSulXRvYzGZCmtJTbzHw.png', 'https://framerusercontent.com/images/95oFgmJhGUmueUW57ndCFE0pNBY.png', 'https://framerusercontent.com/images/sl5PcJHaYEnJk65qJjnFbJQPwhM.png'],
  20,
  'active',
  true
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  6,
  'The Providence — Moniya (Ibadan)',
  'the-providence-moniya',
  'corridor-developments',
  1500000,
  1900000,
  'estate',
  array['orange', 'navy', 'gold', 'ivory'],
  array['300 SQM (₦1.5M)', '450 SQM (₦2.25M)', '600 SQM (₦3M)', '1 Acre (₦9M)'],
  'Train Station Hub',
  'Planting your dreams on solid grounds! Situated in Moniya, Akinyele Local Government, Ibadan—the epicentre of Oyo State’s modern transportation network. Minutes from the Obafemi Awolowo Train Station, Inland Dry Port, and the Ibadan Circular Road.',
  array['Title: C of O in View', 'Free Provisional Survey & Deed of Assignment in client’s name', 'Location: Moniya, Akinyele LGA, Ibadan, Oyo State', 'Proximity to Moniya Train Terminal & Ibadan Circular Road', 'Sizes: 300 SQM (₦1.5M), 450 SQM (₦2.25M), 600 SQM (₦3M)', 'Commercial Acre packages from ₦9,000,000', 'Initial Deposit: ₦500,000', 'Fast-track capital appreciation backed by massive state infrastructure'],
  array['https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png', 'https://framerusercontent.com/images/UXVhgcUSulXRvYzGZCmtJTbzHw.png', 'https://framerusercontent.com/images/95oFgmJhGUmueUW57ndCFE0pNBY.png', 'https://framerusercontent.com/images/WiBIxL9lfO7Y5JoMESN7Dxl1Iw.png'],
  18,
  'active',
  true
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  7,
  'The Providence — Omu, Epe (Lagos)',
  'the-providence-omu-epe',
  'corridor-developments',
  2250000,
  2900000,
  'estate',
  array['orange', 'blue', 'navy', 'gold'],
  array['300 SQM (₦2.25M)', '500 SQM (₦3.75M)', '1000 SQM (₦7.5M)', '1 Acre (₦13.5M)'],
  'Lagos Epe Hub',
  'Enjoy Lagos access without the stress! Located in Omu, Epe—the emerging goldmine of new Lagos. Positioned within rapid reach of the Lekki-Epe expressway, the proposed Lekki International Airport, and major commercial logistics corridors.',
  array['Title: C of O in View & Registered Survey', 'Free Provisional Survey (in client’s name) & Deed of Assignment', 'Location: Omu, Epe Corridor, Lagos State', '100% dry elevated table land with instant plot demarcation', 'Sizes: 300 SQM (₦2.25M), 500 SQM (₦3.75M), 1000 SQM (₦7.5M)', 'Initial Deposit: ₦500,000', 'Commercial Acre parcels available for institutional investors', 'High appreciation trajectory in Lagos State’s prime expansion axis'],
  array['https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png', 'https://framerusercontent.com/images/UXVhgcUSulXRvYzGZCmtJTbzHw.png', 'https://framerusercontent.com/images/dJ4DsaWLcjmQNZd18IOgK1IRCv4.png', 'https://framerusercontent.com/images/wEaw2mmuefKqnp8parWCjEFAgcc.webp'],
  22,
  'active',
  true
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  8,
  'The Providence Prime Portfolio',
  'the-providence',
  'corridor-developments',
  800000,
  1200000,
  'estate',
  array['orange', 'navy', 'gold', 'slate'],
  array['Alabata 300 SQM (₦800K)', 'Moniya 300 SQM (₦1.5M)', 'Omu Epe 300 SQM (₦2.25M)', '1 Acre Multi-Hub Options'],
  'Multi-State Corridor',
  'The Providence is EVC Nigeria’s signature multi-state land development brand spanning strategic economic corridors across Lagos, Ibadan, and Ogun State. Unlocking accessibility, 100% dry land, and verified ownership for smart property investors.',
  array['Title: C of O in View across all three project hubs', 'Free Provisional Survey in client’s name & Registered Deed', 'Strategic locations in Lagos (Omu, Epe), Oyo (Moniya), and Ogun (Alabata)', '100% Dry Land guarantee with physical verification visits', 'Entry pricing from ₦800,000 for 300 SQM', 'Initial deposits starting from ₦300,000', 'Flexible installment options: Outright, 3 Months, 6 Months, 12 Months', 'Scheduled weekly site inspections (Tuesdays, Thursdays, Saturdays)'],
  array['https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png', 'https://framerusercontent.com/images/XsagG8P20f1jElhw1uZ5YxltiE.webp', 'https://framerusercontent.com/images/UXVhgcUSulXRvYzGZCmtJTbzHw.png', 'https://framerusercontent.com/images/sl5PcJHaYEnJk65qJjnFbJQPwhM.png'],
  35,
  'active',
  true
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  9,
  'Vision Smart City (Phase 1 & 2)',
  'vision-smart-city',
  'smart-tech-cities',
  1200000,
  2400000,
  'city',
  array['black', 'orange', 'glow', 'slate'],
  array['300 SQM (₦1.2M)', '450 SQM (₦1.8M)', '600 SQM (₦2.4M)', '1 Acre (₦7.2M)'],
  'SOLD OUT',
  'SOLD OUT. A landmark project that set new standards for real estate excellence in Ibadan. Located in Ido, Ibadan, minutes from the railway terminal. Phase 1 & 2 sold out completely with 100% subscriber allocations and ongoing infrastructure realization.',
  array['Status: 100% SOLD OUT', 'Title: Certificate of Occupancy (C of O)', 'Location: Ido, Ibadan, Oyo State', 'Proximity to Ibadan Train Station and Ido Local Govt Secretariat', 'Historical Pricing: 300 SQM (₦1.2M) to 600 SQM (₦2.4M)', 'All plots allocated to verified subscribers', 'Internal drainage, perimeter wall, and solar streetlights active', 'Inquire with EVC sales desk for resale opportunities or Phase 3 alerts'],
  array['https://framerusercontent.com/images/AONfpWfc0Kh6HV9vx9KFwgjydxg.png', 'https://framerusercontent.com/images/JLOv3dBORetS3V2IQIKcbI589S0.webp', 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png', 'https://framerusercontent.com/images/wEaw2mmuefKqnp8parWCjEFAgcc.webp'],
  20,
  'archived',
  false
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  10,
  'Riyadh Golf City',
  'riyadh-golf-city',
  'residential-estates',
  1000000,
  3000000,
  'estate',
  array['black', 'gold', 'orange', 'navy'],
  array['150 SQM (₦1M)', '300 SQM (₦3M)', '450 SQM (₦4.5M)', '600 SQM (₦6M)'],
  'SOLD OUT',
  'SOLD OUT. An embodiment of luxury residential living intertwined with waterfront serenity in prime Asa Dam, Ilorin, Kwara State. Featuring an executive mini golf course, pristine lakeshore calm, and high-status living that fully sold out to investors and homeowners.',
  array['Status: 100% SOLD OUT', 'Title: C of O in View & Registered Layout', 'Location: Asa Dam, Ilorin, Kwara State (High-end GRA Extension)', 'Waterfront views overlooking the calm waves of Asa Dam', 'Private executive Mini Golf Course for estate residents', 'Historical plot pricing: 150 SQM (₦1M) up to 600 SQM (₦6M)', 'Smart security gatehouse with automated access control', 'Completed subscription run—contact desk for secondary market inquiries'],
  array['https://framerusercontent.com/images/0YhBffpM2P1Z00k96j40F2r9LpA.png', 'https://framerusercontent.com/images/e3GKNtNOB8XOLxxvzSmyD5xmvKc.png', 'https://framerusercontent.com/images/WiBIxL9lfO7Y5JoMESN7Dxl1Iw.png', 'https://framerusercontent.com/images/Ocs5ycFPrY1OrwO0VlsaYGvY.png'],
  20,
  'archived',
  false
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  11,
  'Almond Garden',
  'almond-garden',
  'residential-estates',
  500000,
  1500000,
  'estate',
  array['black', 'orange', 'slate', 'ivory'],
  array['150 SQM (₦500K)', '300 SQM (₦1M)', '500 SQM (₦1.5M)'],
  'SOLD OUT',
  'SOLD OUT. Affordability met high rental yield in the KWASU host community of Malete, Kwara State. Almond Gardens closed the housing deficit for students and faculty with secure gate housing, perimeter fencing, and verified survey allocations.',
  array['Status: 100% SOLD OUT', 'Title: Registered Survey & Deed of Assignment', 'Location: Malete, Kwara State (Kwara State University Community)', 'Gated housing estate with complete perimeter fencing', 'Historical plot entry from ₦500,000', 'Instant cornerpiece allocations completed', 'Delivered exponential capital growth to early subscribers', 'Contact EVC Nigeria for next Malete investment releases'],
  array['https://framerusercontent.com/images/TNqXPeSRISpqi0P6YFPJkOyMqRs.png', 'https://framerusercontent.com/images/m2jRtVCT541asDOtKGlo39N0iU.jpeg', 'https://framerusercontent.com/images/tUq4UPMXnfD1GXrLOfcptyZmI.png', 'https://framerusercontent.com/images/sf1JeTDyOAcZMOUJ5vBsPHnKZ78.png'],
  20,
  'archived',
  false
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  12,
  'Riyadh Tech City',
  'riyadh-tech-city',
  'smart-tech-cities',
  750000,
  2250000,
  'city',
  array['black', 'blue', 'orange', 'slate'],
  array['150 SQM (₦750K)', '300 SQM (₦1.5M)', '450 SQM (₦2.25M)', '600 SQM (₦3M)'],
  'SOLD OUT',
  'SOLD OUT. The pioneering smart residential and business-friendly tech enclave in Asa Dam, Ilorin. Designed by EVC with fiber-conduit infrastructure and solar power integration, Riyadh Tech City was a resounding sellout success that inspired Riyadh Golf City.',
  array['Status: 100% SOLD OUT', 'Title: C of O in View & Registered Survey', 'Location: Asa Dam, Ilorin, Kwara State Capital', 'Tech-enabled layout with fiber broadband ducts and solar street lighting', 'Historical pricing from ₦750,000 for 150 SQM to ₦3,000,000 for 600 SQM', 'Fully subscribed and documented by EVC Legal & Survey Team', 'Rapid neighborhood appreciation among Kwara high-net-worth investors', 'View Broadway Residentials or Afonja Boulevard for active projects'],
  array['https://framerusercontent.com/images/UsmupdXlDIirjWUi9CJhSJc9sA8.png', 'https://framerusercontent.com/images/MCM2PlCECWPqCN3voEfgTzmVwc.png', 'https://framerusercontent.com/images/WiBIxL9lfO7Y5JoMESN7Dxl1Iw.png', 'https://framerusercontent.com/images/Ocs5ycFPrY1OrwO0VlsaYGvY.png'],
  20,
  'archived',
  false
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

INSERT INTO public.products (
  id, name, slug, cat, price, was, art, colors, sizes, badge, "desc", feat, images, stock, status, is_active
) VALUES (
  13,
  'The Castle',
  'the-castle',
  'residential-estates',
  1800000,
  2400000,
  'estate',
  array['black', 'gold', 'slate', 'orange'],
  array['450 SQM (₦1.8M)', '600 SQM (₦2.4M)'],
  'SOLD OUT',
  'SOLD OUT. Experience the opulent lifestyle of a castle. The Castle was carefully planned as an exclusive, low-density residential enclave in Malete, Kwara State, under 30 minutes from the capital city of Ilorin. Fully subscribed and sold out.',
  array['Status: 100% SOLD OUT', 'Title: Registered Survey & Deed of Assignment', 'Location: Malete, Moro Local Government, Kwara State', 'Less than 30 minutes drive from Ilorin capital city', 'Historical plot pricing: 450 SQM (₦1.8M), 600 SQM (₦2.4M)', 'Cornerpiece and executive plot allocations finalized', 'All rights and provisional surveys handed over to subscribers', 'Contact sales desk for secondary resale verification'],
  array['https://framerusercontent.com/images/UcPdwNlRTFuVV0vjo0FL5T6ic6w.jpg', 'https://framerusercontent.com/images/KHUGoOxeC7EAbTwjuB2I2x4L3o.png', 'https://framerusercontent.com/images/M4wgDNOJYbxlPkLINNrLRz4Xqw.png', 'https://framerusercontent.com/images/k2OwjUBlB76NyQVxznLcm7dwg0.png'],
  20,
  'archived',
  false
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

