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
  Wrench,
  BadgeCheck,
} from 'lucide-react';
import { byId, catOf, PAL, PRODUCTS, CFG } from '@/lib/products';
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

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const idParam = String(resolvedParams?.id || '');
  const numId = Number(idParam);
  const router = useRouter();

  // Initialize with static product if available for instant SSR/hydration
  const initialStaticProduct = !isNaN(numId) ? byId(numId) : undefined;

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
    initialStaticProduct?.colors?.[0] || 'black'
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
        <p className="text-sm text-[var(--mute)] font-medium">Loading hardware specifications...</p>
      </div>
    );
  }

  if (notFoundState || (!loading && !product)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h2 className="font-display text-3xl font-bold mb-3">Product Not Found</h2>
        <p className="text-sm text-[var(--mute)] max-w-md mx-auto mb-6">
          The requested system or product might have been moved, updated, or is currently reserved.
        </p>
        <Link href="/shop" className="btn-primary text-xs py-2.5 px-6 inline-flex">
          Return to Equipment Catalog
        </Link>
      </div>
    );
  }

  const currentProduct = product!;
  const isSaved = isInWishlist(currentProduct.id);
  const category = catOf(currentProduct.cat);

  const activeColor: ColorKey =
    currentProduct.colors && currentProduct.colors.includes(selectedColor)
      ? selectedColor
      : currentProduct.colors?.[0] || 'black';

  const activeSize: string =
    currentProduct.sizes && selectedSize && currentProduct.sizes.includes(selectedSize)
      ? selectedSize
      : currentProduct.sizes?.[0] || '';

  const productImages =
    currentProduct.images && currentProduct.images.length > 0 ? currentProduct.images : [];

  const handleAddToCart = () => {
    addToCart(currentProduct.id, activeColor, activeSize, quantity);
    if (mainImgRef.current) {
      flyToCart(mainImgRef.current, productImages[activeGalleryView] || productImages[0]);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
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

  const whatsappMessage = `Hello EVC Nigeria, I would like to order: ${quantity} x ${currentProduct.name} (${
    PAL[activeColor]?.n || activeColor
  }${activeSize ? ', Spec ' + activeSize : ''}) at ${money(currentProduct.price)} each.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
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
                      type: currentProduct.art || 'solar',
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
                type: currentProduct.art || 'solar',
                color: activeColor,
                view: (activeGalleryView as 0 | 1 | 2 | 3) || 0,
              }}
            />

            {/* Zoom / Lightbox Trigger */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute right-3.5 top-3.5 z-10 w-9 h-9 rounded-full bg-[var(--nav-bg)]/80 backdrop-blur-md border border-glow/25 flex items-center justify-center text-[var(--ink)] opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all shadow-md"
              aria-label="Zoom image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Badge */}
            {currentProduct.badge && (
              <span className="absolute left-3.5 top-3.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand text-white shadow-md z-10">
                {currentProduct.badge}
              </span>
            )}

            <div className="absolute right-3.5 bottom-3.5 px-3 py-1.5 rounded-full bg-[var(--nav-bg)]/80 backdrop-blur-md border border-glow/25 text-[11px] font-semibold text-[var(--ink2)] pointer-events-none z-10 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-brand" />
              EVC Verified Hardware
            </div>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-brand">
              {category.name}
            </span>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mt-1 text-[var(--ink)]">
              {currentProduct.name}
            </h1>

            {/* Price and Stock status */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
                {money(currentProduct.price)}
              </span>
              {currentProduct.was && (
                <s className="text-sm sm:text-base text-[var(--mute)] font-mono">
                  {money(currentProduct.was)}
                </s>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available across Ilorin, Ibadan &amp; Abuja Hubs
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[var(--ink2)] leading-relaxed">
            {currentProduct.desc}
          </p>

          {/* Color / Variant Selector */}
          {currentProduct.colors && currentProduct.colors.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-2.5">
                Finish: <b className="text-[var(--ink)] capitalize">{PAL[activeColor]?.n || activeColor}</b>
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

          {/* Specification / Capacity Selector */}
          {currentProduct.sizes && currentProduct.sizes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-2.5">
                System Spec / Capacity: <b className="text-[var(--ink)]">{activeSize}</b>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[54px] h-11 px-4 rounded-xl text-xs font-semibold border transition-all ${
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

          {/* Main Action CTAs */}
          <div ref={mainCtaRef} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center pt-2">
            {/* Quantity Stepper */}
            <div className="inline-flex items-center justify-between sm:justify-start border border-glow/25 rounded-full h-12 px-2 bg-[var(--surface)] w-full sm:w-auto">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-[var(--mute)] hover:text-brand active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-bold font-mono">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(50, quantity + 1))}
                className="w-10 h-full flex items-center justify-center text-[var(--mute)] hover:text-brand active:scale-95"
                aria-label="Increase quantity"
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
                  <Check className="w-4 h-4 text-emerald-300" /> Added to Order!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="h-12 px-6 rounded-full font-semibold text-sm bg-white text-black hover:bg-neutral-200 active:scale-98 transition-all text-center flex items-center justify-center"
            >
              Instant Checkout
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={waLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa text-xs py-2.5 px-4 flex-1 sm:flex-initial justify-center"
            >
              <MessageSquare className="w-4 h-4" /> Order &amp; Consult on WhatsApp
            </a>

            <button
              onClick={() => toggleWishlist(currentProduct.id)}
              className={`btn-ghost text-xs py-2.5 px-4 flex-1 sm:flex-initial justify-center border border-glow/25 ${
                isSaved ? 'text-brand border-brand' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved in Wishlist' : 'Save for Project'}
            </button>
          </div>

          {/* 3 Perks Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col gap-1 text-xs text-[var(--ink2)]">
              <Truck className="w-5 h-5 text-brand" />
              <b className="text-[var(--ink)]">Regional Hub Logistics</b>
              <span>Ilorin, Ibadan, Abuja &amp; Nationwide</span>
            </div>
            <div className="p-3.5 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col gap-1 text-xs text-[var(--ink2)]">
              <BadgeCheck className="w-5 h-5 text-brand" />
              <b className="text-[var(--ink)]">Certified Equipment</b>
              <span>Tier-1 manufacturer warranty</span>
            </div>
            <div className="p-3.5 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col gap-1 text-xs text-[var(--ink2)]">
              <Wrench className="w-5 h-5 text-brand" />
              <b className="text-[var(--ink)]">Engineering Support</b>
              <span>Installation &amp; commissioning advice</span>
            </div>
          </div>

          {/* Live Doorstep Delivery Estimator */}
          <div className="pt-2">
            <DeliveryEstimator
              cartTotal={currentProduct.price * quantity}
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
                  <span>Engineering Specifications &amp; Features</span>
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

            {/* Delivery & Logistics Accordion */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'delivery' ? null : 'delivery')
                }
                className="w-full py-4 flex items-center justify-between text-left font-display font-semibold text-base hover:text-brand transition-colors text-[var(--ink)]"
              >
                <span>Dispatch, Freight &amp; Hub Pickups</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openAccordion === 'delivery' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'delivery' && (
                <div className="pb-4 text-xs sm:text-sm text-[var(--ink2)] leading-relaxed space-y-2">
                  <p>
                    Same-day and 24-hour dispatch available from our Ilorin, Ibadan, and Abuja hubs. Nationwide freight delivery takes 2 to 4 working days with full consignment tracking.
                  </p>
                  <p>
                    Heavy items such as commercial solar panels and powerwall lithium batteries are crated with shock absorption protection.
                  </p>
                </div>
              )}
            </div>

            {/* Warranty & Guarantee Accordion */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'warranty' ? null : 'warranty')
                }
                className="w-full py-4 flex items-center justify-between text-left font-display font-semibold text-base hover:text-brand transition-colors text-[var(--ink)]"
              >
                <span>Warranty &amp; Installation Guarantee</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openAccordion === 'warranty' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'warranty' && (
                <div className="pb-4 text-xs sm:text-sm text-[var(--ink2)] leading-relaxed space-y-2">
                  <p>
                    All power systems come with manufacturer warranties (up to 10 years on lithium batteries and 25 years on Tier-1 panels).
                  </p>
                  <p>
                    Our certified field engineers can be booked for installation and commissioning in Kwara, Oyo, Lagos, and Abuja.
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
              Recommended Systems
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mt-1 text-[var(--ink)]">
              Complementary infrastructure &amp; smart hardware
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
          aria-label="Product Image Zoom"
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
                type: currentProduct.art || 'solar',
                color: activeColor,
                view: (activeGalleryView as 0 | 1 | 2 | 3) || 0,
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile Enhanced Sticky Buy Bar */}
      <aside
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03090a]/95 backdrop-blur-xl border-t border-glow/25 p-3 px-4 shadow-2xl transition-transform duration-300 ${
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
                fallbackArt={{ type: currentProduct.art || 'solar', color: activeColor, view: 0 }}
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-display font-semibold text-xs truncate text-[var(--ink)]">
                {currentProduct.name}
              </h4>
              <span className="font-display font-bold text-xs text-brand">
                {money(currentProduct.price)}
              </span>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleAddToCart}
              className="btn-primary text-xs py-2.5 px-4 h-10 shadow"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="h-10 px-3.5 rounded-full font-semibold text-xs bg-white text-black"
            >
              Buy
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}