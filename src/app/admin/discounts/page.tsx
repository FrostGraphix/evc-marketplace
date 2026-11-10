'use client';

import React, { useState, useMemo } from 'react';
import { money } from '@/lib/utils';
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Percent,
  Sparkles,
  Calendar,
  Copy,
  AlertCircle,
  X,
  Clock,
  Zap,
} from 'lucide-react';
import { useModal } from '@/context/ModalContext';

interface DiscountCoupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSpend?: number;
  description: string;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string;
}

const INITIAL_COUPONS: DiscountCoupon[] = [
  {
    code: 'EVC2026',
    type: 'percent',
    value: 10,
    minSpend: 100000,
    description: '10% Welcome discount on complete solar packages and living finishes',
    usageCount: 42,
    isActive: true,
  },
  {
    code: 'SOLARPOWER5',
    type: 'percent',
    value: 5,
    minSpend: 500000,
    description: '5% Enterprise discount on LiFePO4 battery banks and high-capacity inverters',
    usageCount: 19,
    isActive: true,
  },
  {
    code: 'HUBPICKUP',
    type: 'fixed',
    value: 5000,
    minSpend: 150000,
    description: '₦5,000 credit for verified hub self-pickups at Ilorin or Ibadan',
    usageCount: 8,
    isActive: true,
  },
];

export default function AdminDiscountsPage() {
  const { confirm } = useModal();
  const [coupons, setCoupons] = useState<DiscountCoupon[]>(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percent' | 'fixed'>('percent');
  const [newValue, setNewValue] = useState(10);
  const [newMinSpend, setNewMinSpend] = useState(50000);
  const [newDesc, setNewDesc] = useState('');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDelete = async (code: string) => {
    const ok = await confirm({
      title: 'Delete Promo Code',
      message: `Are you sure you want to delete promo code "${code}"? Clients will no longer be able to apply it at checkout.`,
      confirmText: 'Delete Code',
      variant: 'error',
    });
    if (!ok) return;
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const coupon: DiscountCoupon = {
      code: newCode.trim().toUpperCase(),
      type: newType,
      value: Number(newValue),
      minSpend: Number(newMinSpend) || 0,
      description: newDesc.trim() || `${newValue}% discount on selected hardware`,
      usageCount: 0,
      isActive: true,
    };

    setCoupons([coupon, ...coupons]);
    setIsCreateOpen(false);
    setNewCode('');
    setNewDesc('');
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            Discounts &amp; Promotional Codes
          </h1>
          <p className="text-xs text-[var(--mute)] mt-1">
            Configure enterprise vouchers, seasonal incentives, and promotional checkout discounts.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-glow/15 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-9 text-xs"
            />
            <Search className="w-3.5 h-3.5 text-[var(--mute)] absolute left-3 top-3" />
          </div>
          <span className="text-xs text-[var(--mute)] font-mono">{filteredCoupons.length} active vouchers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-[var(--mute)] uppercase text-[10px] tracking-wider border-b border-glow/15">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Minimum Order</th>
                <th className="py-3 px-4">Usage Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glow/10">
              {filteredCoupons.map((c) => (
                <tr key={c.code} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-sm text-brand">{c.code}</strong>
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="p-1 text-[var(--mute)] hover:text-white"
                        title="Copy code"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {copiedCode === c.code && (
                        <span className="text-[10px] text-emerald-400 font-semibold">Copied!</span>
                      )}
                    </div>
                    <span className="text-[11px] text-[var(--mute)] block mt-0.5">{c.description}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {c.type === 'percent' ? `${c.value}% OFF` : `-${money(c.value)}`}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[var(--mute)]">
                    {c.minSpend ? money(c.minSpend) : 'No minimum'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-white">
                    {c.usageCount} times
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggle(c.code)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                        c.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-[var(--mute)] border border-glow/25'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c.code)}
                      className="p-1.5 text-[var(--mute)] hover:text-rose-400 transition-colors"
                      title="Delete code"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isCreateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-glow/25 bg-[#03090a] p-6 sm:p-8 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 p-1 text-[var(--mute)] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-xl font-bold text-white">
              Create Promo Voucher
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                  Voucher Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SOLARPRO20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="input-field w-full text-xs uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="input-field w-full text-xs"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₦)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="input-field w-full text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                  Minimum Order (₦)
                </label>
                <input
                  type="number"
                  value={newMinSpend}
                  onChange={(e) => setNewMinSpend(Number(e.target.value))}
                  className="input-field w-full text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                  Campaign Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Special festive rebate on Tier-1 hybrid systems"
                  className="input-field w-full text-xs"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full h-11 justify-center text-xs shadow-xl active:scale-98 transition-all mt-2"
              >
                Publish Promo Voucher
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}