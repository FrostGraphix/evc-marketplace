'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Crown,
  Store,
  Truck,
  Check,
  AlertCircle,
  Zap,
} from 'lucide-react';
import {
  signInAdminWithSupabase,
  getAdminSession,
  ADMIN_PRESETS,
  AdminRole,
} from '@/lib/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeRolePreset, setActiveRolePreset] = useState<AdminRole | null>(null);

  // If already logged in, redirect straight to /admin/dashboard
  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleSelectDemoPreset = (role: AdminRole) => {
    const cred = ADMIN_PRESETS[role];
    if (cred) {
      setEmail(cred.email);
      setPassword('');
      setActiveRolePreset(role);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your operational email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await signInAdminWithSupabase(email.trim(), password);
      if (res.error) {
        setErrorMsg(res.error);
        setIsLoading(false);
        return;
      }

      router.replace('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#03090a]">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-radial-glow opacity-20" />

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex items-center justify-center text-brand shadow-xl">
            <Zap className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          EVC Operations Node
        </h2>
        <p className="mt-2 text-center text-xs text-[var(--mute)]">
          Regional Dispatch, Inventory &amp; Energy Control Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl backdrop-blur-xl">
          {/* Preset Roles Quick Selector */}
          <div className="mb-6 space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--mute)]">
              Quick Role Presets (Development / Testing)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemoPreset('super_admin')}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  activeRolePreset === 'super_admin'
                    ? 'border-brand bg-brand/15 text-white shadow-md'
                    : 'border-glow/25 bg-black/40 text-[var(--mute)] hover:text-white hover:border-glow/40'
                }`}
              >
                <Crown className="w-4 h-4 text-brand" />
                <span className="text-[10px] font-semibold">Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoPreset('store_manager')}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  activeRolePreset === 'store_manager'
                    ? 'border-brand bg-brand/15 text-white shadow-md'
                    : 'border-glow/25 bg-black/40 text-[var(--mute)] hover:text-white hover:border-glow/40'
                }`}
              >
                <Store className="w-4 h-4 text-brand" />
                <span className="text-[10px] font-semibold">Systems Mgr</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoPreset('dispatcher')}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  activeRolePreset === 'dispatcher'
                    ? 'border-brand bg-brand/15 text-white shadow-md'
                    : 'border-glow/25 bg-black/40 text-[var(--mute)] hover:text-white hover:border-glow/40'
                }`}
              >
                <Truck className="w-4 h-4 text-brand" />
                <span className="text-[10px] font-semibold">Dispatcher</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="staff@evcng.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full pl-10 text-xs sm:text-sm"
                />
                <Mail className="w-4 h-4 text-[var(--mute)] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full pl-10 pr-10 text-xs sm:text-sm"
                />
                <Lock className="w-4 h-4 text-[var(--mute)] absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[var(--mute)] hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11 justify-center text-xs shadow-xl active:scale-98 transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying Session...
                </>
              ) : (
                <>
                  Access Command Console <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-glow/15 flex items-center justify-between text-xs text-[var(--mute)]">
            <Link href="/" className="hover:text-brand transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Marketplace
            </Link>
            <span className="font-mono text-[11px]">EVC Core v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}