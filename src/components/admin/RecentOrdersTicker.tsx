'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Package,
  Truck,
  CreditCard,
  MessageSquare,
  X,
  Volume2,
  VolumeX,
  Search,
} from 'lucide-react';
import { money, waLink } from '@/lib/utils';
import { playOrderChime } from './AudioAlert';

export interface OrderItem {
  name: string;
  price: number;
  qty: number;
  color?: string;
  opt?: string;
}

export interface AdminOrder {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  landmark?: string;
  amount: number;
  paymentMethod: 'transfer' | 'link' | 'pod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'received' | 'confirmed' | 'dispatched' | 'delivered';
  deliveryLabel: string;
  eta: string;
  items: OrderItem[];
  createdAt: string;
}

const INITIAL_DEMO_ORDERS: AdminOrder[] = [
  {
    id: 'EVC-1082',
    name: 'Engr. Damilola Olatunji',
    phone: '+234 803 456 7890',
    email: 'damilola@engr.ng',
    address: 'Plot 7A, Bodunde Street, Flower Garden G.R.A.',
    state: 'Kwara',
    amount: 485000,
    paymentMethod: 'transfer',
    paymentStatus: 'paid',
    orderStatus: 'received',
    deliveryLabel: 'Ilorin local dispatch',
    eta: 'Same day',
    items: [
      { name: 'EVC Pro 5kW Pure Sine Wave Hybrid Solar Inverter', price: 485000, qty: 1, color: 'EVC Orange' },
    ],
    createdAt: '3m ago',
  },
  {
    id: 'EVC-1081',
    name: 'Arc. Femi Adeyemi',
    phone: '+234 802 123 4567',
    email: 'femi@adeyemi.arch',
    address: 'Plot 11, Oluyoro Avenue, Off Awolowo Road, Bodija',
    state: 'Oyo',
    amount: 144000,
    paymentMethod: 'link',
    paymentStatus: 'paid',
    orderStatus: 'confirmed',
    deliveryLabel: 'Ibadan direct courier',
    eta: '24 hours',
    items: [
      { name: 'EVC Acoustic Fluted Slatted Wood Wall Panel', price: 36000, qty: 4, color: 'Charcoal' },
    ],
    createdAt: '22m ago',
  },
  {
    id: 'EVC-1080',
    name: 'Dr. Aisha Bello',
    phone: '+234 814 999 8877',
    email: 'aisha.bello@fct.gov.ng',
    address: 'Maitama District, Near Ministers Hill',
    state: 'Abuja (FCT)',
    amount: 98000,
    paymentMethod: 'transfer',
    paymentStatus: 'paid',
    orderStatus: 'dispatched',
    deliveryLabel: 'Abuja doorstep delivery',
    eta: '1 to 2 working days',
    items: [
      { name: 'EVC Biometric Smart Door Lock Pro (Face + Fingerprint)', price: 98000, qty: 1, color: 'Obsidian Black' },
    ],
    createdAt: '1h ago',
  },
  {
    id: 'EVC-1079',
    name: 'Chief Kingsley Eze',
    phone: '+234 708 111 2233',
    email: 'eze.enterprises@gmail.com',
    address: 'Peter Odili Road, Trans-Amadi Axis',
    state: 'Rivers',
    amount: 920000,
    paymentMethod: 'transfer',
    paymentStatus: 'paid',
    orderStatus: 'confirmed',
    deliveryLabel: 'Nationwide tracked courier',
    eta: '2 to 3 days',
    items: [
      { name: 'EVC 5.12kWh LiFePO4 Wall-Mount Lithium Battery', price: 920000, qty: 1, color: 'Pure White' },
    ],
    createdAt: '2h ago',
  },
];

export interface RecentOrdersTickerProps {
  initialOrders?: AdminOrder[];
  title?: string;
}

export const RecentOrdersTicker: React.FC<RecentOrdersTickerProps> = ({
  initialOrders = [],
  title = 'Live Consignment Stream',
}) => {
  const [orders, setOrders] = useState<AdminOrder[]>(
    initialOrders.length > 0 ? initialOrders : INITIAL_DEMO_ORDERS
  );
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [filter, setFilter] = useState<'all' | 'ilorin' | 'ibadan' | 'abuja' | 'high-value'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'ilorin') return o.state.toLowerCase().includes('kwara') || o.address.toLowerCase().includes('ilorin');
    if (filter === 'ibadan') return o.state.toLowerCase().includes('oyo') || o.address.toLowerCase().includes('ibadan');
    if (filter === 'abuja') return o.state.toLowerCase().includes('abuja');
    if (filter === 'high-value') return o.amount >= 300000;
    return true;
  }).filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return o.id.toLowerCase().includes(q) || o.name.toLowerCase().includes(q) || o.state.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-lg space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Hub Telemetry
          </span>
          <h3 className="font-display font-bold text-lg text-[var(--ink)]">
            {title}
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {(['all', 'ilorin', 'ibadan', 'abuja', 'high-value'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full font-semibold capitalize transition-all ${
                filter === key
                  ? 'bg-brand text-white'
                  : 'bg-[var(--surface2)] text-[var(--mute)] hover:text-[var(--ink)]'
              }`}
            >
              {key === 'high-value' ? '₦300k+' : key}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-[var(--line)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[var(--surface2)] border-b border-[var(--line)]">
              <tr>
                <th className="py-2.5 px-3 text-left font-bold text-[var(--ink)]">Order ID</th>
                <th className="py-2.5 px-3 text-left font-bold text-[var(--ink)]">Client</th>
                <th className="py-2.5 px-3 text-left font-bold text-[var(--ink)]">Destination</th>
                <th className="py-2.5 px-3 text-right font-bold text-[var(--ink)]">Amount</th>
                <th className="py-2.5 px-3 text-center font-bold text-[var(--ink)]">Payment</th>
                <th className="py-2.5 px-3 text-center font-bold text-[var(--ink)]">Dispatch Status</th>
                <th className="py-2.5 px-3 text-right font-bold text-[var(--ink)]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[var(--surface2)]/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-brand">{o.id}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-[var(--ink)] block">{o.name}</span>
                    <span className="text-[11px] text-[var(--mute)]">{o.phone}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-[var(--ink)] block">{o.state}</span>
                    <span className="text-[11px] text-[var(--mute)] truncate max-w-[160px] block">
                      {o.address}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[var(--ink)]">
                    {money(o.amount)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20">
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="text-xs font-semibold text-brand hover:underline"
                    >
                      Inspect &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Order Inspect Modal */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[var(--surface)] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 p-6 shadow-2xl"
          >
            <div className="bg-[var(--surface)]/95 rounded-2xl p-5 border border-[var(--line)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div>
                  <h4 className="font-display font-bold text-base text-[var(--ink)]">
                    Consignment {selectedOrder.id}
                  </h4>
                  <span className="text-xs text-[var(--mute)]">{selectedOrder.createdAt}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--mute)]">Client:</span>
                  <span className="font-semibold text-[var(--ink)]">{selectedOrder.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--mute)]">Phone:</span>
                  <span className="font-mono text-[var(--ink)]">{selectedOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--mute)]">Address:</span>
                  <span className="text-[var(--ink)] text-right max-w-[240px] truncate">{selectedOrder.address}, {selectedOrder.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--mute)]">Total:</span>
                  <span className="font-bold text-brand font-mono text-sm">{money(selectedOrder.amount)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--line)] flex justify-end gap-2">
                <a
                  href={waLink(`Hello ${selectedOrder.name}, reaching out from EVC Nig. Ltd regarding your order ${selectedOrder.id}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Client
                </a>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn-ghost text-xs py-2 px-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
