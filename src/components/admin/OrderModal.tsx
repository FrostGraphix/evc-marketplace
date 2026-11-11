'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { OrderRecord, OrderStatus } from '@/types';
import { money, waLink } from '@/lib/utils';
import { CFG, PAL } from '@/lib/products';
import { ProductImage } from '@/components/shop/ProductImage';
import {
  X,
  CheckCircle2,
  Truck,
  MessageSquare,
  Printer,
  Copy,
  ExternalLink,
  MapPin,
  Clock,
  Phone,
  User,
  ShieldCheck,
  Send,
  Loader2,
} from 'lucide-react';

interface OrderModalProps {
  order: OrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order?.orderStatus || 'received');
  const [isUpdating, setIsUpdating] = useState(false);
  const [carrier, setCarrier] = useState<string>(order?.carrier || 'EVC Regional Fleet (Ilorin / Ibadan / Abuja)');
  const [trackingNumber, setTrackingNumber] = useState<string>(order?.trackingNumber || '');
  const [riderName, setRiderName] = useState<string>(order?.riderName || '');
  const [riderPhone, setRiderPhone] = useState<string>(order?.riderPhone || '');
  const [dispatchNote, setDispatchNote] = useState<string>(order?.dispatchNote || '');

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderStatus || 'received');
      setCarrier(order.carrier || 'EVC Regional Fleet (Ilorin / Ibadan / Abuja)');
      setTrackingNumber(order.trackingNumber || '');
      setRiderName(order.riderName || '');
      setRiderPhone(order.riderPhone || '');
      setDispatchNote(order.dispatchNote || '');
    }
  }, [order]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('locked');
      return () => {
        document.body.classList.remove('locked');
      };
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    setCurrentStatus(newStatus);
    if (onStatusUpdate) {
      await onStatusUpdate(order.id, newStatus);
    }
    setIsUpdating(false);
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'received', label: '1. Received' },
    { value: 'confirmed', label: '2. Confirmed & Allocated' },
    { value: 'dispatched', label: '3. Out for Dispatch' },
    { value: 'delivered', label: '4. Delivered & Commissioned' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl bg-[var(--surface)] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 p-5 sm:p-7 relative shadow-2xl my-auto animate-in zoom-in-95 duration-200"
      >
        <div className="bg-[var(--surface)]/95 rounded-2xl p-6 border border-[var(--line)] space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex items-center justify-center p-0.5">
                <Image
                  src="/images/evc-mark.png"
                  alt="EVC Mark"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                    Consignment #{order.id}
                  </h3>
                  <button
                    onClick={() => handleCopy(order.id, 'id')}
                    className="text-[11px] text-[var(--mute)] hover:text-brand"
                    title="Copy ID"
                  >
                    {copiedField === 'id' ? 'Copied' : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-xs text-[var(--mute)]">
                  Placed on {order.createdAt || 'Recent'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--surface2)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Workflow Status Selector */}
          <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink)]">
              <span>Operational Workflow Status:</span>
              <span className="font-bold text-brand uppercase">{currentStatus}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleStatusChange(opt.value)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentStatus === opt.value
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-[var(--surface)] text-[var(--mute)] hover:text-[var(--ink)] border border-[var(--line)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Client & Destination Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-1.5">
              <strong className="block text-[11px] font-bold uppercase tracking-wider text-brand">
                Client Contact Details
              </strong>
              <div className="font-semibold text-sm text-[var(--ink)]">{order.name}</div>
              <div className="flex items-center gap-2 text-[var(--mute)] font-mono">
                <Phone className="w-3.5 h-3.5 text-brand" /> {order.phone}
              </div>
              {order.email && <div className="text-[var(--mute)]">{order.email}</div>}
              <div className="pt-2 mt-1 border-t border-[var(--line)]">
                <a
                  href={waLink(`Hello ${order.name}, this is EVC Nig. Ltd regarding your consignment #${order.id}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa text-[11px] py-1 px-3 inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3 h-3" /> Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-1.5">
              <strong className="block text-[11px] font-bold uppercase tracking-wider text-brand">
                Delivery Site &amp; Hub SLA
              </strong>
              <div className="flex items-start gap-1.5 text-[var(--ink)] font-medium">
                <MapPin className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <span>{order.address}, {order.state}</span>
              </div>
              <div className="text-[var(--mute)] text-[11px]">
                Hub Dispatch: {order.deliveryLabel} ({order.eta})
              </div>
              <div className="pt-2 mt-1 border-t border-[var(--line)] flex justify-between">
                <span className="text-[var(--mute)]">Payment Mode:</span>
                <span className="font-bold text-emerald-500 uppercase">{order.paymentMethod} ({order.paymentStatus || 'confirmed'})</span>
              </div>
            </div>
          </div>

          {/* Items Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--mute)] mb-2">
              Equipment In Consignment ({order.items.length})
            </h4>
            <div className="border border-[var(--line)] rounded-2xl overflow-hidden divide-y divide-[var(--line)]">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[var(--surface2)] font-mono font-bold flex items-center justify-center text-brand">
                      {item.qty}x
                    </span>
                    <div>
                      <span className="font-semibold text-[var(--ink)] block">{item.name}</span>
                      {item.color && (
                        <span className="text-[11px] text-[var(--mute)]">{item.color}</span>
                      )}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[var(--ink)]">
                    {money(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-60 space-y-1 text-xs">
              <div className="flex justify-between text-[var(--mute)]">
                <span>Equipment Subtotal:</span>
                <span className="font-mono text-[var(--ink)]">{money(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--mute)]">
                <span>Dispatch Fee:</span>
                <span className="font-mono text-[var(--ink)]">{order.fee === 0 ? 'FREE' : money(order.fee)}</span>
              </div>
              {order.discount ? (
                <div className="flex justify-between text-emerald-500">
                  <span>Discount:</span>
                  <span className="font-mono">-{money(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-base font-extrabold text-[var(--ink)] pt-2 border-t border-[var(--line)]">
                <span>Grand Total:</span>
                <span className="font-display text-brand">{money(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
