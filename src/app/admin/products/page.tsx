'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProductArt } from '@/components/shop/ProductArt';
import { Product } from '@/types';
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  Edit3,
  Copy,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Boxes,
  TrendingUp,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Tag,
  Sparkles,
  Zap,
} from 'lucide-react';
import { money } from '@/lib/utils';
import { useModal } from '@/context/ModalContext';
import { ProductImage } from '@/components/shop/ProductImage';

export default function AdminProductsPage() {
  const router = useRouter();
  const { confirm } = useModal();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setToast({ message: 'Failed to load catalog products', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCat !== 'all' && p.cat !== selectedCat) return false;

      // Stock filter
      const stock = p.stock ?? 10;
      if (stockFilter === 'out_of_stock' && stock > 0) return false;
      if (stockFilter === 'low_stock' && (stock <= 0 || stock > 5)) return false;
      if (stockFilter === 'in_stock' && stock <= 5) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.desc?.toLowerCase().includes(q) || false;
        const matchesCat = p.cat?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [products, selectedCat, stockFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Delete product action
  const handleDelete = async (id: number, name: string) => {
    const ok = await confirm({
      title: `Delete Equipment`,
      message: `Are you sure you want to permanently delete "${name}" from the EVC catalog? This action cannot be undone.`,
      confirmText: 'Delete Product',
      variant: 'error',
    });

    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setToast({ message: `Successfully removed ${name}`, type: 'success' });
      } else {
        throw new Error('Failed to delete');
      }
    } catch {
      setToast({ message: `Could not delete ${name}. Please try again.`, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            Hardware &amp; Equipment Inventory
          </h1>
          <p className="text-xs text-[var(--mute)] mt-1">
            Maintain solar inverters, lithium batteries, smart sensors, and architectural fixtures.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="btn-ghost text-xs py-2 px-3.5 border border-glow/25 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand' : ''}`} />
            <span>Sync</span>
          </button>
          <Link
            href="/admin/products/new"
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Equipment</span>
          </Link>
        </div>
      </div>

      {toast && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="underline hover:opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <input
            type="text"
            placeholder="Search equipment by title, specs, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full pl-9 text-xs"
          />
          <Search className="w-3.5 h-3.5 text-[var(--mute)] absolute left-3 top-3" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Category filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="input-field text-xs py-1.5"
          >
            <option value="all">All Categories</option>
            <option value="solar">Solar &amp; Clean Energy</option>
            <option value="smart-tech">Smart Tech &amp; IoT</option>
            <option value="finishes">Architectural Finishes</option>
            <option value="furniture">Executive Furniture</option>
            <option value="living">Everyday Living</option>
          </select>

          {/* Stock filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="input-field text-xs py-1.5"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">Healthy Stock (&gt; 5)</option>
            <option value="low_stock">Low Stock (1 – 5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-[var(--mute)] uppercase text-[10px] tracking-wider border-b border-glow/15">
              <tr>
                <th className="py-3 px-4">Product / Hardware</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glow/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--mute)]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand mb-2" />
                    Loading catalog inventory...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--mute)]">
                    No products found matching query.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const stock = p.stock ?? 12;
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/40 border border-glow/25 flex-shrink-0 relative">
                            <ProductImage
                              src={p.images?.[0]}
                              alt={p.name}
                              fallbackArt={{
                                type: p.art || 'solar',
                                color: p.colors?.[0] || 'black',
                                view: 0,
                              }}
                            />
                          </div>
                          <div>
                            <strong className="text-white block font-medium truncate max-w-xs">
                              {p.name}
                            </strong>
                            <span className="text-[11px] text-[var(--mute)] font-mono">
                              ID: #{p.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-brand">
                        {p.cat}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {money(p.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        {stock === 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            Out of stock
                          </span>
                        ) : stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            {stock} left (Low)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {stock} available
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {p.badge ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand/20 text-brand border border-brand/30">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-[var(--mute)]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${p.id}`}
                            target="_blank"
                            className="p-1.5 text-[var(--mute)] hover:text-white transition-colors"
                            title="Preview on Store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="btn-ghost text-xs py-1 px-2.5 border border-glow/25 inline-flex items-center gap-1 text-white hover:text-brand"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-[var(--mute)] hover:text-rose-400 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-glow/15 flex items-center justify-between text-xs text-[var(--mute)]">
            <span>
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-ghost text-xs py-1 px-3 border border-glow/25 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-ghost text-xs py-1 px-3 border border-glow/25 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}