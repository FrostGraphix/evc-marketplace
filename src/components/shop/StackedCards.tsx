'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CATS, PRODUCTS } from '@/lib/products';
import { money } from '@/lib/utils';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductImage } from './ProductImage';

const CARD_THEMES = [
  { bg: '#08131d', text: '#f8fafc', sub: 'rgba(248,250,252,0.75)', border: 'rgba(255,122,51,0.25)' },
  { bg: '#03090a', text: '#f8fafc', sub: 'rgba(248,250,252,0.7)', border: 'rgba(255,255,255,0.12)' },
  { bg: '#0d1b26', text: '#f8fafc', sub: 'rgba(248,250,252,0.8)', border: 'rgba(242,101,34,0.3)' },
  { bg: '#131e29', text: '#f8fafc', sub: 'rgba(248,250,252,0.8)', border: 'rgba(255,255,255,0.15)' },
  { bg: '#0a151f', text: '#f8fafc', sub: 'rgba(248,250,252,0.8)', border: 'rgba(255,122,51,0.25)' },
];

const TOP_5_CATEGORY_IDS = [
  'residential-estates',
  'corridor-developments',
  'farmland-agricultural',
  'housing-developments',
  'smart-tech-cities',
];

export const StackedCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCats = TOP_5_CATEGORY_IDS
    .map((id) => CATS.find((c) => c.id === id))
    .filter((c): c is typeof CATS[0] => Boolean(c));

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll<HTMLElement>('.stack-card');
      if (!cards.length) return;

      const topOffset = 96;
      cards.forEach((card, idx) => {
        const nextCard = cards[idx + 1];
        if (!nextCard) return;

        const h = card.offsetHeight;
        const stickyTop = topOffset + idx * 16;
        const nextTop = nextCard.getBoundingClientRect().top;
        const progress = Math.min(Math.max(1 - (nextTop - stickyTop) / (h * 0.95), 0), 1);

        card.style.transform = `scale(${1 - progress * 0.04})`;
        card.style.filter = `brightness(${1 - progress * 0.35})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-8 pb-12 relative">
      {displayCats.map((cat, i) => {
        const items = PRODUCTS.filter((p) => p.cat === cat.id);
        const fromPrice = items.length ? Math.min(...items.map((p) => p.price)) : 25000;
        const theme = CARD_THEMES[i % CARD_THEMES.length];
        const previewItem1 = items[0];
        const previewItem2 = items[1] || items[0];

        return (
          <article
            key={cat.id}
            className="stack-card sticky rounded-3xl sm:rounded-[36px] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[420px] h-[min(70vh,540px)] border will-change-transform shadow-xl"
            style={{
              top: `calc(96px + ${i * 16}px)`,
              backgroundColor: theme.bg,
              color: theme.text,
              borderColor: theme.border,
              transformOrigin: '50% 0',
            }}
          >
            {/* Left Content Column */}
            <div className="md:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between gap-6 relative z-10">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
                <span className="px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                  {items.length} {items.length === 1 ? 'Project Listed' : 'Projects Listed'}
                </span>
                <span className="px-3 py-1 rounded-full border border-brand/50 text-brand-light backdrop-blur-sm">
                  From {money(fromPrice)}
                </span>
              </div>

              <div>
                <h3 className="font-display text-3xl sm:text-5xl md:text-5xl font-bold tracking-tight text-white">
                  {cat.name}
                </h3>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm max-w-md leading-relaxed text-slate-300">
                  {cat.blurb}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={`/shop?cat=${cat.id}`}
                  className="btn-primary text-xs py-3 px-6"
                >
                  Explore Portfolio <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-slate-400">
                  Backed by EVC Title Guarantee &amp; Physical Allocation
                </span>
              </div>
            </div>

            {/* Right Product Previews Column */}
            <div className="md:col-span-5 p-6 sm:p-8 flex items-center justify-center relative bg-gradient-to-l from-black/40 to-transparent">
              {previewItem1 && (
                <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 p-2">
                  <ProductImage
                    src={previewItem1.images?.[0]}
                    alt={previewItem1.name}
                    fallbackArt={{ type: previewItem1.art, color: previewItem1.colors[0], view: 0 }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs">
                    <span className="block font-semibold truncate">{previewItem1.name}</span>
                    <span className="text-[11px] text-brand-light font-mono font-bold">{money(previewItem1.price)}</span>
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};
