'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled EVC application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-[#03090a]">
      <div className="w-16 h-16 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 text-brand flex items-center justify-center mb-4">
        <RotateCcw className="w-8 h-8" />
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-slate-100">
        Something went wrong
      </h2>
      <p className="text-slate-400 text-sm max-w-md mb-6">
        An unexpected error occurred while loading this page. You can try refreshing or return to the EVC storefront.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="btn-primary text-sm py-2.5 px-6 inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Try again
        </button>
        <Link
          href="/"
          className="btn-ghost text-sm py-2.5 px-6 inline-flex items-center gap-2 text-slate-300 hover:text-white"
        >
          <Home className="w-4 h-4" /> Return Home
        </Link>
      </div>
    </div>
  );
}
