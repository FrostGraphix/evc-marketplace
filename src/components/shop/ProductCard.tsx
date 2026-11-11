'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { PAL, catOf } from '@/lib/products';
import { money } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductImage } from './ProductImage';
import { flyToCart } from '@/lib/effects';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [heartPopping, setHeartPopping] = useState(false);
  const cardImgRef = useRef<HTMLDivElement>(null);

  const isSaved = isInWishlist(product.id);
  const isSoldOut = product.badge === 'SOLD OUT' || product.status === 'sold_out' || product.stock === 0;
  const primaryColor = product.colors[0];
  const alternateColor = product.colors[Math.min(1, product.colors.length - 1)];

  const primaryImage = product.images?.[0];
  const hoverImage = product.images?.[1] || product.images?.[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) {
      window.location.href = `/product/${product.slug || product.id}`;
      return;
    }
    addToCart(product.id, primaryColor, product.sizes ? product.sizes[0] : undefined);

    if (cardImgRef.current) {
      flyToCart(cardImgRef.current, primaryImage);
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    setHeartPopping(true);
    setTimeout(() => setHeartPopping(false), 500);
  };

  return (
    <article
      className="group relative flex flex-col gap-3 min-w-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage (Clean outline without box shadows or orange glow) */}
      <div
        ref={cardImgRef}
        className="relative block aspect-[1/1.08] rounded-[24px] overflow-hidden border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 transition-all duration-300 group-hover:-translate-y-1"
      >
        {/* Clickable Image Anchor (Navigates to detail page) */}
        <Link
          href={`/product/${product.slug || product.id}`}
          className="absolute inset-0 z-0"
          aria-label={`View details for ${product.name}`}
        >
          {/* Primary Image View */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isHovered && hoverImage && hoverImage !== primaryImage ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <ProductImage
              src={primaryImage}
              alt={product.name}
              priority={index < 4}
              fallbackArt={{ type: product.art, color: primaryColor, view: 0 }}
            />
          </div>

          {/* Alternate Hover Image View */}
          {hoverImage && hoverImage !== primaryImage && (
            <div
              className={`absolute inset-0 transition-all duration-300 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            >
              <ProductImage
                src={hoverImage}
                alt={`${product.name} alternate view`}
                fallbackArt={{ type: product.art, color: alternateColor, view: 1 }}
              />
            </div>
          )}
        </Link>

        {/* Badge: Sold Out / Title / Status */}
        {isSoldOut ? (
          <span className="absolute left-3 top-3 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase z-10 pointer-events-none border bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-sm backdrop-blur-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            SOLD OUT
          </span>
        ) : product.badge ? (
          <span
            className={`absolute left-3 top-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase z-10 pointer-events-none border ${
              product.badge === 'Sale'
                ? 'bg-brand text-white border-brand'
                : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            {product.badge}
          </span>
        ) : null}

        {/* Sold out banner overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-[#03090a]/40 backdrop-grayscale pointer-events-none flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-lg border border-rose-500/50 bg-[#03090a]/90 text-rose-400 font-display font-black text-xs tracking-widest uppercase rotate-[-8deg] shadow-lg">
              100% Sold Out
            </span>
          </div>
        )}

        {/* Wishlist Heart Button with clean outline */}
        <button
          onClick={handleToggleWish}
          className={`absolute right-3 top-3 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-[var(--line)] transition-all duration-200 hover:scale-110 active:scale-95 ${
            isSaved
              ? 'bg-brand text-white border-transparent'
              : 'bg-[var(--surface)]/90 text-[var(--ink)]'
          } ${heartPopping ? 'scale-125' : ''}`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Mobile Quick Add / View Button */}
        <button
          onClick={handleQuickAdd}
          className={`md:hidden absolute right-3 bottom-3 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md active:scale-90 transition-all border border-brand/30 ${
            isSoldOut
              ? 'bg-[#0a1628] text-rose-300 border-rose-500/40'
              : justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-brand text-white'
          }`}
          aria-label={isSoldOut ? 'View project' : 'Add to cart'}
        >
          {isSoldOut ? <span className="text-[10px] font-bold">INFO</span> : justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>

        {/* Desktop Quick Action Button on Hover */}
        <button
          onClick={handleQuickAdd}
          className={`hidden md:flex absolute left-3 right-3 bottom-3 z-10 items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 border ${
            isSoldOut
              ? 'bg-[#0a1628]/95 hover:bg-[#03090a] text-rose-300 border-rose-500/50'
              : 'bg-brand hover:bg-brand-deep text-white border-brand-light/30'
          }`}
        >
          {isSoldOut ? (
            <span>View Sold Project Details</span>
          ) : justAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <span>{product.sizes && product.sizes.length > 1 ? 'Quick Select Size' : 'Select Plot'}</span>
              <Plus className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Product Meta Section */}
      <div className="flex flex-col gap-1 px-1">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-brand">
          {catOf(product.cat).name}
        </span>
        <h3 className="font-display font-semibold text-sm sm:text-base leading-snug line-clamp-1">
          <Link
            href={`/product/${product.slug || product.id}`}
            className="hover:text-brand transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <div className="font-display font-bold text-sm sm:text-base flex items-baseline flex-wrap gap-1.5 text-[var(--ink)]">
            <span>{money(product.price)}</span>
            {product.was && (
              <s className="text-xs text-[var(--mute)] font-normal font-mono">
                {money(product.was)}
              </s>
            )}
          </div>

          {/* Color swatch dots */}
          {product.colors.length > 1 && (
            <div className="flex gap-1.5 items-center flex-shrink-0">
              {product.colors.slice(0, 3).map((colorKey) => (
                <span
                  key={colorKey}
                  className="w-3 h-3 rounded-full border border-white/60"
                  style={{ backgroundColor: PAL[colorKey]?.main || '#f26522' }}
                  title={PAL[colorKey]?.n || colorKey}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-[var(--mute)] font-mono font-medium">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
