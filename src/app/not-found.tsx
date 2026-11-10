import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-[#03090a]">
      <div className="w-16 h-16 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 text-brand flex items-center justify-center mb-4">
        <span className="font-display font-bold text-2xl">404</span>
      </div>
      <h2 className="font-display text-4xl font-bold mb-2 text-slate-100">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-md mb-6">
        Could not find requested resource. The page may have moved or no longer exists.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/" className="btn-primary text-sm py-2.5 px-6 inline-flex items-center gap-2">
          <Home className="w-4 h-4" /> Return to Home
        </Link>
        <Link href="/shop" className="btn-ghost text-sm py-2.5 px-6 inline-flex items-center gap-2 text-slate-300">
          <ArrowLeft className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>
    </div>
  );
}
