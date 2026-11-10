'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { OrderRecord, OrderStatus } from '@/types';
import { STATES } from '@/lib/products';
import { money } from '@/lib/utils';
import { OrderModal } from '@/components/admin/OrderModal';
import {
  Search,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  RefreshCw,
  ShoppingBag,
  Clock,
  Eye,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live orders
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch orders from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: newStatus } : ord))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab !== 'all' && (order.orderStatus || 'received') !== activeTab) {
        return false;
      }
      // State filter
      if (selectedState !== 'all' && order.state !== selectedState) {
        return false;
      }
      // Payment filter
      if (selectedPayment !== 'all' && order.paymentMethod !== selectedPayment) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesName = order.name.toLowerCase().includes(query);
        const matchesPhone = order.phone.toLowerCase().includes(query);
        const matchesEmail = order.email?.toLowerCase().includes(query) || false;
        if (!matchesId && !matchesName && !matchesPhone && !matchesEmail) {
          return false;
        }
      }
      return true;
    });
  }, [orders, activeTab, selectedState, selectedPayment, searchQuery]);

  const stats = useMemo(() => {
    const total = orders.length;
    const received = orders.filter((o) => !o.orderStatus || o.orderStatus === 'received').length;
    const confirmed = orders.filter((o) => o.orderStatus === 'confirmed').length;
    const shipped = orders.filter((o) => o.orderStatus === 'shipped' || o.orderStatus === 'dispatched').length;
    const delivered = orders.filter((o) => o.orderStatus === 'delivered').length;
    const gross = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    return { total, received, confirmed, shipped, delivered, gross };
  }, [orders]);

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3 text-blue-400" /> Confirmed
          </span>
        );
      case 'shipped':
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/30">
            <Truck className="w-3 h-3 text-brand" /> Dispatched
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <PackageCheck className="w-3 h-3 text-emerald-400" /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3 text-rose-400" /> Cancelled
          </span>
        );
      case 'received':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 text-amber-400" /> Processing
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            Consignment Operations
          </h1>
          <p className="text-xs text-[var(--mute)] mt-1">
            Manage regional dispatches, assign couriers, and track consignments across Nigeria.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="btn-ghost text-xs py-2 px-3.5 border border-glow/25 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand' : ''}`} />
          <span>Refresh Consignments</span>
        </button>
      </div>

      {/* Top 4 KPI mini cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-[var(--mute)]">Total Consignments</span>
          <div className="text-xl font-bold font-display text-[var(--ink)] mt-1">{stats.total}</div>
        </div>
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-amber-400">Received / Pending</span>
          <div className="text-xl font-bold font-display text-amber-400 mt-1">{stats.received}</div>
        </div>
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-brand">In Transit / Dispatched</span>
          <div className="text-xl font-bold font-display text-brand mt-1">{stats.shipped}</div>
        </div>
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-emerald-400">Total Booked Volume</span>
          <div className="text-xl font-bold font-display text-emerald-400 mt-1">{money(stats.gross)}</div>
        </div>
      </div>

      {/* Main Order Card: Filter bar + Table */}
      <div className="rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl overflow-hidden">
        {/* Status Tabs */}
        <div className="flex border-b border-glow/15 overflow-x-auto scrollbar-none px-4 pt-2">
          {(['all', 'received', 'confirmed', 'shipped', 'dispatched', 'delivered', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-semibold capitalize whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-brand text-brand'
                  : 'border-transparent text-[var(--mute)] hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Consignments' : tab}
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="p-4 sm:p-5 border-b border-glow/15 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <input
              type="text"
              placeholder="Search by ID, client name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-9 text-xs"
            />
            <Search className="w-3.5 h-3.5 text-[var(--mute)] absolute left-3 top-3" />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* State filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="input-field text-xs py-1.5"
            >
              <option value="all">All States</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Payment filter */}
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="input-field text-xs py-1.5"
            >
              <option value="all">All Payments</option>
              <option value="link">Paystack Online</option>
              <option value="transfer">Bank Transfer</option>
              <option value="pod">Pay on Delivery</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-[var(--mute)] uppercase text-[10px] tracking-wider border-b border-glow/15">
              <tr>
                <th className="py-3 px-4">Consignment ID</th>
                <th className="py-3 px-4">Client / Site</th>
                <th className="py-3 px-4">State &amp; Hub</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glow/10">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--mute)]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand mb-2" />
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--mute)]">
                    No orders matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      #{order.id}
                      <span className="block text-[10px] font-normal text-[var(--mute)]">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="text-white block font-medium">{order.name}</strong>
                      <span className="text-[11px] text-[var(--mute)]">{order.phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white block">{order.state}</span>
                      <span className="text-[11px] text-[var(--mute)]">{order.deliveryLabel || 'Direct Dispatch'}</span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(order.orderStatus)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-white block">{order.payLabel || order.paymentMethod}</span>
                      <span
                        className={`text-[10px] font-semibold ${
                          order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {order.paymentStatus?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-brand">
                      {money(order.total)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="btn-ghost text-xs py-1.5 px-3 border border-glow/25 inline-flex items-center gap-1 text-white hover:text-brand"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Dispatch Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}