'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  MessageSquare,
  MapPin,
  Calendar,
  FileCheck,
  BadgeCheck,
} from 'lucide-react';
import { PRODUCTS, CATS, CFG, byId } from '@/lib/products';
import { money, waLink } from '@/lib/utils';
import { ProductImage } from '@/components/shop/ProductImage';
import { ProductCard } from '@/components/shop/ProductCard';
import { StackedCards } from '@/components/shop/StackedCards';
import { HowItWorksPhone } from '@/components/shop/HowItWorksPhone';
import { BudgetShelf } from '@/components/shop/BudgetShelf';
import { Product } from '@/types';

// Animated Counter component
const AnimatedCounter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          const startTime = performance.now();
          const duration = 1400;

          const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(end * eased));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref} className="font-variant-numeric tabular-nums">
      {count}
      {suffix}
    </span>
  );
};

export default function HomePage() {
  const row1Picks: Product[] = PRODUCTS.slice(0, 4);
  const row2Picks: Product[] = PRODUCTS.slice(4, 8);

  const heroSectionRef = useRef<HTMLElement>(null);
  const heroArtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroSectionRef.current;
    const art = heroArtRef.current;
    if (!hero || !art) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = art.getBoundingClientRect();
      const mx = ((e.clientX - (rect.left + rect.width / 2)) / rect.width).toFixed(3);
      const my = ((e.clientY - (rect.top + rect.height / 2)) / rect.height).toFixed(3);
      art.style.setProperty('--mx', mx);
      art.style.setProperty('--my', my);
    };

    hero.addEventListener('pointermove', handlePointerMove);
    return () => hero.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tr = marqueeTrackRef.current;
    if (!tr) return;

    let x = 0;
    let last = window.scrollY;
    let vel = 0;
    let rafId: number;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const loop = () => {
      const currentY = window.scrollY;
      const dy = currentY - last;
      last = currentY;
      vel += (dy - vel) * 0.1;
      x -= (reduced ? 0 : 1.1) + vel * 0.55;

      const half = tr.scrollWidth / 4;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }

      tr.style.transform = `translate3d(${x}px, 0, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Top 3 featured properties for hero parallax
  const broadway = byId(1) || PRODUCTS[0];
  const eden = byId(2) || PRODUCTS[1];
  const afonja = byId(4) || PRODUCTS[3];

  return (
    <div className="flex flex-col gap-20 md:gap-28 bg-[#03090a] text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section ref={heroSectionRef} className="relative pt-8 md:pt-16 pb-12 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-80px] left-[-100px] w-[420px] h-[420px] bg-glow/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 flex flex-col gap-6 items-start">
            <div className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-brand border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
              Official EVC Nigeria Real Estate Marketplace &bull; evcng.com
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.92] text-white">
              <span className="block overflow-hidden py-1">
                <span className="inline-block">Own Verified.</span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="inline-block text-brand">
                  <em className="serif-italic text-white">Build</em> Wealth.
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              Explore officially verified land, master-planned residential estates, student housing, and strategic corridors in Kwara, Oyo, Lagos, Ogun, and Abuja. 100% dry land with guaranteed titles.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/shop" className="btn-primary text-sm inline-flex items-center gap-2">
                Explore All Projects <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={waLink('Hello EVC Nigeria, I am interested in acquiring land and would like to speak with a property consultant.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm text-[#25d366] hover:border-[#25d366] hover:bg-green-500/10 inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Chat with Property Advisor
              </a>
            </div>

            {/* Trust Bullet Items */}
            <ul className="flex flex-wrap items-center gap-4 sm:gap-8 pt-4 text-xs sm:text-sm font-medium text-slate-400">
              <li className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-brand" /> Verified Title (C of O &amp; Survey)
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand" /> Free Site Inspections (Tue, Thu, Sat)
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-brand" /> Instant Allocation Guarantee
              </li>
            </ul>
          </div>

          {/* Right Hero Interactive 3D Parallax Cards Stage */}
          <div
            ref={heroArtRef}
            className="lg:col-span-5 relative aspect-square max-w-[500px] mx-auto w-full"
            style={{ ['--mx' as any]: 0, ['--my' as any]: 0 }}
          >
            {/* Card 1: Broadway Residentials */}
            <Link
              href={`/product/${broadway.slug || broadway.id}`}
              className="absolute left-0 top-[2%] w-[48%] aspect-[1/1.18] rounded-3xl overflow-hidden bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{
                transform:
                  'translate(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -10px)) rotate(-6deg)',
              }}
            >
              <ProductImage
                src={broadway.images?.[0]}
                alt={broadway.name}
                fallbackArt={{ type: 'building', color: 'orange', view: 0 }}
              />
              <div className="absolute left-2.5 right-2.5 bottom-2.5 z-10 px-3 py-1.5 rounded-full bg-[#03090a]/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-[11px] font-semibold text-white">
                <span className="truncate max-w-[80px]">Broadway</span>
                <b className="text-brand font-mono">{money(broadway.price)}</b>
              </div>
            </Link>

            {/* Card 2: Eden Crest */}
            <Link
              href={`/product/${eden.slug || eden.id}`}
              className="absolute right-0 top-[10%] w-[48%] aspect-[1/1.15] rounded-3xl overflow-hidden bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{
                transform:
                  'translate(calc(var(--mx, 0) * 18px), calc(var(--my, 0) * 12px)) rotate(6deg)',
              }}
            >
              <ProductImage
                src={eden.images?.[0]}
                alt={eden.name}
                fallbackArt={{ type: 'estate', color: 'orange', view: 0 }}
              />
              <div className="absolute left-2.5 right-2.5 bottom-2.5 z-10 px-3 py-1.5 rounded-full bg-[#03090a]/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-[11px] font-semibold text-white">
                <span className="truncate max-w-[80px]">Eden Crest</span>
                <b className="text-brand font-mono">{money(eden.price)}</b>
              </div>
            </Link>

            {/* Card 3: Afonja Boulevard */}
            <Link
              href={`/product/${afonja.slug || afonja.id}`}
              className="absolute left-[26%] bottom-[0%] w-[46%] aspect-[1/1.1] rounded-3xl overflow-hidden bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl transition-transform duration-300 hover:scale-105 z-10"
              style={{
                transform:
                  'translate(calc(var(--mx, 0) * -8px), calc(var(--my, 0) * 16px)) rotate(-2deg)',
              }}
            >
              <ProductImage
                src={afonja.images?.[0]}
                alt={afonja.name}
                fallbackArt={{ type: 'land', color: 'orange', view: 0 }}
              />
              <div className="absolute left-2.5 right-2.5 bottom-2.5 z-10 px-3 py-1.5 rounded-full bg-[#03090a]/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-[11px] font-semibold text-white">
                <span className="truncate max-w-[80px]">Afonja Blvd</span>
                <b className="text-brand font-mono">{money(afonja.price)}</b>
              </div>
            </Link>

            {/* Rotating Brand Pill */}
            <div className="hidden sm:flex absolute right-4 bottom-6 w-28 h-28 rounded-full border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 text-white items-center justify-center shadow-xl z-20">
              <svg viewBox="0 0 132 132" className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite]">
                <defs>
                  <path id="badgeCircle" d="M66 66 m-48 0 a48 48 0 1 1 96 0 a48 48 0 1 1 -96 0" />
                </defs>
                <text className="text-[10px] font-semibold uppercase tracking-[0.24em] fill-white">
                  <textPath href="#badgeCircle">
                    EVC NIGERIA &bull; EVCNG.COM &bull;
                  </textPath>
                </text>
              </svg>
              <BadgeCheck className="w-7 h-7 text-brand" />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="bg-[#03090a] text-white py-5 -rotate-1 -mx-4 border-y border-glow/25 select-none overflow-hidden">
        <div
          ref={marqueeTrackRef}
          className="flex items-center gap-8 text-2xl sm:text-4xl font-display font-extrabold uppercase tracking-tight will-change-transform"
        >
          {Array(4)
            .fill(CATS)
            .flat()
            .map((cat, idx) => (
              <span key={idx} className="inline-flex items-center gap-8 whitespace-nowrap">
                <span>{cat.name}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-brand flex-shrink-0" />
              </span>
            ))}
        </div>
      </section>

      {/* Stacked Category Cards: Browse by sector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Property Portfolios
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mt-1 max-w-lg text-white">
              Master-planned estates and strategic investment corridors.
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            From low-density residential estates to interstate commercial corridors and organic agro-cities, discover verified properties with guaranteed title security.
          </p>
        </div>

        <StackedCards />
      </section>

      {/* Picks of the Week: Dual-Row Sliding Shelves */}
      <section className="w-full overflow-hidden py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 flex items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Prime Projects
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mt-1 text-white">
              Trending estates across Nigeria.
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            View all projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-6 md:gap-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
          <div className="animate-shelf-left flex items-center gap-5 sm:gap-6 select-none">
            {[...row1Picks, ...row1Picks].map((product, idx) => (
              <div
                key={`row1-${product.id}-${idx}`}
                className="w-[260px] sm:w-[280px] md:w-[300px] flex-shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="animate-shelf-right flex items-center gap-5 sm:gap-6 select-none">
            {[...row2Picks, ...row2Picks].map((product, idx) => (
              <div
                key={`row2-${product.id}-${idx}`}
                className="w-[260px] sm:w-[280px] md:w-[300px] flex-shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#03090a] py-16 md:py-24 border-y border-glow/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Transparent Acquisition
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mt-1 text-white">
              From site inspection to registered deed allocation.
            </h2>
          </div>

          <HowItWorksPhone />
        </div>
      </section>

      {/* Budget Shelf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <BudgetShelf />
      </section>

      {/* Why Choose EVC Nigeria: 4 Pillars & Luxury Owners Testimonials (from evcng.com/why-us) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              The EVC Standard &bull; evcng.com/why-us
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mt-1">
              Why Investors Choose EVC Nigeria
            </h2>
          </div>
          <Link
            href="/why-us"
            className="btn-ghost text-xs py-2.5 px-5 border border-glow/25 inline-flex items-center gap-1.5 w-fit"
          >
            Learn More on Why Us <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CFG.whyUs.pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col justify-between gap-3"
            >
              <h3 className="font-display font-bold text-base text-white">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pillar.desc}
              </p>
              <Link href="/why-us" className="text-[11px] font-semibold text-brand hover:underline mt-2 inline-block">
                Explore pillar &rarr;
              </Link>
            </div>
          ))}
        </div>

        {/* Testimonials Shelf: Trusted by Luxury Owners */}
        <div className="p-8 sm:p-10 rounded-[36px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                Trusted by Luxury Owners &amp; Tech Founders
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
                Take our word for it.
              </h3>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline-block">Verified investor reviews</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CFG.whyUs.testimonials.slice(0, 2).map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#03090a]/80 border border-glow/25 flex flex-col justify-between gap-4"
              >
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <strong className="text-white font-semibold">{t.author}</strong>
                  <span className="text-brand text-[11px] font-mono">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Procurement Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-16">
        <div className="rounded-[40px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 text-white p-8 sm:p-12 md:p-16 relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="md:col-span-7 flex flex-col gap-4 relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">
              Diaspora Investment &amp; Institutional Portfolios
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-white">
              Planning large acreage acquisition or commercial development?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
              Our real estate advisory team handles comprehensive title verifications, boundary surveys, master layout planning, and diaspora remote allocations with video walk-throughs.
            </p>
            <div className="pt-2">
              <a
                href={waLink('Hello EVC Nigeria, I would like to consult on large acreage acquisition / diaspora property investment.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Request Property Consultation
              </a>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-4 relative z-10">
            <div className="p-6 rounded-3xl bg-[#03090a]/80 border border-glow/25 flex flex-col gap-2 text-center">
              <span className="font-display text-4xl font-extrabold text-brand">
                <AnimatedCounter end={100} suffix="%" />
              </span>
              <span className="text-xs font-medium text-slate-400">Dry Land &amp; Verified Titles</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#03090a]/80 border border-glow/25 flex flex-col gap-2 text-center">
              <span className="font-display text-4xl font-extrabold text-brand">
                <AnimatedCounter end={13} suffix="+" />
              </span>
              <span className="text-xs font-medium text-slate-400">Master-Planned Projects</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#03090a]/80 border border-glow/25 flex flex-col gap-2 text-center">
              <span className="font-display text-4xl font-extrabold text-brand">
                <AnimatedCounter end={3} suffix=" Hubs" />
              </span>
              <span className="text-xs font-medium text-slate-400">Ilorin &bull; Ibadan &bull; Abuja</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#03090a]/80 border border-glow/25 flex flex-col gap-2 text-center">
              <span className="font-display text-4xl font-extrabold text-brand">
                <AnimatedCounter end={3} suffix=" Days/Wk" />
              </span>
              <span className="text-xs font-medium text-slate-400">Free Guided Site Tours</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
