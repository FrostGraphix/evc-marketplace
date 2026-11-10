'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShoppingBag,
  Trash2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'order' | 'stock' | 'system' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'New Turnkey Solar Order Placed',
    message: 'Client in Bodija, Ibadan placed an order for 5kVA Hybrid Inverter & 10kWh Lithium Battery.',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    read: false,
    link: '/admin/orders',
  },
  {
    id: 'notif-2',
    type: 'stock',
    title: 'Low Inventory Alert: 5kVA Inverters',
    message: 'Current warehouse stock in Ilorin Hub is down to 2 units. Consider restocking supplier consignment.',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
    link: '/admin/products',
  },
  {
    id: 'notif-3',
    type: 'payment',
    title: 'Paystack Payment Settled',
    message: 'Payment of ₦1,250,000 for Consignment #EVC-8821 verified and settled successfully.',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    read: true,
    link: '/admin/orders',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Abuja Hub Logistics Sync Complete',
    message: 'Interstate courier waybill manifests updated across Garki and Wuse operational depots.',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    read: true,
  },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'stock' | 'order'>('all');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'stock') return n.type === 'stock';
    if (filter === 'order') return n.type === 'order';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-brand" />;
      case 'stock':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'payment':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'system':
      default:
        return <Zap className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            Alerts &amp; Operational Telemetry
          </h1>
          <p className="text-xs text-[var(--mute)] mt-1">
            Real-time feed of equipment stock thresholds, dispatch movements, and transaction logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllRead}
            className="btn-ghost text-xs py-2 px-3 border border-glow/25 text-[var(--mute)] hover:text-white"
          >
            Mark All Read
          </button>
          <button
            onClick={handleClearAll}
            className="btn-ghost text-xs py-2 px-3 border border-glow/25 text-rose-400 hover:text-rose-300"
          >
            Clear Feed
          </button>
        </div>
      </div>

      {/* Notifications Card */}
      <div className="rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl overflow-hidden">
        {/* Filters bar */}
        <div className="flex border-b border-glow/15 px-4 pt-2 gap-2">
          {(['all', 'unread', 'order', 'stock'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-3 text-xs font-semibold capitalize border-b-2 transition-all ${
                filter === tab
                  ? 'border-brand text-brand'
                  : 'border-transparent text-[var(--mute)] hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Alerts' : tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="divide-y divide-glow/10">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-[var(--mute)]">
              No alerts in this category.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                  item.read ? 'opacity-70 hover:opacity-100' : 'bg-white/[0.02]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-black/40 border border-glow/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-sm font-semibold text-white block">
                      {item.title}
                    </strong>
                    <span className="text-[11px] font-mono text-[var(--mute)] flex-shrink-0">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--ink2)] mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    {item.link && (
                      <Link
                        href={item.link}
                        className="text-xs text-brand font-semibold hover:underline flex items-center gap-1"
                      >
                        Action Item &rarr;
                      </Link>
                    )}
                    <button
                      onClick={() => handleToggleRead(item.id)}
                      className="text-[11px] text-[var(--mute)] hover:text-white"
                    >
                      {item.read ? 'Mark unread' : 'Mark as read'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}