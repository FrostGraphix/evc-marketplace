'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import {
  Printer,
  X,
  CheckCircle2,
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { money, waLink } from '@/lib/utils';
import { CFG } from '@/lib/products';

export interface ReceiptItem {
  name: string;
  price: number;
  qty: number;
  color?: string;
  size?: string;
  opt?: string;
}

export interface OrderReceiptData {
  orderId: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  state: string;
  landmark?: string;
  deliveryLabel: string;
  eta: string;
  paymentMethod: string;
  paymentStatus: string;
  items: ReceiptItem[];
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  total: number;
}

export interface OrderReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderReceiptData;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const supportMessage = `Hello EVC Nigeria, I am contacting you regarding official invoice for order ${order.orderId}.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Official Invoice ${order.orderId}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #evc-official-receipt, #evc-official-receipt * {
            visibility: visible;
          }
          #evc-official-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 24px;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Modal Dialog Card with clean outline */}
      <div
        className="w-full max-w-2xl rounded-3xl bg-[var(--surface)] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 p-5 sm:p-7 relative shadow-2xl my-auto animate-in zoom-in-95 duration-200"
      >
        <div
          id="evc-official-receipt"
          ref={receiptRef}
          className="bg-[var(--surface)] rounded-2xl p-6 sm:p-8 border border-[var(--line)] space-y-6"
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[var(--line)]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex items-center justify-center p-1">
                <Image
                  src="/images/evc-mark.png"
                  alt="EVC Mark"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xl text-[var(--ink)]">
                  EVC Nigeria Limited
                </h3>
                <span className="text-xs text-[var(--mute)]">
                  Smart Tech • Solar Energy • Architectural Finishes
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20">
                Official Receipt / Invoice
              </span>
              <div className="text-xs text-[var(--mute)] mt-1.5 font-mono">
                #{order.orderId}
              </div>
              <div className="text-[11px] text-[var(--mute)]">
                {order.createdAt}
              </div>
            </div>
          </div>

          {/* Customer & Delivery Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] space-y-1">
              <strong className="block text-[11px] font-bold uppercase tracking-wider text-brand">
                Customer &amp; Site Details
              </strong>
              <div className="font-bold text-[var(--ink)]">{order.customerName}</div>
              <div className="text-[var(--mute)]">{order.phone}</div>
              {order.email && <div className="text-[var(--mute)]">{order.email}</div>}
              <div className="text-[var(--ink)] mt-1 pt-1 border-t border-[var(--line)]">
                {order.address}, {order.state}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] space-y-1">
              <strong className="block text-[11px] font-bold uppercase tracking-wider text-brand">
                Logistics &amp; Settlement
              </strong>
              <div className="flex items-center justify-between">
                <span className="text-[var(--mute)]">Dispatch SLA:</span>
                <span className="font-semibold text-[var(--ink)]">{order.eta}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--mute)]">Payment Mode:</span>
                <span className="font-semibold text-[var(--ink)]">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[var(--line)]">
                <span className="text-[var(--mute)]">Status:</span>
                <span className="font-bold text-emerald-500 uppercase">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-[var(--line)] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[var(--surface2)] border-b border-[var(--line)]">
                <tr>
                  <th className="py-2.5 px-3 text-left font-bold text-[var(--ink)]">Item / Equipment</th>
                  <th className="py-2.5 px-3 text-center font-bold text-[var(--ink)]">Qty</th>
                  <th className="py-2.5 px-3 text-right font-bold text-[var(--ink)]">Unit Price</th>
                  <th className="py-2.5 px-3 text-right font-bold text-[var(--ink)]">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[var(--surface2)]/50">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[var(--ink)]">{item.name}</div>
                      {(item.color || item.size) && (
                        <div className="text-[10px] text-[var(--mute)]">
                          {item.color} {item.size ? `• ${item.size}` : ''}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">{item.qty}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{money(item.price)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[var(--ink)]">
                      {money(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-[var(--mute)]">
                <span>Subtotal:</span>
                <span className="font-mono text-[var(--ink)]">{money(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--mute)]">
                <span>Dispatch Fee:</span>
                <span className="font-mono text-[var(--ink)]">
                  {order.deliveryFee === 0 ? 'FREE' : money(order.deliveryFee)}
                </span>
              </div>
              {order.discount ? (
                <div className="flex justify-between text-emerald-500">
                  <span>Discount:</span>
                  <span className="font-mono">-{money(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-extrabold text-[var(--ink)] pt-2 border-t border-[var(--line)]">
                <span>Total Amount:</span>
                <span className="font-display text-brand">{money(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Corporate Offices Footnote */}
          <div className="pt-4 border-t border-[var(--line)] text-[11px] text-[var(--mute)] space-y-1">
            <div className="font-semibold text-[var(--ink)]">Corporate Operational Centers:</div>
            <div>• Ilorin: Suite C1, Kajo Mall, Opp Fresh Hotel, Fate / Plot 7A, Bodunde St, G.R.A., Kwara</div>
            <div>• Ibadan: Plot 11, Oluyoro Avenue, Off Awolowo Road, Bodija, Oyo State</div>
            <div>• Abuja: EVC Corporate / FCT Abuja | Email: {CFG.email} | Support: {CFG.phoneDisp}</div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
          <a
            href={waLink(supportMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Support
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-ghost text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="btn-primary text-xs py-2 px-5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
