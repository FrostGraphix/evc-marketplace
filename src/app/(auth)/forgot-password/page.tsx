'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Loader2, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch password recovery link.');
      }

      setIsSubmitted(true);
      setCountdown(60);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isLoading) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to resend link.');
      }

      setCountdown(60);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not resend link. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16 sm:py-24">
      <div className="p-8 sm:p-10 rounded-[36px] bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl flex flex-col gap-6">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl border border-glow/25 bg-glow/10 text-brand flex items-center justify-center mx-auto mb-3">
            {isSubmitted ? <Mail className="w-6 h-6 text-brand" /> : <KeyRound className="w-6 h-6 text-brand" />}
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
            {isSubmitted ? (
              <>
                Check Your <em className="serif-italic text-brand">Inbox</em>
              </>
            ) : (
              <>
                Reset <em className="serif-italic text-brand">Password</em>
              </>
            )}
          </h1>
          <p className="text-xs text-slate-400">
            {isSubmitted
              ? `We dispatched a secure recovery link to ${email}. Click the link in your email to choose a new password.`
              : 'Enter the email address registered with your EVC account and we’ll send you a password reset link.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium text-center">
            {errorMsg}
          </div>
        )}

        {isSubmitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                If an account is associated with this email, you will receive instructions in the next few minutes.
                Remember to check your spam or promotions folder.
              </div>
            </div>

            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isLoading}
              className="w-full py-3 rounded-2xl border border-slate-800 bg-[#03090a]/80 text-xs font-semibold text-slate-200 hover:border-brand disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Resending...
                </>
              ) : countdown > 0 ? (
                `Resend link in ${countdown}s`
              ) : (
                'Resend recovery link'
              )}
            </button>

            <Link
              href="/login"
              className="btn-primary w-full py-3.5 text-xs font-semibold justify-center inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@evcng.com"
                className="w-full h-12 px-4 rounded-2xl bg-[#03090a]/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-xs font-semibold justify-center disabled:opacity-50 mt-2 inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending Link...
                </>
              ) : (
                <>
                  Send Recovery Link <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Remembered your password?{' '}
          <Link href="/login" className="text-brand font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
