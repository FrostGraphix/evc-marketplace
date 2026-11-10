'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  Sparkles,
  Store,
  Shield,
  Truck,
  Users,
  CheckCircle2,
  Download,
  Plus,
  Clock,
  Zap,
  RefreshCw,
  Database,
} from 'lucide-react';
import { getAdminSession, AdminUser, isStoreOpen, formatAdminRole } from '@/lib/adminAuth';
import { playOrderChime } from '@/components/admin/AudioAlert';
import { StatCard } from '@/components/admin/StatCard';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { RecentOrdersTicker } from '@/components/admin/RecentOrdersTicker';

interface AnalyticsData {
  isLiveFromSupabase: boolean;
  timestamp: string;
  kpis: {
    grossRevenue: {
      value: number;
      formatted: string;
      change: string;
      isPositive: boolean;
      subtitle: string;
    };
    totalOrders: {
      value: number;
      formatted: string;
      change: string;
      isPositive: boolean;
      subtitle: string;
    };
    avgOrderValue: {
      value: number;
      formatted: string;
      change: string;
      isPositive: boolean;
      subtitle: string;
    };
    pendingDispatch: {
      value: number;
      formatted: string;
      change: string;
      isWarning: boolean;
      subtitle: string;
    };
  };
}

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync user
  useEffect(() => {
    setCurrentUser(getAdminSession());
  }, []);

  // Fetch live analytical data from /api/admin/analytics
  const fetchAnalytics = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('Failed to fetch analytics metrics:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const handleManualRefresh = () => {
    fetchAnalytics(true);
    playOrderChime();
  };

  const kpis = data?.kpis;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Banner & Hub Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              EVC Grid &amp; Dispatch Nodes Online
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
            Welcome back, {currentUser?.name || 'Administrator'}
          </h1>
          <p className="text-xs text-[var(--mute)]">
            {formatAdminRole(currentUser?.role || 'super_admin')} • {currentUser?.department || 'Executive Operations'} • Hubs: Ilorin, Ibadan, Abuja
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="btn-ghost text-xs py-2 px-3.5 border border-glow/25 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh Telemetry'}</span>
          </button>

          <Link
            href="/admin/orders"
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Gross Equipment Revenue"
          value={kpis?.grossRevenue.formatted || '₦42,850,000'}
          change={kpis?.grossRevenue.change || '+14.2%'}
          isPositive={kpis?.grossRevenue.isPositive ?? true}
          subtitle={kpis?.grossRevenue.subtitle || 'Vs last 30 days'}
          icon={TrendingUp}
          sparklineData={[15, 20, 24, 28, 35, 42]}
        />

        <StatCard
          title="Consignments Logged"
          value={kpis?.totalOrders.formatted || '184'}
          change={kpis?.totalOrders.change || '+8.5%'}
          isPositive={kpis?.totalOrders.isPositive ?? true}
          subtitle={kpis?.totalOrders.subtitle || 'Active pipeline'}
          icon={ShoppingBag}
          sparklineData={[12, 14, 18, 16, 22, 25]}
        />

        <StatCard
          title="Average Order Value"
          value={kpis?.avgOrderValue.formatted || '₦345,000'}
          change={kpis?.avgOrderValue.change || '+6.1%'}
          isPositive={kpis?.avgOrderValue.isPositive ?? true}
          subtitle={kpis?.avgOrderValue.subtitle || 'Clean power & finishes'}
          icon={Zap}
          sparklineData={[250, 280, 310, 320, 345]}
        />

        <StatCard
          title="Pending Hub Dispatch"
          value={kpis?.pendingDispatch.formatted || '8'}
          change={kpis?.pendingDispatch.change || '3 critical'}
          isPositive={!(kpis?.pendingDispatch.isWarning ?? false)}
          subtitle={kpis?.pendingDispatch.subtitle || 'Ilorin, Ibadan, Abuja'}
          icon={Truck}
          sparklineData={[5, 7, 4, 9, 6, 8]}
        />
      </div>

      {/* Real-time Order Ticker */}
      <div className="p-4 sm:p-5 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand" /> Live Fleet &amp; Order Activity
          </span>
          <Link href="/admin/orders" className="text-xs text-brand hover:underline font-semibold">
            All Orders &rarr;
          </Link>
        </div>
        <RecentOrdersTicker />
      </div>

      {/* Main Analytical Charts Suite */}
      <AnalyticsCharts />
    </div>
  );
}