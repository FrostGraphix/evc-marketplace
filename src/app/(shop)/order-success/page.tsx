'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, MessageSquare, ArrowRight, Package, Truck, ShieldCheck, Copy, CheckCheck, Building2, Zap } from 'lucide-react';
import { ConfettiEffect } from '@/components/ui/Confetti';
import { OrderRecord } from '@/types';
import { money, waLink } from '@/lib/utils';
import { CFG, byId } from '@/lib/products';
import { ProductImage } from '@/components/shop/ProductImage';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || searchParams.get('reference') || '';
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedBank, setCopiedBank] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders?id=${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrder(data.order);
          }
        }
      } catch (err) {
        console.warn('Could not fetch order:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(CFG.bank.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const timelineSteps = [
    { title: 'Order Logged', desc: 'Hardware order received and reserved in logistics inventory.', done: true },
    {
      title: 'WhatsApp Hub Verification',
      desc: 'Our regional officer verifies site specs and delivery schedule with you.',
      done: Boolean(
        order?.orderStatus === 'confirmed' ||
          order?.orderStatus === 'shipped' ||
          order?.orderStatus === 'delivered'
      ),
    },
    {
      title: 'Payment Status',
      desc: `Settlement via ${order?.payLabel || 'selected method'}.`,
      done: Boolean(order?.paymentStatus === 'paid'),
    },
    {
      title: 'Crated & Dispatched',
      desc: 'Packaged from our regional hub (Ilorin / Ibadan / Abuja) with carrier transit receipt.',
      done: Boolean(order?.orderStatus === 'shipped' || order?.orderStatus === 'delivered'),
    },
    {
      title: 'Site Delivery & Commissioning',
      desc: `Arrives at destination in ${order?.eta || '1 to 3 working days'}.`,
      done: Boolean(order?.orderStatus === 'delivered'),
    },
  ];

  const whatsappMessage = order
    ? order.wa
    : `Hello EVC Nigeria, I just placed an equipment order with reference #${orderId}. Please confirm site delivery schedule!`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <ConfettiEffect trigger={true} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Success Header & Timeline */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" /> Order Successfully Placed
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
              Thank You for Your <em className="serif-italic">Order</em>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--mute)]">
              Your equipment order <strong className="text-brand">#{orderId || 'EVC-PENDING'}</strong> has been recorded in our operations network.
            </p>
          </div>

          {/* Bank Transfer Instructions if transfer */}
          {order?.paymentMethod === 'transfer' && (
            <div className="p-6 rounded-3xl border border-brand/40 bg-gradient-to-br from-brand/10 to-glow/20 space-y-4">
              <div className="flex items-center gap-2 text-brand font-bold text-sm">
                <Building2 className="w-5 h-5" /> Bank Transfer Details
              </div>
              <p className="text-xs text-[var(--ink2)] leading-relaxed">
                Please transfer the total of <strong className="text-white font-mono">{money(order.total)}</strong> to our corporate account to initiate instant dispatch:
              </p>
              <div className="p-4 rounded-2xl bg-black/60 border border-glow/25 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--mute)]">Bank Name:</span>
                  <span className="font-semibold text-white">{CFG.bank.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--mute)]">Account Name:</span>
                  <span className="font-semibold text-white">{CFG.bank.accountName}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-glow/15">
                  <span className="text-[var(--mute)]">Account Number:</span>
                  <button
                    onClick={copyAccountNumber}
                    className="flex items-center gap-1.5 font-mono text-sm font-bold text-brand hover:underline"
                  >
                    <span>{CFG.bank.accountNumber}</span>
                    {copiedBank ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-[var(--mute)]">
                Use your Order ID <strong>#{orderId}</strong> as payment reference and send proof to our WhatsApp line.
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={waLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa text-xs sm:text-sm py-3 px-6 flex-1 sm:flex-initial justify-center shadow-lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Confirm with Logistics on WhatsApp
            </a>

            <Link
              href={`/track?id=${orderId}`}
              className="btn-ghost text-xs sm:text-sm py-3 px-6 flex-1 sm:flex-initial justify-center border border-glow/25"
            >
              <Truck className="w-4 h-4 mr-2" /> Track Dispatch Progress
            </Link>
          </div>

          {/* Fulfillment Roadmap Timeline */}
          <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-6">
            <h3 className="font-display text-base font-bold text-[var(--ink)]">
              Consignment &amp; Delivery Roadmap
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-glow/25">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      step.done
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-neutral-800 text-[var(--mute)] border border-glow/25'
                    }`}
                  >
                    {step.done ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                  </div>
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-semibold ${
                        step.done ? 'text-[var(--ink)]' : 'text-[var(--mute)]'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-[var(--mute)] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Manifest */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl space-y-5">
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">
              Order Receipt
            </h3>

            {loading ? (
              <div className="py-10 text-center">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-[var(--mute)]">Loading order details...</p>
              </div>
            ) : order ? (
              <div className="space-y-4">
                {/* Items */}
                <div className="divide-y divide-glow/15 border-b border-glow/15 pb-3">
                  {(((order as any).cart || order.items || []) as any[]).map((it, idx) => {
                    const prod = byId(it.id);
                    return (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-brand font-bold">{it.qty}x</span>
                          <span className="font-medium text-[var(--ink)] truncate">
                            {prod?.name || it.name || `Product #${it.id}`}
                          </span>
                        </div>
                        <span className="font-semibold text-[var(--ink)]">
                          {money((prod?.price || it.price || 0) * it.qty)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Logistics & Financials */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[var(--mute)]">
                    <span>Subtotal</span>
                    <span className="text-[var(--ink)] font-semibold">{money(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>-{money(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--mute)]">
                    <span>Logistics ({order.deliveryLabel || 'Standard'})</span>
                    <span className="text-[var(--ink)] font-semibold">{money(order.fee || (order as any).deliveryFee || 0)}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-baseline border-t border-glow/15 text-sm">
                    <span className="font-bold text-[var(--ink)]">Total Amount</span>
                    <span className="font-extrabold text-xl text-brand">{money(order.total)}</span>
                  </div>
                </div>

                {/* Destination info */}
                <div className="pt-3 border-t border-glow/15 text-xs text-[var(--mute)] space-y-1">
                  <div>
                    <strong className="text-[var(--ink)]">Client: </strong> {order.name} ({order.phone})
                  </div>
                  <div>
                    <strong className="text-[var(--ink)]">Destination: </strong> {order.address}, {order.state}
                  </div>
                  <div>
                    <strong className="text-[var(--ink)]">Payment Mode: </strong> {order.payLabel}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--mute)]">Order logged successfully.</p>
            )}

            <Link
              href="/shop"
              className="btn-primary w-full h-11 justify-center text-xs"
            >
              Continue Browsing Hardware <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--mute)]">Finalizing order confirmation...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}