'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';
import { PRODUCTS } from '@/lib/products';
import { Product } from '@/types';
import { ArrowLeft, RefreshCw, AlertCircle, Package } from 'lucide-react';

interface PageProps {
  params?: { id: string } | Promise<{ id: string }>;
}

export default function EditProductPage(props: PageProps) {
  const routeParams = useParams();
  const rawId =
    props?.params && typeof (props.params as any)?.then !== 'function'
      ? (props.params as any)?.id
      : routeParams?.id;
  const idStr = String(rawId || '');
  const router = useRouter();

  // Seed with static PRODUCTS data if matching
  const staticMatch = PRODUCTS.find((p) => String(p.id) === idStr);
  const [product, setProduct] = useState<Product | null>(staticMatch || null);
  const [loading, setLoading] = useState(!staticMatch);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idStr) return;

    let isMounted = true;
    const fetchLatestProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products?id=${idStr}`);
        if (res.ok) {
          const data = await res.json();
          if (data.product && isMounted) {
            setProduct(data.product);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('API lookup for product failed, relying on static match if present:', e);
      }

      if (isMounted) {
        if (!staticMatch) {
          setError(`Product #${idStr} could not be located in catalog.`);
        }
        setLoading(false);
      }
    };

    fetchLatestProduct();

    return () => {
      isMounted = false;
    };
  }, [idStr, staticMatch]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand" />
        <p className="text-sm font-semibold text-[var(--mute)]">Loading equipment studio data...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="font-display text-xl font-bold text-[var(--ink)]">Equipment Not Found</h2>
        <p className="text-xs text-[var(--mute)]">{error || 'Unable to locate this equipment record.'}</p>
        <Link href="/admin/products" className="btn-primary text-xs py-2 px-5 inline-flex">
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl border border-glow/25 bg-black/40 text-[var(--mute)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--ink)]">
              Edit Equipment #{product.id}
            </h1>
            <p className="text-xs text-[var(--mute)]">
              Modify specifications, capacity options, price, and media.
            </p>
          </div>
        </div>
      </div>

      <ProductForm initialProduct={product} mode="edit" />
    </div>
  );
}