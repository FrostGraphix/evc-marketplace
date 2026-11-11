'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import { ProductCard } from './ProductCard';

export const BudgetShelf: React.FC = () => {
  const shelfRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // High-yield entry properties under ₦2,000,000 or sorted by price for accessible plots
  const accessibleProducts = PRODUCTS.filter((p) => p.price <= 2000000).sort(
    (a, b) => a.price - b.price
  );

  const scroll = (direction: 'left' | 'right') => {
    if (shelfRef.current) {
      const scrollAmount = shelfRef.current.clientWidth * 0.75;
      shelfRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const sh = shelfRef.current;
    if (!sh) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let moved = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      isDown = true;
      moved = 0;
      startX = e.clientX;
      scrollLeft = sh.scrollLeft;
      setIsDragging(true);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      moved = Math.abs(dx);
      sh.scrollLeft = scrollLeft - dx;
    };

    const handlePointerUp = () => {
      isDown = false;
      setTimeout(() => setIsDragging(false), 50);
    };

    const handleClick = (e: MouseEvent) => {
      if (moved > 5) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };

    sh.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    sh.addEventListener('click', handleClick, true);

    return () => {
      sh.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      sh.removeEventListener('click', handleClick, true);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> High-Yield Entry Opportunities
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mt-1">
            Prime Plots Under ₦2,000,000
          </h2>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-glow/25 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition-all active:scale-95 text-[var(--ink)]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-glow/25 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition-all active:scale-95 text-[var(--ink)]"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={shelfRef}
        className={`flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none scroll-smooth select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {accessibleProducts.map((p) => (
          <div
            key={p.id}
            className="w-[260px] sm:w-[280px] md:w-[300px] flex-shrink-0"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};
