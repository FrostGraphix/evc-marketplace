'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { STATES } from '@/lib/products';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    state: 'Kwara',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
            state: formData.state,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/account');
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 sm:py-20">
      <div className="p-8 sm:p-10 rounded-[36px] bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl flex flex-col gap-6">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl border border-glow/25 bg-glow/10 text-brand flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-6 h-6 text-brand" />
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
            Create an <em className="serif-italic text-brand">Account</em>
          </h1>
          <p className="text-xs text-slate-400">
            Join EVC Nig. Ltd to save projects, track solar & tech orders, and access trade terms.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-slate-300">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Engr. Dapo Adeleke"
              className="w-full h-12 px-4 rounded-2xl bg-[#03090a]/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-slate-300">WhatsApp Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 0708 293 8870"
              className="w-full h-12 px-4 rounded-2xl bg-[#03090a]/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-slate-300">State</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full h-12 px-4 rounded-2xl bg-[#03090a]/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
            >
              {STATES.map((s) => (
                <option key={s} value={s} className="bg-[#03090a] text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-slate-300">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@evcng.com"
              className="w-full h-12 px-4 rounded-2xl bg-[#03090a]/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-slate-300">Password (min 6 characters) *</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-2xl bg-[#03090a]/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3.5 text-xs font-semibold justify-center disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already have an account?{' '}
          <Link href="/login" className="text-brand font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
