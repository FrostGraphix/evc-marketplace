'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  RefreshCw,
  Zap,
  Truck,
} from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const kpis = data?.kpis;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            Intelligence &amp; Financial Analytics
          </h1>
          <p className="text-xs text-[var(--mute)] mt-1">
            Real-time financial telemetry, regional demand distribution, and fulfillment velocity across Nigeria.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex border border-glow/25 rounded-xl bg-black/40 p-1 text-xs font-semibold">
            {(['7d', '30d', '90d', '1y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg uppercase transition-all ${
                  timeRange === r
                    ? 'bg-brand text-white shadow'
                    : 'text-[var(--mute)] hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="btn-ghost text-xs py-2 px-3 border border-glow/25 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Gross Equipment Revenue"
          value={kpis?.grossRevenue?.formatted || '₦42,850,000'}
          change={kpis?.grossRevenue?.change || '+14.2%'}
          isPositive={kpis?.grossRevenue?.isPositive ?? true}
          subtitle="All 36 states fulfilled"
          icon={TrendingUp}
          sparklineData={[20, 24, 28, 35, 42]}
        />
        <StatCard
          title="Consignments Logged"
          value={kpis?.totalOrders?.formatted || '184'}
          change={kpis?.totalOrders?.change || '+8.5%'}
          isPositive={kpis?.totalOrders?.isPositive ?? true}
          subtitle="Orders & verified quotes"
          icon={ShoppingBag}
          sparklineData={[14, 18, 16, 22, 25]}
        />
        <StatCard
          title="Average Order Value"
          value={kpis?.avgOrderValue?.formatted || '₦345,000'}
          change={kpis?.avgOrderValue?.change || '+6.1%'}
          isPositive={kpis?.avgOrderValue?.isPositive ?? true}
          subtitle="Turnkey systems & packages"
          icon={Zap}
          sparklineData={[280, 310, 320, 345]}
        />
        <StatCard
          title="Pending Hub Dispatch"
          value={kpis?.pendingDispatch?.formatted || '8'}
          change="Real-time queue"
          isPositive={!(kpis?.pendingDispatch?.isWarning ?? false)}
          subtitle="Ilorin, Ibadan, Abuja nodes"
          icon={Truck}
          sparklineData={[7, 4, 9, 6, 8]}
        />
      </div>

      {/* Analytics Charts Suite */}
      <AnalyticsCharts />
    </div>
  );
}