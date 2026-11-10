'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, RotateCcw, MessageSquare, SlidersHorizontal } from 'lucide-react';
import { CATS, PRODUCTS } from '@/lib/products';
import { Product, Category } from '@/types';
import { money, waLink } from '@/lib/utils';
import { ProductCard } from '@/components/shop/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const initialQ = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedCat, setSelectedCat] = useState<string>(initialCat);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [searchQuery, setSearchQuery] = useState<string>(initialQ);
  const [sortBy, setSortBy] = useState<'featured' | 'low' | 'high' | 'az'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const maxCatalogPrice = useMemo(() => {
    return Math.max(1000000, ...products.map((p) => p.price || 0));
  }, [products]);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setSelectedCat(cat);
    } else if (!searchParams.has('cat')) {
      setSelectedCat('all');
    }
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (Array.isArray(data.products) && data.products.length > 0) {
              setProducts(data.products);
            }
            if (Array.isArray(data.categories) && data.categories.length > 0) {
              setCategories(data.categories);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load dynamic catalog from /api/products, using static fallback:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchCat = selectedCat === 'all' || p.cat === selectedCat;
      const matchPrice = p.price <= maxPrice;
      const matchQuery =
        !searchQuery.trim() ||
        `${p.name} ${p.desc} ${p.cat}`.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchPrice && matchQuery;
    });

    if (sortBy === 'low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'az') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCat, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCat('all');
    setMaxPrice(maxCatalogPrice);
    setSearchQuery('');
    setSortBy('featured');
  };

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCat) || { name: 'Catalog', id: 'all' };
  }, [categories, selectedCat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 bg-[#03090a] text-slate-100 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-white font-semibold">Shop</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          {selectedCat === 'all' ? (
            <>
              All <em className="serif-italic text-brand">Solutions</em>
            </>
          ) : (
            currentCategory.name
          )}
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mt-2 leading-relaxed">
          Engineered solar inverters, lithium powerwalls, biometric locks, smart switches, and architectural finishes across Nigeria.
        </p>
      </div>

      {/* Mobile Category Chips */}
      <div className="flex lg:hidden gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedCat('all')}
          className={`flex-none text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
            selectedCat === 'all'
              ? 'bg-brand text-white border-transparent'
              : 'bg-[#03090a] border-slate-800 text-slate-300'
          }`}
        >
          All ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`flex-none text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
              selectedCat === cat.id
                ? 'bg-brand text-white border-transparent'
                : 'bg-[#03090a] border-slate-800 text-slate-300'
            }`}
          >
            {cat.name} ({products.filter((p) => p.cat === cat.id).length})
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 p-6 rounded-3xl bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-sm space-y-6">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Categories
            </h4>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedCat('all')}
                className={`flex items-center justify-between text-xs font-semibold py-2 px-3 rounded-xl transition-all ${
                  selectedCat === 'all'
                    ? 'bg-brand text-white'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>All Products</span>
                <span className="opacity-70 font-mono">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.cat === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`flex items-center justify-between text-xs font-semibold py-2 px-3 rounded-xl transition-all ${
                      selectedCat === cat.id
                        ? 'bg-brand text-white'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="opacity-70 font-mono">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Max Price
            </h4>
            <input
              type="range"
              min="5000"
              max={maxCatalogPrice}
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
              <span>₦5,000</span>
              <span className="font-bold text-brand">{money(maxPrice)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={resetFilters}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-700 hover:border-brand text-slate-300 hover:text-white transition-all inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        </aside>

        {/* Products Grid Content */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#03090a] border border-glow/25">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search solar, smart locks, finishes..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#03090a] border border-slate-800 text-xs text-white placeholder:text-slate-500 outline-none focus:border-brand transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 px-3 rounded-xl bg-[#03090a] border border-slate-800 text-xs text-slate-200 outline-none focus:border-brand cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="az">Alphabetical (A-Z)</option>
              </select>

              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden h-10 px-3 rounded-xl border border-slate-800 bg-[#03090a] text-slate-300 inline-flex items-center gap-1.5 text-xs font-medium"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
          </div>

          {/* Mobile Filter Drawer / Toggle */}
          {showMobileFilters && (
            <div className="lg:hidden p-5 rounded-2xl bg-[#03090a] border border-glow/25 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Max Price</label>
                <input
                  type="range"
                  min="5000"
                  max={maxCatalogPrice}
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                  <span>₦5,000</span>
                  <span className="font-bold text-brand">{money(maxPrice)}</span>
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full py-2 text-xs font-semibold rounded-xl border border-slate-800 text-slate-300"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Results Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 p-8">
              <h3 className="font-display text-2xl font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No items match your selected filter criteria. Try adjusting the price range or search keywords.
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  onClick={resetFilters}
                  className="btn-ghost text-xs py-2.5 px-5 inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                </button>
                <a
                  href={waLink('Hello EVC Nigeria, I am looking for a specific solar or smart tech item.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-2.5 px-5 inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Ask on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-slate-400">Loading EVC catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
