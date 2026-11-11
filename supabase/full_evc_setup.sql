-- =========================================================================
-- EVC NIGERIA MARKETPLACE — FULL DATABASE SETUP & CANONICAL SEED
-- Supabase Project Reference: unuhnhknczcgxqaekzrh
-- Supabase Project URL: https://unuhnhknczcgxqaekzrh.supabase.co
-- Source: Official EVC Nigeria Web Assets (evcng.com/buy-land, evcng.com/why-us)
-- Instructions: Run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/unuhnhknczcgxqaekzrh/sql
-- =========================================================================

-- Enable uuid-ossp extension
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to Supabase Auth)
-- -------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  address text,
  state text,
  role text default 'customer', -- 'customer', 'staff', 'manager', 'super_admin'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles add column if not exists role text default 'customer';

-- -------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- -------------------------------------------------------------------------
create table if not exists public.categories (
  id text primary key,
  name text not null,
  blurb text not null,
  art text[] not null,
  colors text[] not null,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories add column if not exists image text;

-- -------------------------------------------------------------------------
-- 3. PRODUCTS TABLE (Land Projects & Developments)
-- -------------------------------------------------------------------------
create table if not exists public.products (
  id integer primary key,
  name text not null,
  slug text,
  cat text references public.categories(id) on delete set null,
  price numeric not null,
  was numeric,
  art text not null,
  colors text[] not null,
  sizes text[],
  badge text,
  "desc" text not null,
  feat text[] not null,
  images text[],
  stock integer default 20,
  cogs numeric,
  low_stock_threshold integer default 5,
  status text default 'active', -- 'active', 'draft', 'archived', 'sold_out'
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.products add column if not exists slug text;
alter table public.products add column if not exists images text[];
alter table public.products add column if not exists stock integer default 20;
alter table public.products add column if not exists cogs numeric;
alter table public.products add column if not exists low_stock_threshold integer default 5;
alter table public.products add column if not exists status text default 'active';
alter table public.products add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- -------------------------------------------------------------------------
-- 4. ORDERS TABLE (Land Subscriptions, Deeds & Inspections)
-- -------------------------------------------------------------------------
create table if not exists public.orders (
  id text primary key, -- e.g. EVC-XXXXXX
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  phone text not null,
  email text not null,
  address text not null,
  state text not null,
  landmark text,
  delivery_label text not null,
  eta text not null,
  pay_label text not null,
  payment_method text not null, -- 'link', 'transfer', 'pod'
  payment_status text default 'pending' not null, -- 'pending', 'paid', 'failed'
  order_status text default 'received' not null, -- 'received', 'confirmed', 'dispatched', 'delivered', 'cancelled'
  subtotal numeric not null,
  fee numeric not null,
  discount numeric default 0 not null,
  total numeric not null,
  paystack_ref text,
  note text,
  carrier text,
  tracking_number text,
  rider_name text,
  rider_phone text,
  dispatch_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders add column if not exists carrier text;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists rider_name text;
alter table public.orders add column if not exists rider_phone text;
alter table public.orders add column if not exists dispatch_note text;

-- -------------------------------------------------------------------------
-- 5. ORDER ITEMS TABLE
-- -------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  product_id integer references public.products(id) on delete set null,
  name text not null,
  price numeric not null,
  qty integer not null,
  art text not null,
  color text not null,
  opt text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------------------
-- 6. REVIEWS TABLE
-- -------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id integer references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  comment text not null,
  verified boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;

-- Profiles: Users can read and update their own profile; public insert on register
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Anyone can insert profile" on public.profiles;
create policy "Anyone can insert profile" on public.profiles
  for insert with check (true);

-- Categories & Products: Public read access
drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone" on public.categories
  for select using (true);

drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone" on public.products
  for select using (true);

-- Orders: Users can read their own orders; public/guest can create orders
drop policy if exists "Anyone can insert orders" on public.orders;
create policy "Anyone can insert orders" on public.orders
  for insert with check (true);

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id or auth.uid() is null);

-- Order Items: Anyone can insert, users can view
drop policy if exists "Anyone can insert order items" on public.order_items;
create policy "Anyone can insert order items" on public.order_items
  for insert with check (true);

drop policy if exists "Users can view order items" on public.order_items;
create policy "Users can view order items" on public.order_items
  for select using (true);

-- Reviews: Viewable by all, insertable by anyone
drop policy if exists "Reviews are viewable by everyone" on public.reviews;
create policy "Reviews are viewable by everyone" on public.reviews
  for select using (true);

drop policy if exists "Anyone can insert reviews" on public.reviews;
create policy "Anyone can insert reviews" on public.reviews
  for insert with check (true);

-- -------------------------------------------------------------------------
-- TRIGGER: Automatically create profile upon Supabase signup
-- -------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do update set
    email = EXCLUDED.email,
    full_name = coalesce(EXCLUDED.full_name, public.profiles.full_name),
    phone = coalesce(EXCLUDED.phone, public.profiles.phone);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- SEED DATA: CATEGORIES & CANONICAL LAND PROJECTS
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
  'estate',
  array['orange', 'navy', 'gold', 'slate'],
  array['300 SQM (₦2.0M)', '500 SQM (₦3.2M)', '1 Acre / 6 Plots (₦19.2M)'],
  'Solar Powered Estate',
  'Step into an oasis of serenity at Broadway Residentials, our masterfully planned solar-powered housing estate in Ganmo, Ilorin. Designed for discerning homeowners, this premier enclave features smart streetlights, 24/7 security surveillance, perimeter fencing, clean piped water, and rapid capital appreciation.',
  array['Title: Registered Survey & Deed of Assignment', 'Clean Piped Water & Solar-Powered Streetlights', '24/7 Monitored Security Surveillance', 'Location: Ganmo, Ilorin, Kwara State', 'High-speed Fiber Optic Backbone cabling', 'Landscaped Boulevard with paved interlocking roads', 'Children’s Recreational Playpark', 'Instant Allocation upon 60% payment'],
  array['https://framerusercontent.com/images/blOJPGX0VAy46Sr0PkBkZ0Bh30.png', 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png', 'https://framerusercontent.com/images/T6j9XjxzmbLmuO8ygeXmh8pJNEM.png'],
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
  3,
  'Eden Crest',
  'eden-crest',
  'residential-estates',
  2100000,
  2800000,
  'estate',
  array['orange', 'glow', 'navy', 'gold'],
  array['300 SQM (₦2.1M)', '500 SQM (₦3.5M)', '1 Acre / 6 Plots (₦21M)'],
  'Lagos Corridor',
  'Welcome to Eden Crest, situated along the Siun Interchange on the booming Abeokuta Expressway, Ogun State. An exceptional blend of tranquil greenery and strategic urban connectivity to both Lagos and Ogun commercial hubs, offering rapid capital appreciation for forward-thinking property investors.',
  array['Title: Registered Survey & Gazette in Process', 'Siun Interchange, Abeokuta Expressway', 'Strategic Lagos-Ogun Highway Growth Corridor', '100% High and Dry Topography', 'Perimeter Fencing & Smart Entrance Gate', 'Zero Omo-Onile interference guarantee', 'Direct Access to Main Dual Carriage Expressway', 'Flexible payment plans up to 12 months'],
  array['https://framerusercontent.com/images/T6j9XjxzmbLmuO8ygeXmh8pJNEM.png', 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png', 'https://framerusercontent.com/images/blOJPGX0VAy46Sr0PkBkZ0Bh30.png'],
  14,
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
  array['gold', 'slate', 'orange', 'navy'],
  array['1 Plot (₦750K)', '1 Acre / 6 Plots (₦4.2M)', '5 Acres (₦20M)', '10 Acres Commercial (₦38M)'],
  'Farmland & Agro-City',
  'Idera Farm City represents the pinnacle of modern agricultural and agro-tourism land investments in Ijaye, Oyo State. High-yield, rich organic arable soil with direct road connectivity, sustainable solar irrigation plans, and guaranteed seasonal yields for agricultural investors.',
  array['Title: Registered Survey & Agricultural Gazette', 'Location: Ijaye, Oyo State (Fast Agro Growth Hub)', 'Rich Organic Loamy Topsoil for cash crop & livestock farming', 'Direct Access Road for tractor & heavy vehicle haulage', 'Solar-powered central borehole water supply points', 'Professional farm management advisory available', 'Minimum purchase: 1 Plot; Bulk agro discounts on 5+ Acres', 'Rapid capital appreciation from regional food security initiatives'],
  array['https://framerusercontent.com/images/9fqTXq8yaPPUtZzQt6YuOIWa4.png', 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png', 'https://framerusercontent.com/images/blOJPGX0VAy46Sr0PkBkZ0Bh30.png'],
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
  5,
  'The Providence — Alabata (Abeokuta)',
  'the-providence-alabata',
  'corridor-developments',
  800000,
  1200000,
  'estate',
  array['orange', 'glow', 'navy', 'gold'],
  array['300 SQM (₦800K)', '500 SQM (₦1.35M)', '1 Acre / 6 Plots (₦8.1M)'],
  '100% Dry Land',
  'Part of EVC’s signature Providence series, Providence Alabata is positioned right in the educational and commercial growth corridor of Abeokuta, Ogun State. Featuring 100% dry table land, serene natural surroundings, and great ROI potential.',
  array['Title: Registered Survey & Deed of Assignment', '100% Dry Table Land with zero dredging required', 'Proximity to FUNAAB and Abeokuta city center', 'Graded access roads & clear plot demarcation', 'Instant physical allocation upon initial deposit benchmark', 'Excellent for student hostels, residential homes, or land banking'],
  array['https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png', 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png', 'https://framerusercontent.com/images/T6j9XjxzmbLmuO8ygeXmh8pJNEM.png'],
  25,
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
  2000000,
  'estate',
  array['orange', 'glow', 'navy', 'blue'],
  array['300 SQM (₦1.5M)', '500 SQM (₦2.4M)', '1 Acre / 6 Plots (₦14.4M)'],
  'Train Station Hub',
  'Strategically located in Moniya, Ibadan, Oyo State, right near the landmark Lagos-Ibadan Train Terminal and the Moniya-Iseyin reconstruction highway. Providence Moniya is one of the highest appreciating real estate investments in South-West Nigeria today.',
  array['Title: Registered Survey & C of O in View', 'Minutes from the Lagos-Ibadan Train Station Terminal', 'Directly connected to the newly reconstructed Moniya-Iseyin Highway', 'Gated Community with round-the-clock security', 'High commercial rental yields from transit hubs and inland dry ports', 'Perimeter fencing & modern layout architecture'],
  array['https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png', 'https://framerusercontent.com/images/blOJPGX0VAy46Sr0PkBkZ0Bh30.png', 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png'],
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
  7,
  'The Providence — Omu, Epe (Lagos)',
  'the-providence-omu-epe',
  'corridor-developments',
  2250000,
  3000000,
  'estate',
  array['orange', 'navy', 'glow', 'gold'],
  array['300 SQM (₦2.25M)', '500 SQM (₦3.75M)', '1 Acre / 6 Plots (₦22.5M)'],
  'Lagos Epe Hub',
  'Located in the ultra-fast expanding corridor of Omu, Epe, Lagos State. Capitalizing on the multi-billion dollar mega projects of Lekki-Epe, including the Lekki Deep Sea Port, Dangote Refinery, Alaro City, and the proposed Lekki International Airport.',
  array['Title: Registered Survey & Free from Government Acquisition', 'Prime Location: Omu, Epe, Lagos State', 'High Capital Yield with projected 300% ROI over 36 months', 'Dry table land with no sand filling needed', 'Well planned road network with drainage systems', 'Close proximity to Epe Resort and Atlantic Hall School'],
  array['https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png', 'https://framerusercontent.com/images/T6j9XjxzmbLmuO8ygeXmh8pJNEM.png', 'https://framerusercontent.com/images/WiBIxL9lfO7Y5JoMESN7Dxl1Iw.png'],
  12,
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
  'the-providence-prime-portfolio',
  'corridor-developments',
  800000,
  1200000,
  'estate',
  array['orange', 'navy', 'gold', 'blue'],
  array['Alabata Plot (₦800K)', 'Moniya Plot (₦1.5M)', 'Omu Epe Plot (₦2.25M)', 'Tri-State Bundle (₦4.5M)'],
  'Multi-State Corridor',
  'The consolidated Providence Prime Portfolio offers investors diversified exposure across all three prime strategic locations: Alabata (Abeokuta), Moniya (Ibadan), and Omu (Epe, Lagos). Perfect for portfolio builders looking to diversify across regional growth belts.',
  array['Multi-State Diversification: Lagos, Ogun, and Oyo', 'Institutional Grade Registered Documentation', 'Coordinated Site Inspections across all 3 estates', 'Dedicated Relationship Manager for portfolio investors', 'Discounted bundle pricing on multi-plot acquisition'],
  array['https://framerusercontent.com/images/fNgenhjLFViJOiOMPVeCBwiNIY.png', 'https://framerusercontent.com/images/blOJPGX0VAy46Sr0PkBkZ0Bh30.png', 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png'],
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
  9,
  'Vision Smart City (Phase 1 & 2)',
  'vision-smart-city',
  'smart-tech-cities',
  1200000,
  null,
  'city',
  array['blue', 'orange', 'navy', 'slate'],
  array['Phase 1 Allocation (Completed)', 'Phase 2 Allocation (Completed)'],
  'SOLD OUT',
  'A flagship landmark project by EVC Nigeria. Vision Smart City Phase 1 & 2 in Ilorin, Kwara State stands as a testament to EVC’s standard of excellence, master urban planning, and commitment to investor prosperity. 100% delivered and allocated.',
  array['Status: 100% Sold Out & Allocated', 'Total Delivered Plots: 350+ Serviced Plots', 'Paved boulevard & solar illumination operational', 'Over 240% capital appreciation achieved since launch', 'Active residential development ongoing by landowners'],
  array['https://framerusercontent.com/images/wi76o9N6YnJ4vWkK4i4N30o3L10.png', 'https://framerusercontent.com/images/T6j9XjxzmbLmuO8ygeXmh8pJNEM.png'],
  0,
  'sold_out',
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
  10,
  'Riyadh Golf City',
  'riyadh-golf-city',
  'residential-estates',
  1000000,
  null,
  'estate',
  array['gold', 'navy', 'orange', 'slate'],
  array['Residential Plot (Completed)', 'Fairway View Plot (Completed)'],
  'SOLD OUT',
  'Riyadh Golf City, an elite luxury residential community designed around championship recreational green spaces in Ilorin, Kwara State. Fully allocated to high net worth individuals, professionals, and corporate investors.',
  array['Status: 100% Sold Out & Allocated', 'Prime Gated Community layout with perimeter boundary', 'Record turnaround delivery and handover', 'Over 180% capital appreciation realized for early subscribers'],
  array['https://framerusercontent.com/images/wi76o9N6YnJ4vWkK4i4N30o3L10.png', 'https://framerusercontent.com/images/ShZHFc2W5LjWZSqlOFseIXtCric.png'],
  0,
  'sold_out',
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
  11,
  'Almond Garden',
  'almond-garden',
  'residential-estates',
  500000,
  null,
  'estate',
  array['orange', 'slate', 'navy', 'gold'],
  array['Standard Plot (Completed)', 'Commercial Plot (Completed)'],
  'SOLD OUT',
  'Almond Garden offered affordable suburban residential living with unmatched value per square meter in Ilorin. Hundreds of families secured their plots and achieved homeowner status through EVC’s structured installment plans.',
  array['Status: 100% Sold Out & Allocated', 'Demarcation and survey documentation delivered to all subscribers', 'Thriving residential neighborhood with ongoing home construction'],
  array['https://framerusercontent.com/images/wi76o9N6YnJ4vWkK4i4N30o3L10.png', 'https://framerusercontent.com/images/9fqTXq8yaPPUtZzQt6YuOIWa4.png'],
  0,
  'sold_out',
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
  12,
  'Riyadh Tech City',
  'riyadh-tech-city',
  'smart-tech-cities',
  750000,
  null,
  'city',
  array['blue', 'orange', 'navy', 'slate'],
  array['Tech Enclave Plot (Completed)', 'Innovation Park (Completed)'],
  'SOLD OUT',
  'Engineered for the new generation of creators, remote executives, and tech innovators. Riyadh Tech City in Ilorin merged modern smart estate infrastructure with eco-friendly urban master planning. Completely subscribed.',
  array['Status: 100% Sold Out & Allocated', 'Pioneering technology-centric residential enclave', 'Full deed and survey documentation dispatched'],
  array['https://framerusercontent.com/images/wi76o9N6YnJ4vWkK4i4N30o3L10.png', 'https://framerusercontent.com/images/T6j9XjxzmbLmuO8ygeXmh8pJNEM.png'],
  0,
  'sold_out',
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
  13,
  'The Castle',
  'the-castle',
  'residential-estates',
  1800000,
  null,
  'estate',
  array['gold', 'navy', 'orange', 'black'],
  array['Executive Plot (Completed)', 'Royal Boulevard Plot (Completed)'],
  'SOLD OUT',
  'The Castle represented the ultimate in luxury residential estate living in Kwara State. Featuring majestic gated architecture, premium plots, and high-end community amenities. Fully allocated.',
  array['Status: 100% Sold Out & Allocated', 'Ultra-exclusive private residential estate', 'Highest appreciation multiple in its class'],
  array['https://framerusercontent.com/images/wi76o9N6YnJ4vWkK4i4N30o3L10.png', 'https://framerusercontent.com/images/blOJPGX0VAy46Sr0PkBkZ0Bh30.png'],
  0,
  'sold_out',
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
