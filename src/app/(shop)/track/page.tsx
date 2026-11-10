'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { OrderTrackingInfo, TrackingMilestone } from '@/types';
import { money, waLink } from '@/lib/utils';
import { ProductImage } from '@/components/shop/ProductImage';
import { OrderReceiptModal, OrderReceiptData } from '@/components/shop/OrderReceiptModal';
import {
  FileText,
  Printer,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  XCircle,
  MapPin,
  Phone,
  Copy,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Loader2,
  AlertCircle,
  Package,
  Calendar,
  CreditCard,
  ChevronRight,
  Zap,
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const urlOrderId = (searchParams.get('id') || searchParams.get('orderId') || '').trim();
  const urlEmail = (searchParams.get('email') || '').trim();
  const urlPhone = (searchParams.get('phone') || '').trim();

  const [orderIdInput, setOrderIdInput] = useState(urlOrderId);
  const [emailInput, setEmailInput] = useState(urlEmail || user?.email || '');
  const [phoneInput, setPhoneInput] = useState(urlPhone);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [trackingData, setTrackingData] = useState<OrderTrackingInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const executeTrack = useCallback(
    async (idToTrack: string, emailToTrack?: string, phoneToTrack?: string) => {
      const cleanId = idToTrack.trim();
      if (!cleanId) return;

      setIsLoading(true);
      setErrorMsg(null);
      setRequiresVerification(false);

      try {
        const query = new URLSearchParams();
        query.set('id', cleanId);
        if (emailToTrack) query.set('email', emailToTrack.trim());
        if (phoneToTrack) query.set('phone', phoneToTrack.trim());

        const res = await fetch(`/api/track?${query.toString()}`);
        const data = await res.json();

        if (res.ok && data.success && data.tracking) {
          setTrackingData(data.tracking);
          setRequiresVerification(false);
        } else if (res.status === 403 && data.requiresVerification) {
          setRequiresVerification(true);
          setErrorMsg(data.error || 'Please enter your email or phone number to verify and view this order.');
        } else {
          setTrackingData(null);
          setErrorMsg(data.error || 'Consignment could not be found. Please check your order ID.');
        }
      } catch (err: any) {
        setErrorMsg('Network error while checking logistics system. Please retry.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (urlOrderId) {
      executeTrack(urlOrderId, urlEmail, urlPhone);
    }
  }, [urlOrderId, urlEmail, urlPhone, executeTrack]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    const query = new URLSearchParams();
    query.set('id', orderIdInput.trim());
    if (emailInput.trim()) query.set('email', emailInput.trim());
    if (phoneInput.trim()) query.set('phone', phoneInput.trim());
    router.push(`/track?${query.toString()}`);

    executeTrack(orderIdInput, emailInput, phoneInput);
  };

  const receiptModalData: OrderReceiptData | null = trackingData
    ? {
        orderId: trackingData.orderId,
        createdAt: trackingData.createdAt,
        customerName: trackingData.destination?.name || 'Valued Client',
        phone: urlPhone || '',
        email: urlEmail || user?.email || '',
        address: trackingData.destination?.addressMasked || '',
        state: trackingData.destination?.state || '',
        deliveryLabel: trackingData.deliveryLabel,
        eta: trackingData.eta,
        paymentMethod: trackingData.paymentMethod,
        paymentStatus: trackingData.paymentStatus,
        subtotal: trackingData.subtotal || 0,
        discount: trackingData.discount || 0,
        deliveryFee: trackingData.fee || 0,
        total: trackingData.total || 0,
        items: (trackingData.items || []).map((it) => ({
          name: it.name,
          qty: it.qty,
          price: it.price,
          color: it.color,
          size: it.opt,
        })),
      }
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--mute)] mb-6">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-semibold">Consignment Tracking</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
          Live Consignment <em className="serif-italic">Tracking</em>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--mute)] mt-1">
          Monitor your equipment dispatch status from our Ilorin, Ibadan, or Abuja hubs directly to your installation site.
        </p>
      </div>

      {/* Tracking Search Input Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl mb-10">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
            <div className="sm:col-span-6 lg:col-span-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-1.5">
                Consignment / Order ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. EVC-2026-XXXX or #1234"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
                  className="input-field w-full pl-10 text-sm font-mono uppercase"
                />
                <Search className="w-4 h-4 text-[var(--mute)] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="sm:col-span-6 lg:col-span-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-1.5">
                Verify Email or Phone (Optional)
              </label>
              <input
                type="text"
                placeholder="Email or WhatsApp phone"
                value={emailInput || phoneInput}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.includes('@')) {
                    setEmailInput(val);
                  } else {
                    setPhoneInput(val);
                  }
                }}
                className="input-field w-full text-sm"
              />
            </div>

            <div className="sm:col-span-12 lg:col-span-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full h-11 justify-center text-xs shadow-lg active:scale-98 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Checking Fleet...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 mr-1.5" /> Track Consignment
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>
      </div>

      {/* Tracking Result View */}
      {trackingData && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Summary Bar */}
          <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-brand font-semibold">
                Consignment Reference
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="font-display font-mono text-xl sm:text-2xl font-bold text-white">
                  #{trackingData.orderId}
                </h2>
                <button
                  onClick={() => handleCopy(trackingData.orderId, 'orderId')}
                  className="p-1 text-[var(--mute)] hover:text-brand transition-colors"
                  title="Copy Order ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copiedField === 'orderId' && (
                  <span className="text-[11px] text-emerald-400 font-medium">Copied!</span>
                )}
              </div>
              <p className="text-xs text-[var(--mute)] mt-1">
                Placed on {new Date(trackingData.createdAt).toLocaleDateString()} • {trackingData.destination?.city || 'Regional'} Hub
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="btn-ghost text-xs py-2 px-3.5 border border-glow/25 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> View / Print Waybill
              </button>

              <a
                href={waLink(`Hello EVC Nigeria, I am checking consignment #${trackingData.orderId} for ${trackingData.destination?.name || 'Client'}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Contact Hub Officer
              </a>
            </div>
          </div>

          {/* Main 2-Col: Milestones Left, Package & Logistics Info Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Milestones Timeline */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-6">
              <h3 className="font-display text-base font-bold text-[var(--ink)]">
                Fulfillment &amp; Transit Status
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-glow/25">
                {trackingData.milestones?.map((m, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        m.current
                          ? 'bg-brand text-white font-bold ring-4 ring-brand/20 animate-pulse'
                          : m.completed
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-neutral-800 text-[var(--mute)] border border-glow/25'
                      }`}
                    >
                      {m.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-xs sm:text-sm font-semibold ${
                          m.current
                            ? 'text-brand'
                            : m.completed
                            ? 'text-[var(--ink)]'
                            : 'text-[var(--mute)]'
                        }`}
                      >
                        {m.title}
                      </h4>
                      <p className="text-xs text-[var(--mute)] mt-0.5">{m.description}</p>
                      {m.timestamp && (
                        <span className="block text-[11px] font-mono text-[var(--mute)] mt-1">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Courier & Package Details */}
            <div className="lg:col-span-5 space-y-6">
              {/* Courier info card */}
              <div className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-4">
                <h4 className="font-display font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand" /> Logistics Carrier &amp; Dispatcher
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--mute)]">Fulfillment Hub:</span>
                    <span className="font-semibold text-white">{trackingData.destination?.city || 'Regional'} Center</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--mute)]">Delivery Route:</span>
                    <span className="font-semibold text-white">{trackingData.deliveryLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--mute)]">Estimated Transit:</span>
                    <span className="font-semibold text-brand">{trackingData.eta}</span>
                  </div>
                  {trackingData.carrier && (
                    <div className="flex justify-between pt-2 border-t border-glow/15">
                      <span className="text-[var(--mute)]">Assigned Courier:</span>
                      <span className="font-semibold text-white">{trackingData.carrier}</span>
                    </div>
                  )}
                  {trackingData.riderPhone && (
                    <div className="flex justify-between">
                      <span className="text-[var(--mute)]">Courier Phone:</span>
                      <a href={`tel:${trackingData.riderPhone}`} className="text-brand font-mono font-bold hover:underline">
                        {trackingData.riderPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Items in package */}
              <div className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-3">
                <h4 className="font-display font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand" /> Crated Equipment
                </h4>
                <div className="divide-y divide-glow/15">
                  {(trackingData.items || []).map((it, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-brand font-bold">{it.qty}x</span>
                        <span className="text-[var(--ink)] truncate font-medium">{it.name || `Product #${it.productId || ''}`}</span>
                      </div>
                      <span className="text-[var(--mute)] font-mono">{money((it.price || 0) * it.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waybill / Order Receipt Modal */}
      {receiptModalData && (
        <OrderReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          order={receiptModalData}
        />
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--mute)]">Loading consignment status...</p>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}