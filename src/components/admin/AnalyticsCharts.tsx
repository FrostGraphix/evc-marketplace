'use client';

import React, { useState, useId } from 'react';
import {
  TrendingUp,
  MapPin,
  Truck,
  Sparkles,
  Users,
  Eye,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  PieChart as PieIcon,
  Activity,
  Zap,
} from 'lucide-react';
import { money } from '@/lib/utils';

export interface DailyRevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryShare {
  name: string;
  share: number;
  revenue: number;
  count: number;
  color: string;
}

export interface StateShare {
  state: string;
  share: number;
  orders: number;
  deliveryMode: string;
}

export const DEFAULT_30_DAY_REVENUE: DailyRevenuePoint[] = [
  { date: 'Oct 01', revenue: 950000, orders: 4 },
  { date: 'Oct 03', revenue: 1200000, orders: 5 },
  { date: 'Oct 05', revenue: 1450000, orders: 6 },
  { date: 'Oct 07', revenue: 1100000, orders: 4 },
  { date: 'Oct 09', revenue: 1850000, orders: 7 },
  { date: 'Oct 11', revenue: 2100000, orders: 8 },
  { date: 'Oct 13', revenue: 1750000, orders: 6 },
  { date: 'Oct 15', revenue: 2400000, orders: 9 },
  { date: 'Oct 17', revenue: 2850000, orders: 11 },
  { date: 'Oct 19', revenue: 2200000, orders: 8 },
  { date: 'Oct 21', revenue: 3100000, orders: 12 },
  { date: 'Oct 23', revenue: 2950000, orders: 10 },
  { date: 'Oct 25', revenue: 3600000, orders: 14 },
  { date: 'Oct 27', revenue: 4100000, orders: 15 },
  { date: 'Oct 29', revenue: 4500000, orders: 16 },
  { date: 'Oct 31', revenue: 4850000, orders: 18 },
];

export const DEFAULT_CATEGORY_BREAKDOWN: CategoryShare[] = [
  { name: 'Solar & Clean Energy', share: 44, revenue: 18450000, count: 58, color: '#f26522' },
  { name: 'Smart Tech & Automation', share: 26, revenue: 10890000, count: 86, color: '#ff7a33' },
  { name: 'Architectural Finishes', share: 16, revenue: 6710000, count: 42, color: '#f59e0b' },
  { name: 'Executive & Workspace', share: 8, revenue: 3350000, count: 22, color: '#0284c7' },
  { name: 'Smart Living & Appliances', share: 6, revenue: 2510000, count: 34, color: '#10b981' },
];

export const DEFAULT_STATE_DISTRIBUTION: StateShare[] = [
  { state: 'Kwara (Ilorin Hub)', share: 36, orders: 88, deliveryMode: 'Same-Day Local Dispatch' },
  { state: 'Oyo (Ibadan Hub)', share: 28, orders: 68, deliveryMode: 'EVC Regional Fleet (24h)' },
  { state: 'Abuja (FCT Hub)', share: 22, orders: 54, deliveryMode: 'Direct Doorstep (24h)' },
  { state: 'Lagos', share: 10, orders: 24, deliveryMode: 'Interstate Freight (48h)' },
  { state: 'Nationwide (Other)', share: 4, orders: 10, deliveryMode: 'Tracked Line-Haul' },
];

export const AnalyticsCharts: React.FC = () => {
  const gradientId = useId();
  const [selectedPoint, setSelectedPoint] = useState<DailyRevenuePoint | null>(null);

  // SVG dimensions for Revenue trend chart
  const width = 640;
  const height = 200;
  const paddingX = 24;
  const paddingY = 24;

  const maxRev = Math.max(...DEFAULT_30_DAY_REVENUE.map((d) => d.revenue));
  const minRev = 0;
  const revRange = maxRev - minRev || 1;

  const points = DEFAULT_30_DAY_REVENUE.map((pt, idx) => {
    const x = paddingX + (idx / (DEFAULT_30_DAY_REVENUE.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((pt.revenue - minRev) / revRange) * (height - 2 * paddingY);
    return { ...pt, x, y };
  });

  let linePath = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) * 0.18;
    const cp1y = p1.y + (p2.y - p0.y) * 0.18;
    const cp2x = p2.x - (p3.x - p1.x) * 0.18;
    const cp2y = p2.y - (p3.y - p1.y) * 0.18;

    linePath += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)},${height - paddingY} L ${points[0].x.toFixed(1)},${height - paddingY} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 30-Day Revenue Trend Chart (Clean outline) */}
      <div className="lg:col-span-8 p-6 rounded-3xl bg-[var(--surface)] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Performance Telemetry
            </span>
            <h3 className="font-display font-bold text-xl text-[var(--ink)] mt-0.5">
              Equipment Revenue Curve
            </h3>
          </div>
          <span className="text-xs text-[var(--mute)]">
            Total 30-Day Gross: <strong className="text-[var(--ink)]">{money(41910000)}</strong>
          </span>
        </div>

        {/* SVG Interactive Chart */}
        <div className="relative w-full aspect-[21/9] min-h-[190px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`revGrad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f26522" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f26522" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--line)" strokeWidth="1" />
            <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="var(--line)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Area & Stroke */}
            <path d={areaPath} fill={`url(#revGrad-${gradientId})`} />
            <path d={linePath} fill="none" stroke="#f26522" strokeWidth="2.5" strokeLinecap="round" />

            {/* Points */}
            {points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#f26522"
                stroke="var(--surface)"
                strokeWidth="1.5"
                className="cursor-pointer transition-transform hover:scale-150"
                onMouseEnter={() => setSelectedPoint(pt)}
              />
            ))}
          </svg>
        </div>

        {selectedPoint && (
          <div className="mt-3 p-3 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex items-center justify-between text-xs animate-in fade-in">
            <span className="font-semibold text-[var(--ink)]">{selectedPoint.date}:</span>
            <span className="font-mono font-bold text-brand">{money(selectedPoint.revenue)}</span>
            <span className="text-[var(--mute)]">({selectedPoint.orders} equipment consignments)</span>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-lg flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand flex items-center gap-1.5 mb-1">
            <PieIcon className="w-3.5 h-3.5" /> Product Mix
          </span>
          <h3 className="font-display font-bold text-lg text-[var(--ink)] mb-4">
            Revenue by Category
          </h3>

          <div className="space-y-3">
            {DEFAULT_CATEGORY_BREAKDOWN.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--ink)]">{cat.name}</span>
                  <span className="font-mono font-bold text-[var(--ink)]">{cat.share}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--surface2)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${cat.share}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--line)] mt-4 text-[11px] text-[var(--mute)]">
          Solar &amp; Smart Tech account for 70% of current marketplace volume.
        </div>
      </div>

      {/* State & Hub Distribution */}
      <div className="lg:col-span-12 p-6 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Regional Logistics
            </span>
            <h3 className="font-display font-bold text-lg text-[var(--ink)] mt-0.5">
              Consignment Distribution by Hub
            </h3>
          </div>
          <span className="text-xs text-[var(--mute)]">
            Hubs: Ilorin • Ibadan • Abuja
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DEFAULT_STATE_DISTRIBUTION.map((st) => (
            <div
              key={st.state}
              className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-1.5"
            >
              <span className="block font-bold text-xs text-[var(--ink)]">{st.state}</span>
              <div className="flex items-baseline justify-between">
                <span className="font-display font-extrabold text-xl text-brand">{st.share}%</span>
                <span className="text-[11px] text-[var(--mute)]">{st.orders} orders</span>
              </div>
              <span className="block text-[10px] text-[var(--mute)] truncate">{st.deliveryMode}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
