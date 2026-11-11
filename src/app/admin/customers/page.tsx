'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CustomerProfile, CustomerVIPTier } from '@/types';
import { money, waLink } from '@/lib/utils';
import {
  Users,
  Search,
  Crown,
  Award,
  UserCheck,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  X,
  CreditCard,
  Building,
  RefreshCw,
  Shield,
  Zap,
} from 'lucide-react';
import { STATES } from '@/lib/products';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<'all' | CustomerVIPTier>('all');
  const [selectedState, setSelectedState] = useState('all');
  const [activeDossier, setActiveDossier] = useState<CustomerProfile | null>(null);

  // Lock body scroll when customer dossier modal is open
  useEffect(() => {
    if (!activeDossier) return;
    document.body.classList.add('locked');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDossier(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('locked');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDossier]);

  // Fetch live aggregated customers from API
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        if (data.customers && Array.isArray(data.customers)) {
          setCustomers(data.customers);
        }
      }
    } catch (err) {
      console.warn('Failed to load customers from /api/admin/customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Tier filter
      if (selectedTier !== 'all' && c.tier !== selectedTier) return false;

      // State filter
      if (selectedState !== 'all' && c.state !== selectedState) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q) || false;
        const matchesPhone = c.phone?.toLowerCase().includes(q) || false;
        const matchesEmail = c.email?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesPhone && !matchesEmail) return false;
      }

      return true;
    });
  }, [customers, selectedTier, selectedState, searchQuery]);

  // Overall metrics
  const totalLTV = useMemo(() => customers.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0), [customers]);
  const vipCount = useMemo(() => customers.filter((c) => c.tier === 'Corporate Elite' || c.tier === 'VIP Platinum').length, [customers]);

  const getTierBadge = (tier?: CustomerVIPTier) => {
    switch (tier) {
      case 'Corporate Elite':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Crown className="w-3 h-3 text-amber-400" /> Corporate Elite
          </span>
        );
      case 'VIP Platinum':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-400/20 text-purple-300 border border-purple-400/30">
            <Award className="w-3 h-3 text-purple-400" /> VIP Platinum
          </span>
        );
      case 'Gold Partner':
      case 'Gold Member':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
            Gold Member
          </span>
        );
      case 'Silver Member':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-300/20 text-slate-200 border border-slate-300/30">
            Silver Member
          </span>
        );
      case 'Bronze Member':
      case 'Regular':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-800 text-[var(--mute)] border border-glow/25">
            Regular
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
            Clients &amp; Commercial Accounts
          </h1>
          <p className="text-xs text-[var(--mute)] mt-1">
            Directory of facility managers, solar procurement officers, and private clients across Nigeria.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={isLoading}
          className="btn-ghost text-xs py-2 px-3.5 border border-glow/25 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand' : ''}`} />
          <span>Refresh Clients</span>
        </button>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-[var(--mute)]">Total Client Accounts</span>
          <div className="text-xl font-bold font-display text-[var(--ink)] mt-1">{customers.length}</div>
        </div>
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-amber-400">Enterprise VIPs</span>
          <div className="text-xl font-bold font-display text-amber-400 mt-1">{vipCount}</div>
        </div>
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-emerald-400">Cumulative LTV</span>
          <div className="text-xl font-bold font-display text-emerald-400 mt-1">{money(totalLTV)}</div>
        </div>
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-brand">Avg Client Value</span>
          <div className="text-xl font-bold font-display text-brand mt-1">
            {money(customers.length ? totalLTV / customers.length : 0)}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <input
            type="text"
            placeholder="Search by client name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full pl-9 text-xs"
          />
          <Search className="w-3.5 h-3.5 text-[var(--mute)] absolute left-3 top-3" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Tier filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as any)}
            className="input-field text-xs py-1.5"
          >
            <option value="all">All VIP Tiers</option>
            <option value="Corporate Elite">Corporate Elite</option>
            <option value="VIP Platinum">VIP Platinum</option>
            <option value="Gold Member">Gold Member</option>
            <option value="Silver Member">Silver Member</option>
            <option value="Regular">Regular</option>
          </select>

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
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-[var(--mute)] uppercase text-[10px] tracking-wider border-b border-glow/15">
              <tr>
                <th className="py-3 px-4">Client / Organization</th>
                <th className="py-3 px-4">State &amp; Region</th>
                <th className="py-3 px-4">VIP Tier</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Total Lifetime Spend</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glow/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--mute)]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand mb-2" />
                    Loading client profiles...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--mute)]">
                    No clients matching current filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center font-bold text-brand font-display">
                          {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <strong className="text-white block font-medium">{cust.name}</strong>
                          <span className="text-[11px] text-[var(--mute)]">{cust.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-white">
                      {cust.state || 'Kwara'}
                    </td>
                    <td className="py-3.5 px-4">{getTierBadge(cust.tier)}</td>
                    <td className="py-3.5 px-4 font-mono text-white">
                      {cust.totalOrders || 0} {cust.totalOrders === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-brand">
                      {money(cust.lifetimeValue || 0)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={waLink(`Hello ${cust.name}, this is EVC Nig. Ltd following up regarding your equipment orders.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-wa text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> WhatsApp
                        </a>
                        <button
                          onClick={() => setActiveDossier(cust)}
                          className="btn-ghost text-xs py-1 px-2.5 border border-glow/25 text-white hover:text-brand"
                        >
                          Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Dossier Modal */}
      {activeDossier && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveDossier(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-glow/25 bg-[#03090a] p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveDossier(null)}
              className="absolute top-5 right-5 p-1 text-[var(--mute)] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold text-2xl font-display">
                {activeDossier.name ? activeDossier.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">{activeDossier.name}</h3>
                <div className="mt-1">{getTierBadge(activeDossier.tier)}</div>
              </div>
            </div>

            <div className="space-y-3 border-y border-glow/15 py-4 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--mute)]">Email:</span>
                <span className="font-mono text-white">{activeDossier.email || 'None on file'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mute)]">WhatsApp Phone:</span>
                <span className="font-mono text-brand font-bold">{activeDossier.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mute)]">Delivery State:</span>
                <span className="text-white">{activeDossier.state || 'Kwara'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mute)]">Site Address:</span>
                <span className="text-white text-right max-w-xs">{activeDossier.address || 'Standard Hub Delivery'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-glow/15">
                <span className="text-[var(--mute)]">Lifetime Equipment Spend:</span>
                <span className="font-mono font-bold text-brand text-sm">{money(activeDossier.lifetimeValue || 0)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={waLink(`Hello ${activeDossier.name}, this is EVC Nig. Ltd regarding your power system inquiry.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa flex-1 h-10 justify-center text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Chat on WhatsApp
              </a>
              <button
                onClick={() => setActiveDossier(null)}
                className="btn-ghost flex-1 h-10 justify-center text-xs border border-glow/25"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}