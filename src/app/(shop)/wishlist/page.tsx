'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Zap } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { byId } from '@/lib/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { Product } from '@/types';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  const savedProducts: Product[] = wishlist
    .map((id) => byId(id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--mute)] mb-6">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-semibold">Saved Equipment</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
          Saved <em className="serif-italic">For Projects</em>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--mute)] max-w-md mt-1">
          Your shortlisted clean energy systems and smart architectural items are preserved here for quick consultation or ordering.
        </p>
      </div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-4 rounded-3xl border border-dashed border-glow/25 bg-gradient-to-br from-glow/10 to-brand/5">
          <div className="w-16 h-16 rounded-full bg-brand/15 text-brand flex items-center justify-center mb-2">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-bold text-[var(--ink)]">No Shortlisted Systems Yet</h3>
          <p className="text-xs sm:text-sm text-[var(--mute)] max-w-sm">
            Tap the heart icon on any clean energy system, smart lock, or lighting fixture in our catalog to keep it saved right here.
          </p>
          <div className="pt-2">
            <Link href="/shop" className="btn-primary text-xs py-3 px-6">
              Browse Equipment Catalog <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}