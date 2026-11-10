'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, ShieldAlert } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session) {
          setHasValidSession(true);
          setIsCheckingSession(false);
          return;
        }

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (!isMounted) return;
          if (session && (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY')) {
            setHasValidSession(true);
            setIsCheckingSession(false);
          }
        });

        setTimeout(() => {
          if (isMounted && isCheckingSession) {
            setIsCheckingSession(false);
          }
        }, 1500);

        return () => {
          authListener?.subscription?.unsubscribe();
        };
      } catch (err) {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [supabase, isCheckingSession]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);

      setTimeout(() => {
        router.push('/account');
        router.refresh();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16 sm:py-24">
      <div className="p-8 sm:p-10 rounded-[36px] bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl flex flex-col gap-6">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl border border-glow/25 bg-glow/10 text-brand flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6 text-brand" />
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
            Create <em className="serif-italic text-brand">New Password</em>
          </h1>
          <p className="text-xs text-slate-400">
            Choose a strong, secure password for your EVC Nigeria account.
          </p>
        </div>

        {isCheckingSession ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-xs text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand" />
            <span>Verifying recovery link...</span>
          </div>
        ) : !hasValidSession && !isSuccess ? (
          <div className="space-y-5 text-center">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-start gap-3 text-left">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
              <div>
                <p className="font-semibold mb-1">Session Expired or Invalid Link</p>
                <p className="leading-relaxed">
                  Your password reset link is invalid or has expired. For your security, recovery links can only be used once.
                </p>
              </div>
            </div>

            <Link
              href="/forgot-password"
              className="btn-primary w-full py-3.5 text-xs font-semibold justify-center inline-flex items-center gap-2"
            >
              Request New Reset Link <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2">
              <Link href="/login" className="text-xs text-slate-400 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="space-y-5 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <p className="text-sm font-bold text-white">Password Updated!</p>
              <p className="text-xs text-slate-400">
                Your new password has been saved. Redirecting you to your account...
              </p>
            </div>

            <Link
              href="/account"
              className="btn-primary w-full py-3.5 text-xs font-semibold justify-center inline-flex items-center gap-2"
            >
              Go to My Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                  New Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 pr-12 rounded-2xl bg-[#03090a]/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 pr-12 rounded-2xl bg-[#03090a]/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 text-xs font-semibold justify-center disabled:opacity-50 mt-2 inline-flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating Password...
                  </>
                ) : (
                  <>
                    Update Password <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Remember your password?{' '}
          <Link href="/login" className="text-brand font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
