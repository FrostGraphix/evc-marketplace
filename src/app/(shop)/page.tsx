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
  Zap,
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
              Ilorin &bull; Ibadan &bull; Abuja &bull; Nationwide
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.92] text-white">
              <span className="block overflow-hidden py-1">
                <span className="inline-block">Smart Living.</span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="inline-block text-brand">
                  <em className="serif-italic text-white">Clean</em> Energy.
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              EVC Nigeria is your premier marketplace for high-efficiency solar inverters, lithium energy storage, smart automation, and designer architectural finishes.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/shop" className="btn-primary text-sm inline-flex items-center gap-2">
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={waLink('Hello EVC Nigeria, I would like to inquire about solar systems and smart tech products.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm text-[#25d366] hover:border-[#25d366] hover:bg-green-500/10 inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>

            {/* Trust Bullet Items */}
            <ul className="flex flex-wrap items-center gap-4 sm:gap-8 pt-4 text-xs sm:text-sm font-medium text-slate-400">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand" /> Fast Nationwide Delivery
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand" /> Official Warranty & Support
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" /> 24/7 Technical Inquiry
              </li>
            </ul>
          </div>

          {/* Right Hero Interactive 3D Parallax Cards Stage */}
          <div
            ref={heroArtRef}
            className="lg:col-span-5 relative aspect-square max-w-[500px] mx-auto w-full"
            style={{ ['--mx' as any]: 0, ['--my' as any]: 0 }}
          >
            {/* Card 1: Solar Inverter */}
            <Link
              href="/product/1"
              className="absolute left-0 top-[2%] w-[48%] aspect-[1/1.18] rounded-3xl overflow-hidden bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{
                transform:
                  'translate(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -10px)) rotate(-6deg)',
              }}
            >
              <ProductImage
                src={byId(1)?.images?.[0]}
                alt="EVC Hybrid Solar Inverter"
                fallbackArt={{ type: 'inverter', color: 'orange', view: 0 }}
              />
              <div className="absolute left-2.5 right-2.5 bottom-2.5 z-10 px-3 py-1.5 rounded-full bg-[#03090a]/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-[11px] font-semibold text-white">
                <span>Inverter 5kVA</span>
                <b className="text-brand">{money(byId(1)?.price || 350000)}</b>
              </div>
            </Link>

            {/* Card 2: Smart Lock */}
            <Link
              href="/product/2"
              className="absolute right-0 top-[10%] w-[48%] aspect-[1/1.15] rounded-3xl overflow-hidden bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl transition-transform duration-300 hover:scale-105"
              style={{
                transform:
                  'translate(calc(var(--mx, 0) * 18px), calc(var(--my, 0) * 12px)) rotate(6deg)',
              }}
            >
              <ProductImage
                src={byId(2)?.images?.[0]}
                alt="EVC Smart Lock"
                fallbackArt={{ type: 'smartlock', color: 'black', view: 0 }}
              />
              <div className="absolute left-2.5 right-2.5 bottom-2.5 z-10 px-3 py-1.5 rounded-full bg-[#03090a]/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-[11px] font-semibold text-white">
                <span>Smart Lock</span>
                <b className="text-brand">{money(byId(2)?.price || 125000)}</b>
              </div>
            </Link>

            {/* Card 3: Lithium Battery */}
            <Link
              href="/product/3"
              className="absolute left-[26%] bottom-[0%] w-[46%] aspect-[1/1.1] rounded-3xl overflow-hidden bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl transition-transform duration-300 hover:scale-105 z-10"
              style={{
                transform:
                  'translate(calc(var(--mx, 0) * -8px), calc(var(--my, 0) * 16px)) rotate(-2deg)',
              }}
            >
              <ProductImage
                src={byId(3)?.images?.[0]}
                alt="EVC Powerwall Lithium Battery"
                fallbackArt={{ type: 'powerwall', color: 'orange', view: 0 }}
              />
              <div className="absolute left-2.5 right-2.5 bottom-2.5 z-10 px-3 py-1.5 rounded-full bg-[#03090a]/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-[11px] font-semibold text-white">
                <span>Powerwall</span>
                <b className="text-brand">{money(byId(3)?.price || 780000)}</b>
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
              <Zap className="w-7 h-7 text-brand" />
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

      {/* Stacked Category Cards: Shop by world */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Browse Categories
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mt-1 max-w-lg text-white">
              Engineered for modern living and reliable power.
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            From smart biometric security to clean renewable solar backup, explore our certified catalog across Nigeria.
          </p>
        </div>

        <StackedCards />
      </section>

      {/* Picks of the Week: Dual-Row Sliding Shelves */}
      <section className="w-full overflow-hidden py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 flex items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Featured Solutions
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mt-1 text-white">
              Trending across Nigeria.
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            View all products <ArrowRight className="w-4 h-4" />
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
              Seamless Ordering
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mt-1 text-white">
              Order directly or chat with our engineering consultants.
            </h2>
          </div>

          <HowItWorksPhone />
        </div>
      </section>

      {/* Budget Shelf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <BudgetShelf />
      </section>

      {/* Custom Procurement Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-16">
        <div className="rounded-[40px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 text-white p-8 sm:p-12 md:p-16 relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="md:col-span-7 flex flex-col gap-4 relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">
              Bespoke Projects & Solar Audits
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-white">
              Need a full solar load audit or architectural finish plan?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
              Our engineering team conducts precise load analyses, designs custom lithium backup setups, and provides architectural surface samples for residences and estates.
            </p>
            <div className="pt-2">
              <a
                href={waLink('Hello EVC Nigeria, I would like to request an energy audit / architectural consultation.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Request Consultation
              </a>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-4 relative z-10">
            <div className="p-6 rounded-3xl bg-[#03090a]/80 border border-glow/25 flex flex-col gap-2 text-center">
              <span className="font-display text-4xl font-extrabold text-brand">
                <AnimatedCounter end={1200} suffix="+" />
              </span>
              <span className="text-xs font-medium text-slate-400">Solar & Tech Deployments</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#03090a]/80 border border-glow/25 flex flex-col gap-2 text-center">
              <span className="font-display text-4xl font-extrabold text-brand">
                <AnimatedCounter end={99} suffix="%" />
              </span>
              <span className="text-xs font-medium text-slate-400">Customer Satisfaction</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#03090a]/80 border border-glow/25 flex flex-col gap-2 text-center">
              <span className="font-display text-4xl font-extrabold text-brand">
                <AnimatedCounter end={3} suffix=" Hubs" />
              </span>
              <span className="text-xs font-medium text-slate-400">Ilorin &bull; Ibadan &bull; Abuja</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#03090a]/80 border border-glow/25 flex flex-col gap-2 text-center">
              <span className="font-display text-4xl font-extrabold text-brand">
                <AnimatedCounter end={24} suffix="/7" />
              </span>
              <span className="text-xs font-medium text-slate-400">Engineering Inquiry Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
