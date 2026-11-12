'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Clock,
  Plus,
  Minus,
  MessageSquare,
  ChevronDown,
  Maximize2,
  X,
  Check,
  Zap,
  MapPin,
  Calendar,
  FileCheck,
  AlertTriangle,
  BadgeCheck,
  Building,
} from 'lucide-react';
import { byId, bySlug, catOf, PAL, PRODUCTS, CFG } from '@/lib/products';
import { money, waLink } from '@/lib/utils';
import { ColorKey, Product } from '@/types';
import { ProductImage } from '@/components/shop/ProductImage';
import { ProductCard } from '@/components/shop/ProductCard';
import { useCart } from '@/context/CartContext';
import { DeliveryEstimator } from '@/components/shop/DeliveryEstimator';
import { ProductReviews } from '@/components/shop/ProductReviews';
import { useWishlist } from '@/context/WishlistContext';
import { flyToCart } from '@/lib/effects';

interface PageProps {
  params: Promise<{ id: string }>;
}

function parsePriceFromSize(sizeStr: string): number | null {
  if (!sizeStr) return null;
  const match = sizeStr.match(/₦\s*([0-9.,]+)\s*([KkMmBb])/);
  if (match) {
    const val = parseFloat(match[1].replace(/,/g, ''));
    const unit = match[2].toUpperCase();
    if (unit === 'M') return Math.round(val * 1_000_000);
    if (unit === 'K') return Math.round(val * 1_000);
    if (unit === 'B') return Math.round(val * 1_000_000_000);
  }
  return null;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const idParam = String(resolvedParams?.id || '');
  const numId = Number(idParam);
  const router = useRouter();

  // Initialize with static product if available for instant SSR/hydration
  const initialStaticProduct = !isNaN(numId) ? byId(numId) : bySlug(idParam);

  const [product, setProduct] = useState<Product | null>(initialStaticProduct || null);
  const [loading, setLoading] = useState<boolean>(!initialStaticProduct);
  const [notFoundState, setNotFoundState] = useState<boolean>(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(() => {
    if (initialStaticProduct) {
      return PRODUCTS.filter(
        (p) => p.cat === initialStaticProduct.cat && p.id !== initialStaticProduct.id
      ).slice(0, 4);
    }
    return [];
  });

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState<ColorKey>(
    initialStaticProduct?.colors?.[0] || 'orange'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    initialStaticProduct?.sizes?.[0] || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeGalleryView, setActiveGalleryView] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Lock body scroll when zoom modal is open
  useEffect(() => {
    if (!isZoomOpen) return;
    document.body.classList.add('locked');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('locked');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomOpen]);

  const [showStickyBar, setShowStickyBar] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'details' | 'delivery' | 'warranty' | null>(
    'details'
  );

  const mainCtaRef = useRef<HTMLDivElement>(null);
  const mainImgRef = useRef<HTMLDivElement>(null);

  // Fetch product from /api/products/[id] with live fallback for dynamic products
  useEffect(() => {
    let isMounted = true;

    async function fetchDynamicProduct() {
      if (!idParam) return;
      try {
        const res = await fetch(`/api/products/${idParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.product && isMounted) {
            setProduct(data.product);
            const rel = data.related || data.relatedProducts;
            if (Array.isArray(rel) && rel.length > 0) {
              setRelatedProducts(rel);
            } else if (data.product.cat) {
              setRelatedProducts(
                PRODUCTS.filter(
                  (p) => p.cat === data.product.cat && String(p.id) !== String(data.product.id)
                ).slice(0, 4)
              );
            }
            setNotFoundState(false);
          }
        } else if (res.status === 404) {
          if (!initialStaticProduct && isMounted) {
            setNotFoundState(true);
          }
        }
      } catch (err) {
        console.warn('Could not fetch dynamic product from /api/products/[id]:', err);
        if (!initialStaticProduct && isMounted) {
          setNotFoundState(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDynamicProduct();

    return () => {
      isMounted = false;
    };
  }, [idParam, initialStaticProduct]);

  // Sync color & size options when product loads
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0 && !product.colors.includes(selectedColor)) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0 && (!selectedSize || !product.sizes.includes(selectedSize))) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product, selectedColor, selectedSize]);

  // Monitor scroll position to show sticky mobile buy bar when scrolled past main CTA
  useEffect(() => {
    const handleScroll = () => {
      if (!mainCtaRef.current) return;
      const rect = mainCtaRef.current.getBoundingClientRect();
      const isPast = rect.bottom < 0;
      setShowStickyBar(isPast);
      document.body.classList.toggle('has-buybar', isPast);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('has-buybar');
    };
  }, []);

  if (loading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[var(--mute)] font-medium">Loading property portfolio details...</p>
      </div>
    );
  }

  if (notFoundState || (!loading && !product)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h2 className="font-display text-3xl font-bold mb-3">Property Project Not Found</h2>
        <p className="text-sm text-[var(--mute)] max-w-md mx-auto mb-6">
          The requested land estate or housing project might have been updated or archived.
        </p>
        <Link href="/shop" className="btn-primary text-xs py-2.5 px-6 inline-flex">
          Return to Property Portfolio
        </Link>
      </div>
    );
  }

  const currentProduct = product!;
  const isSaved = isInWishlist(currentProduct.id);
  const category = catOf(currentProduct.cat);
  const isSoldOut = currentProduct.status === 'sold_out' || currentProduct.badge === 'SOLD OUT';

  const activeColor: ColorKey =
    currentProduct.colors && currentProduct.colors.includes(selectedColor)
      ? selectedColor
      : currentProduct.colors?.[0] || 'orange';

  const activeSize: string =
    currentProduct.sizes && selectedSize && currentProduct.sizes.includes(selectedSize)
      ? selectedSize
      : currentProduct.sizes?.[0] || '';

  const dynamicPrice = parsePriceFromSize(activeSize) ?? currentProduct.price;

  const productImages =
    currentProduct.images && currentProduct.images.length > 0 ? currentProduct.images : [];

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(currentProduct.id, activeColor, activeSize, quantity);
    if (mainImgRef.current) {
      flyToCart(mainImgRef.current, productImages[activeGalleryView] || productImages[0]);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    addToCart(currentProduct.id, activeColor, activeSize, quantity);
    router.push('/checkout');
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const zx = ((e.clientX - rect.left) / rect.width) * 100;
    const zy = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--zx', `${zx}%`);
    el.style.setProperty('--zy', `${zy}%`);
  };

  const whatsappInquiryMessage = isSoldOut
    ? `Hello EVC Nig. Ltd, I am inquiring about secondary resale opportunities or upcoming phase releases for ${currentProduct.name}.`
    : `Hello EVC Nig. Ltd, I would like to reserve/order: ${quantity} x ${currentProduct.name} (${activeSize || 'Standard Plot'}) at ${money(dynamicPrice)} each.`;

  const whatsappInspectionMessage = `Hello EVC Nig. Ltd, I would like to schedule a physical site inspection for ${currentProduct.name} (${activeSize || 'Plot allocation'}). Please confirm available inspection days (Tuesdays, Thursdays, or Saturdays).`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 bg-[var(--bg)] text-[var(--ink)] min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--mute)] mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={`/shop?cat=${currentProduct.cat}`} className="hover:text-brand transition-colors">
          {category.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-semibold truncate max-w-xs sm:max-w-md">
          {currentProduct.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Gallery Column */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
          {/* Thumbnails list */}
          <div className="flex sm:flex-col gap-2.5 sm:gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none">
            {([0, 1, 2, 3] as const).map((idx) => {
              const thumbSrc = productImages[idx];
              return (
                <button
                  key={idx}
                  onClick={() => setActiveGalleryView(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[var(--surface2)] border-2 transition-all flex-shrink-0 relative ${
                    activeGalleryView === idx
                      ? 'border-brand scale-105 shadow-md shadow-brand/10'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`View angle ${idx + 1}`}
                >
                  <ProductImage
                    src={thumbSrc}
                    alt={`${currentProduct.name} thumbnail ${idx + 1}`}
                    fallbackArt={{
                      type: currentProduct.art || 'estate',
                      color: activeColor,
                      view: idx as 0 | 1 | 2 | 3,
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Main Large Stage */}
          <div
            ref={mainImgRef}
            onMouseMove={handleImageMouseMove}
            className="main-img-stage relative flex-1 aspect-[1/1.05] sm:aspect-square rounded-3xl sm:rounded-[36px] overflow-hidden bg-[var(--surface2)] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl group"
          >
            <ProductImage
              src={productImages[activeGalleryView] || productImages[0]}
              alt={`${currentProduct.name} view ${activeGalleryView + 1}`}
              priority={true}
              fallbackArt={{
                type: currentProduct.art || 'estate',
                color: activeColor,
                view: (activeGalleryView as 0 | 1 | 2 | 3) || 0,
              }}
            />

            {/* Sold Out Watermark Overlay */}
            {isSoldOut && (
              <div className="absolute inset-0 bg-[#03090a]/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/90 text-white font-extrabold text-sm uppercase tracking-widest border border-red-400 shadow-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  100% SOLD OUT
                </span>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-xs">
                  All plots in this project have been fully allocated and deeded.
                </p>
              </div>
            )}

            {/* Zoom / Lightbox Trigger */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute right-3.5 top-3.5 z-20 w-9 h-9 rounded-full bg-[var(--nav-bg)]/80 backdrop-blur-md border border-glow/25 flex items-center justify-center text-[var(--ink)] opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all shadow-md"
              aria-label="Zoom image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Badge */}
            {currentProduct.badge && (
              <span
                className={`absolute left-3.5 top-3.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md z-20 ${
                  isSoldOut ? 'bg-red-600 text-white' : 'bg-brand text-white'
                }`}
              >
                {currentProduct.badge}
              </span>
            )}

            <div className="absolute right-3.5 bottom-3.5 px-3 py-1.5 rounded-full bg-[var(--nav-bg)]/80 backdrop-blur-md border border-glow/25 text-[11px] font-semibold text-[var(--ink2)] pointer-events-none z-20 flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-brand" />
              Verified EVC Nig. Ltd Title
            </div>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-brand">
                {category.name}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium">Verified Master Plan</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mt-1 text-[var(--ink)]">
              {currentProduct.name}
            </h1>

            {/* Price and Stock status */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
                {money(dynamicPrice)}
              </span>
              {currentProduct.was && (
                <s className="text-sm sm:text-base text-[var(--mute)] font-mono">
                  {money(currentProduct.was)}
                </s>
              )}

              {isSoldOut ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/50 px-3 py-1 rounded-full border border-red-500/30">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Phase Fully Sold Out
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Plots Available &bull; Instant Allocation
                </span>
              )}
            </div>
          </div>

          {/* Sold Out Notice Box */}
          {isSoldOut && (
            <div className="p-4 rounded-2xl border border-red-500/30 bg-red-950/20 text-red-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <b className="block text-red-100 font-bold mb-1">Notice: Project Fully Subscribed</b>
                All plots in {currentProduct.name} have been acquired. You can inquire directly with our investment team for secondary market resales or secure priority allocation in the upcoming expansion phase.
              </div>
            </div>
          )}

          <p className="text-sm sm:text-base text-[var(--ink2)] leading-relaxed">
            {currentProduct.desc}
          </p>

          {/* Available Plot Size / Unit Selection */}
          {currentProduct.sizes && currentProduct.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--mute)]">
                  Available Plot Sizes / Units:
                </h4>
                <span className="text-xs font-bold text-brand">{activeSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                      activeSize === size
                        ? 'bg-brand text-white border-transparent shadow'
                        : 'bg-[var(--surface)] border-glow/25 text-[var(--ink)] hover:border-brand'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scheme / Palette Selector */}
          {currentProduct.colors && currentProduct.colors.length > 1 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-2.5">
                Layout Scheme: <b className="text-[var(--ink)] capitalize">{PAL[activeColor]?.n || activeColor}</b>
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {currentProduct.colors.map((cKey) => {
                  const isCurrent = activeColor === cKey;
                  return (
                    <button
                      key={cKey}
                      onClick={() => setSelectedColor(cKey)}
                      className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${
                        isCurrent
                          ? 'border-brand scale-110 shadow-md ring-2 ring-brand/20'
                          : 'border-[var(--line)] hover:scale-105'
                      }`}
                      aria-label={`Select ${PAL[cKey]?.n || cKey}`}
                      title={PAL[cKey]?.n || cKey}
                    >
                      <span
                        className="block w-full h-full rounded-full shadow-inner"
                        style={{ backgroundColor: PAL[cKey]?.main || '#f26522' }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Action CTAs */}
          <div ref={mainCtaRef} className="flex flex-col gap-3 pt-2">
            {isSoldOut ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={waLink(whatsappInquiryMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm h-12 flex-1 justify-center items-center shadow-lg"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Inquire for Resale &amp; Next Phase
                </a>
                <Link
                  href="/shop"
                  className="h-12 px-6 rounded-full font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center text-center"
                >
                  Browse Active Projects
                </Link>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center justify-between sm:justify-start border border-glow/25 rounded-full h-12 px-2 bg-[var(--surface)] w-full sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-[var(--mute)] hover:text-brand active:scale-95"
                      aria-label="Decrease plots"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold font-mono">
                      {quantity} {quantity === 1 ? 'Plot' : 'Plots'}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(50, quantity + 1))}
                      className="w-10 h-full flex items-center justify-center text-[var(--mute)] hover:text-brand active:scale-95"
                      aria-label="Increase plots"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="btn-primary text-sm flex-1 h-12 justify-center shadow-lg active:scale-98 transition-all"
                  >
                    {addedToast ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300 mr-2" /> Reserved to Order!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 mr-2" /> Reserve Plot
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="h-12 px-6 rounded-full font-semibold text-sm bg-white text-black hover:bg-neutral-200 active:scale-98 transition-all text-center flex items-center justify-center"
                  >
                    Instant Allocation
                  </button>
                </div>

                {/* Physical Inspection CTA */}
                <a
                  href={waLink(whatsappInspectionMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-all flex items-center justify-center gap-2 text-center shadow-md"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Schedule Free Physical Site Inspection (Tue, Thu, Sat)
                </a>
              </>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={waLink(whatsappInquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa text-xs py-2.5 px-4 flex-1 sm:flex-initial justify-center"
            >
              <MessageSquare className="w-4 h-4" /> Chat with Property Advisor
            </a>

            <button
              onClick={() => toggleWishlist(currentProduct.id)}
              className={`btn-ghost text-xs py-2.5 px-4 flex-1 sm:flex-initial justify-center border border-glow/25 ${
                isSaved ? 'text-brand border-brand' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved in Portfolio' : 'Bookmark Property'}
            </button>
          </div>

          {/* 3 Real Estate Perks Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col gap-1 text-xs text-[var(--ink2)]">
              <FileCheck className="w-5 h-5 text-brand" />
              <b className="text-[var(--ink)]">Verified Title Documentation</b>
              <span>C of O, C of O in View &amp; Survey Plans</span>
            </div>
            <div className="p-3.5 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col gap-1 text-xs text-[var(--ink2)]">
              <Calendar className="w-5 h-5 text-brand" />
              <b className="text-[var(--ink)]">Free Guided Site Tours</b>
              <span>Tuesdays, Thursdays &amp; Saturdays</span>
            </div>
            <div className="p-3.5 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col gap-1 text-xs text-[var(--ink2)]">
              <BadgeCheck className="w-5 h-5 text-brand" />
              <b className="text-[var(--ink)]">100% Dry Tableland</b>
              <span>Instant deed of assignment dispatch</span>
            </div>
          </div>

          {/* Live Regional Hub Dispatch / Documentation Estimator */}
          <div className="pt-2">
            <DeliveryEstimator
              cartTotal={dynamicPrice * quantity}
              compact={false}
            />
          </div>

          {/* Accordions */}
          <div className="divide-y divide-glow/15 border-y border-glow/15 pt-2">
            {/* Features Accordion */}
            {currentProduct.feat && currentProduct.feat.length > 0 && (
              <div>
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'details' ? null : 'details')
                  }
                  className="w-full py-4 flex items-center justify-between text-left font-display font-semibold text-base hover:text-brand transition-colors text-[var(--ink)]"
                >
                  <span>Estate Infrastructure &amp; Features</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openAccordion === 'details' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div className="pb-4 text-xs sm:text-sm text-[var(--ink2)]">
                    <ul className="list-disc pl-5 space-y-1.5">
                      {currentProduct.feat.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Title & Documentation Accordion */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'delivery' ? null : 'delivery')
                }
                className="w-full py-4 flex items-center justify-between text-left font-display font-semibold text-base hover:text-brand transition-colors text-[var(--ink)]"
              >
                <span>Title Documents, Allocation &amp; Dispatch</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openAccordion === 'delivery' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'delivery' && (
                <div className="pb-4 text-xs sm:text-sm text-[var(--ink2)] leading-relaxed space-y-2">
                  <p>
                    All documentation including Registered Deed of Assignment, Contract of Sale, and Survey Plans are processed and made available within 24 to 48 hours from EVC Regional Hubs (Ilorin Hub, Ibadan Experience Center, and Abuja Corporate Office).
                  </p>
                  <p>
                    Physical land demarcation and pegging are carried out immediately upon milestone verification. Secure courier dispatch of deeds is available nationwide and for diaspora investors.
                  </p>
                </div>
              )}
            </div>

            {/* Physical Site Inspection Accordion */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'warranty' ? null : 'warranty')
                }
                className="w-full py-4 flex items-center justify-between text-left font-display font-semibold text-base hover:text-brand transition-colors text-[var(--ink)]"
              >
                <span>Physical Site Inspection Schedule</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openAccordion === 'warranty' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'warranty' && (
                <div className="pb-4 text-xs sm:text-sm text-[var(--ink2)] leading-relaxed space-y-2">
                  <p>
                    Free physical site inspections are conducted every <b>Tuesday, Thursday, and Saturday</b> starting at 10:00 AM.
                  </p>
                  <p>
                    Chauffeur-driven inspection vehicles depart directly from EVC Hubs in Ilorin (Kajo Mall, Fate Road / Bodunde St Flower Garden) and Ibadan (Plot 11, Oluyoro Avenue, Bodija). Virtual live video tours are available for diaspora subscribers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation Shelf */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 sm:mt-24 pt-10 border-t border-glow/15">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Complementary Projects
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mt-1 text-[var(--ink)]">
              Explore more verified real estate developments
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Verified Customer Reviews */}
      <ProductReviews
        productId={currentProduct.id}
        productName={currentProduct.name}
      />

      {/* Lightbox Modal for High-Resolution Inspection */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Property Layout Zoom"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl aspect-square max-h-[85vh] rounded-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <ProductImage
              src={productImages[activeGalleryView] || productImages[0]}
              alt={currentProduct.name}
              priority={true}
              fallbackArt={{
                type: currentProduct.art || 'estate',
                color: activeColor,
                view: (activeGalleryView as 0 | 1 | 2 | 3) || 0,
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile Enhanced Sticky Buy Bar */}
      <aside
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-xl border-t border-[var(--line)] p-3 px-4 shadow-2xl transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
        aria-label="Quick order bar"
      >
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          {/* Mini Thumbnail and Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-[var(--surface2)] border border-glow/25 flex-shrink-0 relative">
              <ProductImage
                src={productImages[0]}
                alt={currentProduct.name}
                fallbackArt={{ type: currentProduct.art || 'estate', color: activeColor, view: 0 }}
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-display font-semibold text-xs truncate text-[var(--ink)]">
                {currentProduct.name}
              </h4>
              <span className="font-display font-bold text-xs text-brand">
                {money(dynamicPrice)}
              </span>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isSoldOut ? (
              <a
                href={waLink(whatsappInquiryMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2 px-3 h-10 shadow"
              >
                Inquire
              </a>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  className="btn-primary text-xs py-2.5 px-4 h-10 shadow"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Reserve</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="h-10 px-3.5 rounded-full font-semibold text-xs bg-white text-black"
                >
                  Buy
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
