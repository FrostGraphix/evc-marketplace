'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Loader2, RefreshCw, Building2, MessageSquare, Zap, Truck, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { byId, CFG, PAL, STATES } from '@/lib/products';
import { DeliveryType, PaymentMethod } from '@/types';
import { money, waLink } from '@/lib/utils';
import { ProductImage } from '@/components/shop/ProductImage';
import { useModal } from '@/context/ModalContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discount, feeOf, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { openModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    name: profile?.full_name || '',
    phone: profile?.phone || '',
    email: profile?.email || user?.email || '',
    address: profile?.address || '',
    state: profile?.state || 'Kwara',
    landmark: '',
    note: '',
  });

  const getInitialDelivery = (state: string): DeliveryType => {
    if (state.toLowerCase().includes('kwara')) return 'ilorin';
    if (state.toLowerCase().includes('oyo')) return 'ibadan';
    if (state.toLowerCase().includes('abuja')) return 'abuja';
    return 'nationwide';
  };

  const [delivery, setDelivery] = useState<DeliveryType>(getInitialDelivery(formData.state));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('link');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = feeOf(delivery);
  const total = subtotal - discount + deliveryFee;

  // Pod available in major hub cities (Ilorin, Ibadan, Abuja)
  const isPodAvailable = delivery === 'ilorin' || delivery === 'ibadan' || delivery === 'abuja';

  const handleStateChange = (selectedState: string) => {
    setFormData((prev) => ({ ...prev, state: selectedState }));
    const s = selectedState.toLowerCase();
    if (s.includes('kwara')) {
      setDelivery('ilorin');
    } else if (s.includes('oyo')) {
      setDelivery('ibadan');
    } else if (s.includes('abuja') || s.includes('fct')) {
      setDelivery('abuja');
    } else {
      setDelivery('nationwide');
      if (paymentMethod === 'pod') setPaymentMethod('transfer');
    }
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      err.name = 'Please enter your full name or company name';
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      err.phone = 'Please enter a valid WhatsApp contact phone';
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      err.email = 'Please enter a valid email address';
    }
    if (delivery !== 'pickup' && (!formData.address.trim() || formData.address.trim().length < 6)) {
      err.address = 'Please enter your installation or delivery address';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const attemptPaystack = async (orderId: string, email: string, amount: number) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const paystackRes = await fetch('/api/checkout/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          email,
          amount,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const paystackData = await paystackRes.json();
      if (paystackData.status && paystackData.data?.authorization_url) {
        clearCart();
        window.location.href = paystackData.data.authorization_url;
        return true;
      }
      throw new Error(paystackData.message || 'Payment gateway failed to initialize session.');
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError';
      const errorMessage = isTimeout
        ? 'Payment gateway timed out. The server took too long to respond.'
        : err.message || 'Unable to initialize card payment.';
      throw new Error(errorMessage);
    }
  };

  const handlePaymentGatewayFailure = (orderId: string, errorDetail?: string) => {
    const waText =
      `Hello EVC Nig. Ltd! I was attempting to pay for Order #${orderId} (${money(total)}) with Card/Paystack, but experienced an issue.\n` +
      `Customer: ${formData.name} (${formData.phone})\n` +
      `Delivery: ${formData.address}, ${formData.state}\n` +
      `Items:\n` +
      cart
        .map((it) => {
          const p = byId(it.id);
          return `- ${it.qty}x ${p?.name || 'Item'} (${it.color}${it.size ? '/' + it.size : ''})`;
        })
        .join('\n') +
      `\nTotal: ${money(total)}`;

    openModal({
      variant: 'error',
      title: 'Payment Gateway Issue',
      message: (
        <div className="space-y-2 text-left">
          <p>
            {errorDetail || "We couldn't connect to Paystack to complete your payment for "}
            <strong>Order #{orderId}</strong>.
          </p>
          <div className="p-3 rounded-xl bg-brand/10 border border-brand/20 text-xs text-[var(--ink)]">
            <span className="font-semibold text-brand block mb-1">Your Cart Is Preserved!</span>
            No funds were charged. You can retry card payment, instantly switch to Direct Bank Transfer, or conclude this order via WhatsApp.
          </div>
        </div>
      ),
      primaryAction: {
        label: 'Retry Payment',
        icon: <RefreshCw className="w-4 h-4" />,
        variant: 'primary',
        onClick: async () => {
          closeModal();
          setIsSubmitting(true);
          try {
            await attemptPaystack(orderId, formData.email, total);
          } catch (retryErr: any) {
            handlePaymentGatewayFailure(orderId, retryErr.message);
          } finally {
            setIsSubmitting(false);
          }
        },
      },
      secondaryAction: {
        label: 'Pay via Direct Bank Transfer',
        icon: <Building2 className="w-4 h-4" />,
        variant: 'outline',
        onClick: async () => {
          closeModal();
          setIsSubmitting(true);
          try {
            await fetch('/api/orders', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: orderId,
                paymentMethod: 'transfer',
                payLabel: 'Bank Transfer',
              }),
            });
            clearCart();
            router.push(`/order-success?id=${orderId}`);
          } catch {
            clearCart();
            router.push(`/order-success?id=${orderId}`);
          } finally {
            setIsSubmitting(false);
          }
        },
      },
      extraActions: [
        {
          label: 'Complete on WhatsApp with Cart Preserved',
          icon: <MessageSquare className="w-4 h-4" />,
          variant: 'wa',
          onClick: () => {
            window.open(waLink(waText), '_blank');
            closeModal();
          },
        },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        state: formData.state,
        landmark: formData.landmark.trim(),
        note: formData.note.trim(),
        delivery,
        deliveryFee,
        deliveryLabel: CFG.delivery[delivery]?.label || 'Standard Delivery',
        eta: CFG.delivery[delivery]?.eta || '2 to 4 working days',
        paymentMethod,
        payLabel:
          paymentMethod === 'link'
            ? 'Paystack Card / Transfer / USSD'
            : paymentMethod === 'transfer'
            ? 'Direct Bank Transfer'
            : 'Pay on Delivery (Verified Hubs)',
        cart,
        subtotal,
        discount,
        total,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.order) {
        throw new Error(data.error || 'Failed to place order.');
      }

      const createdOrder = data.order;

      if (paymentMethod === 'link') {
        try {
          await attemptPaystack(createdOrder.id, formData.email, total);
        } catch (paystackErr: any) {
          setIsSubmitting(false);
          handlePaymentGatewayFailure(createdOrder.id, paystackErr.message);
        }
      } else {
        clearCart();
        router.push(`/order-success?id=${createdOrder.id}`);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      openModal({
        variant: 'error',
        title: 'Order Submission Failed',
        message: err.message || 'An unexpected error occurred while placing your order. Please try again.',
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-[var(--ink)]">Your Cart is Empty</h2>
        <p className="text-sm text-[var(--mute)]">Add land plots or housing units before checking out.</p>
        <Link href="/shop" className="btn-primary text-xs py-2.5 px-6 inline-flex">
          Browse Properties
        </Link>
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
        <Link href="/cart" className="hover:text-brand transition-colors">
          Cart
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-semibold">Checkout</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
          Secure <em className="serif-italic">Checkout</em>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--mute)] mt-1">
          Provide your project delivery site and select your preferred payment route.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* 1. Contact & Customer Info */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-sm space-y-5">
              <h3 className="font-display text-lg font-bold text-[var(--ink)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">1</span>
                Contact &amp; Client Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                    Full Name or Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Engr. Babatunde Adeleke"
                    className="input-field w-full text-sm"
                  />
                  {errors.name && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0801 234 5678"
                    className="input-field w-full text-sm"
                  />
                  {errors.phone && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                    Email Address (For Invoicing &amp; Receipts) *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. b.adeleke@company.com"
                    className="input-field w-full text-sm"
                  />
                  {errors.email && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* 2. Delivery & Destination */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-sm space-y-5">
              <h3 className="font-display text-lg font-bold text-[var(--ink)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">2</span>
                Site Destination &amp; Delivery Hub
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="input-field w-full text-sm"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                    Logistics Route *
                  </label>
                  <select
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value as DeliveryType)}
                    className="input-field w-full text-sm font-medium"
                  >
                    <option value="ilorin">Ilorin Direct / Hub Delivery ({money(CFG.delivery.ilorin.fee)})</option>
                    <option value="ibadan">Ibadan Bodija Hub Delivery ({money(CFG.delivery.ibadan.fee)})</option>
                    <option value="nationwide">Nationwide Courier / Freight ({money(CFG.delivery.nationwide.fee)})</option>
                    <option value="pickup">Hub Self-Pickup (Free)</option>
                  </select>
                </div>

                {delivery !== 'pickup' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                      Delivery / Site Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Suite 4B, Harmony Estate, Fate Road, Ilorin"
                      className="input-field w-full text-sm"
                    />
                    {errors.address && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.address}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                    Nearest Landmark / Area
                  </label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="e.g. Opposite Shoprite / Near Federal Secretariat"
                    className="input-field w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1.5">
                    Project / Delivery Notes
                  </label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="e.g. Call engineer before arrival / offload at gate"
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-sm space-y-5">
              <h3 className="font-display text-lg font-bold text-[var(--ink)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">3</span>
                Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Paystack Online */}
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    paymentMethod === 'link'
                      ? 'border-brand bg-brand/10 shadow-md ring-1 ring-brand/20'
                      : 'border-[var(--line)] bg-[var(--surface)] hover:border-brand/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">Card / USSD</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'link'}
                      onChange={() => setPaymentMethod('link')}
                      className="accent-brand"
                    />
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold text-[var(--ink)]">Paystack Gateway</strong>
                    <span className="text-xs text-[var(--mute)]">Debit card, USSD, or Bank App. Instant confirmation.</span>
                  </div>
                </label>

                {/* Direct Bank Transfer */}
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    paymentMethod === 'transfer'
                      ? 'border-brand bg-brand/10 shadow-md ring-1 ring-brand/20'
                      : 'border-[var(--line)] bg-[var(--surface)] hover:border-brand/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">Corporate Transfer</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'transfer'}
                      onChange={() => setPaymentMethod('transfer')}
                      className="accent-brand"
                    />
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold text-[var(--ink)]">Bank Transfer</strong>
                    <span className="text-xs text-[var(--mute)]">{CFG.bank.name} — account details provided on placement.</span>
                  </div>
                </label>

                {/* POD (if eligible) */}
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    !isPodAvailable
                      ? 'opacity-40 cursor-not-allowed border-[var(--line)] bg-[var(--surface2)]'
                      : paymentMethod === 'pod'
                      ? 'border-brand bg-brand/10 shadow-md ring-1 ring-brand/20'
                      : 'border-[var(--line)] bg-[var(--surface)] hover:border-brand/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">Hub Delivery</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      disabled={!isPodAvailable}
                      checked={paymentMethod === 'pod'}
                      onChange={() => isPodAvailable && setPaymentMethod('pod')}
                      className="accent-brand"
                    />
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold text-[var(--ink)]">Pay on Delivery</strong>
                    <span className="text-xs text-[var(--mute)]">
                      {isPodAvailable ? 'Available for Ilorin, Ibadan & Abuja hubs.' : 'Not available for interstate freight.'}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Button */}
          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl space-y-5">
              <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                Items in Order ({cart.reduce((sum, item) => sum + item.qty, 0)})
              </h3>

              <div className="max-h-64 overflow-y-auto divide-y divide-glow/15 border-b border-glow/15 pb-3 scrollbar-thin">
                {cart.map((item, idx) => {
                  const p = byId(item.id);
                  if (!p) return null;
                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-brand font-bold">{item.qty}x</span>
                        <div className="min-w-0 truncate">
                          <span className="font-medium text-[var(--ink)] truncate block">{p.name}</span>
                          <span className="text-[11px] text-[var(--mute)] capitalize">{item.color}{item.size ? ` / ${item.size}` : ''}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-[var(--ink)] flex-shrink-0">
                        {money(p.price * item.qty)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-[var(--mute)]">
                  <span>Subtotal</span>
                  <span className="text-[var(--ink)] font-semibold">{money(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span>-{money(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--mute)]">
                  <span>Delivery ({CFG.delivery[delivery]?.label || 'Standard'})</span>
                  <span className="text-[var(--ink)] font-semibold">{money(deliveryFee)}</span>
                </div>
                <div className="pt-2 flex justify-between items-baseline border-t border-glow/15">
                  <span className="font-display font-bold text-base text-[var(--ink)]">Total Due</span>
                  <span className="font-display font-extrabold text-2xl text-brand">
                    {money(total)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full h-12 justify-center text-sm shadow-xl active:scale-98 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Complete Order <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </button>

              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-glow/15 flex items-start gap-2.5 text-xs text-[var(--mute)]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  All orders are verified and logged directly with our regional dispatch officers in Ilorin, Ibadan, and Abuja.
                </span>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}