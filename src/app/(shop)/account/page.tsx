'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Package,
  LogOut,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  Edit3,
  Save,
  X,
  Home,
  Crown,
  KeyRound,
  Shield,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { OrderRecord } from '@/types';
import { money, waLink } from '@/lib/utils';
import { ProductImage } from '@/components/shop/ProductImage';
import { STATES } from '@/lib/products';

function getOrderStatusBadge(status?: string) {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return {
        label: 'Confirmed',
        classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
        icon: <CheckCircle2 className="w-3 h-3 text-blue-500" />,
      };
    case 'shipped':
    case 'dispatched':
      return {
        label: status === 'shipped' ? 'Shipped' : 'Dispatched',
        classes: 'bg-brand/10 text-brand border border-brand/30',
        icon: <Truck className="w-3 h-3 text-brand" />,
      };
    case 'delivered':
      return {
        label: 'Delivered',
        classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        classes: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
        icon: <XCircle className="w-3 h-3 text-rose-500" />,
      };
    case 'pending':
    default:
      return {
        label: 'Processing',
        classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
        icon: <Clock className="w-3 h-3 text-amber-500" />,
      };
  }
}

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading, signOut } = useAuth();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Profile edit form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Kwara');

  // Password reset fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setState(profile.state || 'Kwara');
    }
  }, [profile]);

  // Fetch client's order history
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          // Filter to user orders matching email or phone
          const userOrders = data.orders.filter(
            (o: OrderRecord) =>
              (user.email && o.email?.toLowerCase() === user.email.toLowerCase()) ||
              (profile?.phone && o.phone === profile.phone)
          );
          setOrders(userOrders);
        }
      }
    } catch (err) {
      console.warn('Could not load user order history:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?next=/account');
      return;
    }
    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router, fetchOrders]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          state,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      setSaveSuccess(true);
      setIsEditingProfile(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Unable to save profile changes.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ text: 'Password must be at least 6 characters long.', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'Passwords do not match.', isError: true });
      return;
    }

    setPasswordLoading(true);
    setPasswordMsg(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password.');
      }

      setPasswordMsg({ text: 'Password successfully updated!', isError: false });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ text: err.message || 'Unable to update password.', isError: true });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[var(--mute)]">Authenticating account session...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-10">
      {/* Top Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold text-2xl font-display">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)]">
              {profile?.full_name || 'EVC Client'}
            </h1>
            <p className="text-xs text-[var(--mute)] flex items-center gap-2 mt-0.5">
              <span>{user.email}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Active Member</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="btn-ghost text-xs py-2 px-4 border border-glow/25 flex items-center gap-1.5 text-rose-400 hover:text-rose-300"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          Your profile details were updated successfully!
        </div>
      )}

      {/* Main Grid: Profile Info & Order History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile & Addresses */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Card */}
          <div className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-[var(--ink)] flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-brand" /> Site &amp; Billing Profile
              </h3>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-xs text-brand font-semibold hover:underline flex items-center gap-1"
              >
                {isEditingProfile ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                {isEditingProfile ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                    WhatsApp Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-field w-full text-xs"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                    Delivery / Installation Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>

                {profileError && <p className="text-xs text-rose-400">{profileError}</p>}

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-primary w-full h-9 justify-center text-xs"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[var(--mute)] block">Full Name:</span>
                  <span className="font-semibold text-white">{profile?.full_name || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">WhatsApp Phone:</span>
                  <span className="font-semibold text-white">{profile?.phone || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Default State:</span>
                  <span className="font-semibold text-white">{profile?.state || 'Kwara'}</span>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Site Address:</span>
                  <span className="font-semibold text-white leading-relaxed">{profile?.address || 'No address saved yet'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Security / Password Card */}
          <div className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-4">
            <h3 className="font-display text-base font-bold text-[var(--ink)] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-brand" /> Update Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <input
                  type="password"
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              {passwordMsg && (
                <p className={`text-xs ${passwordMsg.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {passwordMsg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="btn-ghost w-full h-9 justify-center text-xs border border-glow/25"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[var(--ink)] flex items-center gap-2">
                <Package className="w-5 h-5 text-brand" /> Equipment Order History
              </h3>
              <span className="text-xs font-mono text-brand font-semibold">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>

            {ordersLoading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-[var(--mute)]">Loading order logs...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center space-y-3 border border-dashed border-glow/25 rounded-2xl p-6">
                <p className="text-xs text-[var(--mute)]">You have not placed any hardware orders yet.</p>
                <Link href="/shop" className="btn-primary text-xs py-2 px-5 inline-flex">
                  Explore Equipment Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const badge = getOrderStatusBadge(ord.orderStatus);
                  return (
                    <div
                      key={ord.id}
                      className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-glow/25 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <strong className="text-sm font-mono text-white block">#{ord.id}</strong>
                          <span className="text-[11px] text-[var(--mute)]">
                            {new Date(ord.createdAt || Date.now()).toLocaleDateString()} • {ord.deliveryLabel}
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.classes}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="text-xs text-[var(--ink2)] space-y-1 border-y border-glow/15 py-2">
                        {(((ord as any).items || (ord as any).cart || []) as any[]).map((c, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{c.qty}x {c.name || `Product #${c.id}`} ({c.color})</span>
                            <span className="font-mono text-[var(--mute)]">{money((c.price || 0) * c.qty)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total and Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-bold text-sm text-brand font-mono">{money(ord.total)}</span>
                        <div className="flex gap-2">
                          <Link
                            href={`/track?id=${ord.id}`}
                            className="btn-ghost text-xs py-1.5 px-3 border border-glow/25 flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" /> Track Consignment
                          </Link>
                          <a
                            href={waLink(`Hello EVC Nig. Ltd, I am checking on my order #${ord.id}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-wa text-xs py-1.5 px-3 flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Hub WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}