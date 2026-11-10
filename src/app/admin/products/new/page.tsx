'use client';

import React from 'react';
import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl border border-glow/25 bg-black/40 text-[var(--mute)] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--ink)]">
            Add New Equipment / System
          </h1>
          <p className="text-xs text-[var(--mute)]">
            Provision solar inverters, lithium powerwalls, smart locks, or architectural fixtures into the catalog.
          </p>
        </div>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}