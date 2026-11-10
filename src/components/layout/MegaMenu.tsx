'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATS, PRODUCTS } from '@/lib/products';
import { ProductArt } from '@/components/shop/ProductArt';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  onClose?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const pathname = usePathname();
  const [activeCat, setActiveCat] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setActiveCat(params.get('cat'));
    }
  }, [pathname]);

  const featuredProduct = PRODUCTS[0]; // EVC Pro 5kW Hybrid Inverter

  return (
    <div
      role="region"
      aria-label="Shop categories menu"
      className="absolute left-4 right-4 top-[calc(100%+12px)] p-5 md:p-6 rounded-3xl bg-[var(--surface)]/95 backdrop-blur-2xl border border-[var(--line)] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Category Grid */}
        <div className="lg:col-span-8 xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CATS.map((cat) => {
            const count = PRODUCTS.filter((p) => p.cat === cat.id).length;
            const isSelected = pathname === '/shop' && activeCat === cat.id;
            return (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.id}`}
                onClick={onClose}
                className={`group relative flex items-start gap-3 p-3 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
                  isSelected
                    ? 'bg-brand/10 border-brand/40'
                    : 'border-[var(--line)] hover:border-brand/40 hover:bg-[var(--surface2)]'
                }`}
              >
                {/* Art Thumbnail with clean outline */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--surface2)] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex items-center justify-center p-1">
                  <ProductArt type={cat.art[0]} color={cat.cols[0]} view={0} />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <strong className="block font-display text-sm font-semibold text-[var(--ink)] group-hover:text-brand transition-colors duration-200 leading-snug">
                    {cat.name}
                  </strong>
                  <p className="text-[11px] text-[var(--mute)] line-clamp-2 mt-1 leading-normal">
                    {cat.blurb}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-brand mt-1.5">
                    {count > 0 ? `${count} items` : 'Explore catalog'} &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured Promo Card with clean outline */}
        <div className="lg:col-span-4 xl:col-span-4">
          <Link
            href={`/product/${featuredProduct.id}`}
            onClick={onClose}
            className="group/card relative rounded-2xl p-5 border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 text-white overflow-hidden flex flex-col justify-between h-full min-h-[220px] transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand text-white border border-brand-light/30">
                <Sparkles className="w-3 h-3" /> Featured Innovation
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="relative z-10 my-3">
              <strong className="block font-display text-lg font-bold text-white group-hover/card:text-brand-light transition-colors line-clamp-2">
                {featuredProduct.name}
              </strong>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {featuredProduct.desc}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10">
              <span className="font-display font-extrabold text-base text-white">
                From ₦485,000
              </span>
              <span className="btn-primary text-xs py-1.5 px-3.5">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
