'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Share2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { byId, CFG, PAL } from '@/lib/products';
import { money, generateOrderText, waLink, lineKey } from '@/lib/utils';
import { ProductArt } from '@/components/shop/ProductArt';
import { ProductImage } from '@/components/shop/ProductImage';
import { ShareCartModal, decodeSharedCart } from '@/components/shop/ShareCartModal';
import { DeliveryEstimator } from '@/components/shop/DeliveryEstimator';

function CartContent() {
  const {
    cart,
    subtotal,
    discount,
    promoApplied,
    promoCode,
    setQty,
    removeItem,
    applyPromo,
    replaceCart,
  } = useCart();

  const searchParams = useSearchParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [restoredBanner, setRestoredBanner] = useState<string | null>(null);

  const [inputCode, setInputCode] = useState(promoCode);
  const [promoMessage, setPromoMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Restore cart from ?share=... query parameter if present
  useEffect(() => {
    const shareParam = searchParams.get('share');
    if (shareParam) {
      const decoded = decodeSharedCart(shareParam);
      if (decoded.length > 0) {
        replaceCart(decoded);
        setRestoredBanner(
          `Loaded ${decoded.length} shared equipment ${
            decoded.length === 1 ? 'item' : 'items'
          } from quote link!`
        );
        setTimeout(() => setRestoredBanner(null), 8000);
      }
    }
  }, [searchParams, replaceCart]);

  const freeThreshold = CFG.freeOver;
  const currentTotal = subtotal - discount;
  const amountLeft = Math.max(0, freeThreshold - currentTotal);
  const progressPercent = Math.min(100, (currentTotal / freeThreshold) * 100);

  const handleApplyPromo = () => {
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    setPromoMessage({ text: res.message, isError: !res.success });
  };

  const whatsappCartMessage = generateOrderText(null, cart, subtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex items-center justify-center text-brand">
          <Zap className="w-12 h-12" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
          Your project cart is <em className="serif-italic">empty</em>
        </h1>
        <p className="text-sm text-[var(--mute)] max-w-sm mx-auto">
          Explore our clean energy systems, smart living devices, and architectural collections to build your order.
        </p>
        <div>
          <Link href="/shop" className="btn-primary text-xs py-3 px-8">
            Explore Equipment <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--mute)] mb-6">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand transition-colors">
          Catalog
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-semibold">Cart</span>
      </nav>

      {/* Restored from Share Link Notice */}
      {restoredBanner && (
        <div className="mb-6 p-4 rounded-2xl border border-brand/40 bg-brand/10 text-brand text-xs sm:text-sm font-semibold flex items-center justify-between">
          <span>{restoredBanner}</span>
          <button
            onClick={() => setRestoredBanner(null)}
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
          Equipment &amp; <em className="serif-italic">System Order</em>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--mute)] mt-1">
          Review your chosen hardware, apply enterprise discounts, or share this bill with your procurement team.
        </p>
      </div>

      {/* Free Logistics Progress Bar */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-2 font-medium">
          <span className="text-[var(--ink)]">
            {amountLeft === 0 ? (
              <strong className="text-emerald-400 font-bold">
                🎉 Free regional logistics unlocked for your order!
              </strong>
            ) : (
              <>
                Add <b className="text-brand">{money(amountLeft)}</b> more equipment to qualify for{' '}
                <strong className="text-[var(--ink)]">free regional freight</strong>!
              </>
            )}
          </span>
          <span className="text-xs text-[var(--mute)] font-mono">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-glow/25">
          <div
            className="bg-brand h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Cart Items (Left 8 cols) & Summary (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Items */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="divide-y divide-glow/15 border-y border-glow/15">
            {cart.map((item, idx) => {
              const product = byId(item.id);
              if (!product) return null;

              const lineTotal = product.price * item.qty;

              return (
                <div
                  key={`${item.id}-${item.color}-${item.size || ''}-${idx}`}
                  className="py-5 sm:py-6 flex gap-4 sm:gap-6 items-start"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${product.id}`}
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[var(--surface2)] border border-glow/25 flex-shrink-0 relative group"
                  >
                    <ProductImage
                      src={product.images?.[0]}
                      alt={product.name}
                      fallbackArt={{
                        type: product.art || 'solar',
                        color: item.color,
                        view: 0,
                      }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${product.id}`}
                        className="font-display font-semibold text-sm sm:text-base text-[var(--ink)] hover:text-brand transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(lineKey(item))}
                        className="text-[var(--mute)] hover:text-rose-400 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Variant specs */}
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[var(--mute)]">
                      <span>Finish: <strong className="text-[var(--ink2)] capitalize">{PAL[item.color]?.n || item.color}</strong></span>
                      {item.size && (
                        <>
                          <span>•</span>
                          <span>Spec: <strong className="text-[var(--ink2)]">{item.size}</strong></span>
                        </>
                      )}
                    </div>

                    {/* Stepper & Price Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                      {/* Stepper */}
                      <div className="inline-flex items-center border border-glow/25 rounded-full h-8 sm:h-9 px-1.5 bg-[var(--surface)]">
                        <button
                          onClick={() => setQty(lineKey(item), item.qty - 1)}
                          className="w-7 h-full flex items-center justify-center text-[var(--mute)] hover:text-brand active:scale-95"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-mono text-[var(--ink)]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(lineKey(item), item.qty + 1)}
                          className="w-7 h-full flex items-center justify-center text-[var(--mute)] hover:text-brand active:scale-95"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="font-display font-bold text-sm sm:text-base text-[var(--ink)]">
                          {money(lineTotal)}
                        </span>
                        {item.qty > 1 && (
                          <span className="block text-[11px] text-[var(--mute)]">
                            {money(product.price)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--mute)] hover:text-brand transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Add More Equipment
            </Link>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Cart / Request Quote
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl space-y-5">
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">
              Order Summary
            </h3>

            {/* Subtotal, Discount, etc */}
            <div className="space-y-3 text-sm border-b border-glow/15 pb-4">
              <div className="flex justify-between">
                <span className="text-[var(--mute)]">Hardware Subtotal</span>
                <span className="font-semibold text-[var(--ink)]">{money(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Promo Discount ({promoCode})
                  </span>
                  <span className="font-semibold">-{money(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-[var(--mute)]">
                <span>Freight &amp; Delivery Fee</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter discount code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="input-field uppercase text-xs flex-1 py-2"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="btn-ghost text-xs px-4 border border-glow/25"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p
                  className={`text-xs ${
                    promoMessage.isError ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Total */}
            <div className="pt-2 flex justify-between items-baseline border-t border-glow/15">
              <span className="font-display font-bold text-base text-[var(--ink)]">Estimated Total</span>
              <span className="font-display font-extrabold text-2xl text-brand">
                {money(currentTotal)}
              </span>
            </div>

            {/* Proceed to Checkout CTA */}
            <Link
              href="/checkout"
              className="btn-primary w-full h-12 justify-center text-sm shadow-xl active:scale-98 transition-all"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>

            {/* WhatsApp Alternative */}
            <a
              href={waLink(whatsappCartMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa w-full h-11 justify-center text-xs"
            >
              <MessageSquare className="w-4 h-4 mr-1.5" /> Order via WhatsApp Direct
            </a>
          </div>

          {/* Delivery Estimator Mini */}
          <DeliveryEstimator cartTotal={currentTotal} compact={true} />

          {/* Social Cart Share Modal */}
          <ShareCartModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            cart={cart}
            subtotal={currentTotal}
          />
        </aside>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--mute)]">Loading your project cart...</p>
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}