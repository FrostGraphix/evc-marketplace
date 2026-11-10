import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/admin';
import { PRODUCTS, CATS } from '@/lib/products';
import { verifyStaffAuth } from '@/lib/adminAuthServer';

export const dynamic = 'force-dynamic';

function calcPctChange(current: number, previous: number): { change: string; isPositive: boolean } {
  if (previous === 0) {
    if (current === 0) return { change: '0.0%', isPositive: true };
    return { change: '+100.0%', isPositive: true };
  }
  const pct = ((current - previous) / previous) * 100;
  const isPositive = pct >= 0;
  const prefix = pct > 0 ? '+' : '';
  return {
    change: `${prefix}${pct.toFixed(1)}%`,
    isPositive,
  };
}

export async function GET(request: Request) {
  try {
    // 0. Staff Authentication Check
    if (!(await verifyStaffAuth(request))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Staff access required' },
        { status: 401 }
      );
    }

    let grossRevenue = 0;
    let netRevenue = 0;
    let totalOrders = 0;
    let aov = 0;
    let pendingDispatches = 0;
    let todayOrdersCount = 0;
    let fulfillmentRate = 0;

    let revenueGrowth: { date: string; revenue: number; orders: number }[] = [];
    let categoryBreakdown: { name: string; share: number; revenue: number; count: number; color: string }[] = [];
    let stateDistribution: { state: string; share: number; orders: number; deliveryMode: string }[] = [];
    let conversionFunnel: { stage: string; count: number; conversionRate: string; dropOff: string; note: string }[] = [];

    let isLiveFromSupabase = false;

    let revenueChange = { change: '0.0%', isPositive: true };
    let ordersChange = { change: '0.0%', isPositive: true };
    let aovChange = { change: '0.0%', isPositive: true };
    let fulfillmentChange = { change: '0.0%', isPositive: true };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();

        const [ordersRes, itemsRes] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('order_items').select('*'),
        ]);

        const dbOrders = ordersRes.data || [];
        const dbItems = itemsRes.data || [];

        if (dbOrders.length > 0) {
          isLiveFromSupabase = true;
          totalOrders = dbOrders.length;
          grossRevenue = dbOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

          const totalFees = dbOrders.reduce((sum, o) => sum + (Number(o.fee) || 0), 0);
          netRevenue = Math.max(0, grossRevenue - totalFees);

          aov = totalOrders > 0 ? Math.round(grossRevenue / totalOrders) : 0;

          pendingDispatches = dbOrders.filter(
            (o) => o.order_status === 'received' || o.order_status === 'confirmed'
          ).length;

          const confirmedOrDelivered = dbOrders.filter((o) =>
            ['delivered', 'shipped', 'confirmed'].includes((o.order_status || '').toLowerCase())
          ).length;
          fulfillmentRate = Number(((confirmedOrDelivered / totalOrders) * 100).toFixed(1));

          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);
          todayOrdersCount = dbOrders.filter((o) => new Date(o.created_at) >= startOfToday).length;

          const now = new Date();
          const MS_DAY = 86400000;
          const thirtyDaysAgo = new Date(now.getTime() - 30 * MS_DAY);
          const sixtyDaysAgo = new Date(now.getTime() - 60 * MS_DAY);

          const current30Orders = dbOrders.filter((o) => {
            const d = new Date(o.created_at);
            return d >= thirtyDaysAgo && d <= now;
          });

          const previous30Orders = dbOrders.filter((o) => {
            const d = new Date(o.created_at);
            return d >= sixtyDaysAgo && d < thirtyDaysAgo;
          });

          const currentGross = current30Orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
          const prevGross = previous30Orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
          revenueChange = calcPctChange(currentGross, prevGross);

          const currentOrdersCount = current30Orders.length;
          const prevOrdersCount = previous30Orders.length;
          ordersChange = calcPctChange(currentOrdersCount, prevOrdersCount);

          const currentAov = currentOrdersCount > 0 ? Math.round(currentGross / currentOrdersCount) : 0;
          const prevAov = prevOrdersCount > 0 ? Math.round(prevGross / prevOrdersCount) : 0;
          aovChange = calcPctChange(currentAov, prevAov);

          const currentFulfilled = current30Orders.filter((o) =>
            ['confirmed', 'shipped', 'delivered'].includes((o.order_status || '').toLowerCase())
          ).length;
          const prevFulfilled = previous30Orders.filter((o) =>
            ['confirmed', 'shipped', 'delivered'].includes((o.order_status || '').toLowerCase())
          ).length;

          const currentFulfillRate = currentOrdersCount > 0 ? (currentFulfilled / currentOrdersCount) * 100 : 0;
          const prevFulfillRate = prevOrdersCount > 0 ? (prevFulfilled / prevOrdersCount) * 100 : 0;
          const fulfillDiff = currentFulfillRate - prevFulfillRate;
          fulfillmentChange = prevOrdersCount === 0
            ? { change: '0.0%', isPositive: true }
            : { change: `${fulfillDiff >= 0 ? '+' : ''}${fulfillDiff.toFixed(1)}%`, isPositive: fulfillDiff >= 0 };

          // Real State Distribution (Ilorin/Kwara, Ibadan/Oyo, Abuja/FCT, Lagos, Nationwide)
          const stateCounts: Record<string, number> = {};
          dbOrders.forEach((o) => {
            const st = o.state || 'Kwara';
            stateCounts[st] = (stateCounts[st] || 0) + 1;
          });

          const sortedStates = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]);
          const topStates = sortedStates.slice(0, 4);
          const otherStatesCount = sortedStates.slice(4).reduce((sum, s) => sum + s[1], 0);

          stateDistribution = topStates.map(([stateName, count]) => {
            const share = Math.round((count / totalOrders) * 100);
            const deliveryMode =
              stateName.includes('Kwara') || stateName.includes('Ilorin')
                ? 'Ilorin Local Hub (24h)'
                : stateName.includes('Oyo') || stateName.includes('Ibadan')
                ? 'Ibadan Direct Courier (24-48h)'
                : stateName.includes('Abuja') || stateName.includes('FCT')
                ? 'Abuja Doorstep Courier'
                : 'Nationwide Logistics';
            return {
              state: stateName,
              share,
              orders: count,
              deliveryMode,
            };
          });

          if (otherStatesCount > 0) {
            stateDistribution.push({
              state: 'Other States',
              share: Math.max(1, Math.round((otherStatesCount / totalOrders) * 100)),
              orders: otherStatesCount,
              deliveryMode: 'Nationwide Tracked Dispatch',
            });
          }

          // Category Breakdown
          const catRevenueMap: Record<string, { revenue: number; count: number }> = {};
          const catColors: Record<string, string> = {
            solar: '#f26522',
            'smart-tech': '#0a1219',
            finishes: '#e3b94b',
            furniture: '#475569',
            living: '#10b981',
          };

          dbItems.forEach((it) => {
            let catId = 'solar';
            if (it.product_id) {
              const matchedProd = PRODUCTS.find((p) => p.id === it.product_id);
              if (matchedProd?.cat) catId = matchedProd.cat;
            } else {
              const nameLower = (it.name || '').toLowerCase();
              if (nameLower.includes('solar') || nameLower.includes('inverter') || nameLower.includes('battery')) catId = 'solar';
              else if (nameLower.includes('lock') || nameLower.includes('switch') || nameLower.includes('camera')) catId = 'smart-tech';
              else if (nameLower.includes('finish') || nameLower.includes('panel') || nameLower.includes('chandelier')) catId = 'finishes';
              else if (nameLower.includes('chair') || nameLower.includes('desk') || nameLower.includes('table')) catId = 'furniture';
            }

            if (!catRevenueMap[catId]) {
              catRevenueMap[catId] = { revenue: 0, count: 0 };
            }
            catRevenueMap[catId].revenue += Number(it.price || 0) * Number(it.qty || 1);
            catRevenueMap[catId].count += Number(it.qty || 1);
          });

          const totalItemRev = Object.values(catRevenueMap).reduce((s, c) => s + c.revenue, 0) || grossRevenue;

          categoryBreakdown = Object.entries(catRevenueMap).map(([cid, data]) => {
            const catObj = CATS.find((c) => c.id === cid);
            const name = catObj?.name || cid.charAt(0).toUpperCase() + cid.slice(1);
            const share = Math.max(1, Math.round((data.revenue / totalItemRev) * 100));
            return {
              name,
              share,
              revenue: data.revenue,
              count: data.count,
              color: catColors[cid] || '#f26522',
            };
          }).sort((a, b) => b.revenue - a.revenue);

          // Daily Revenue Trajectory
          const dateMap: Record<string, { revenue: number; orders: number; timestamp: number }> = {};
          dbOrders.forEach((o) => {
            const d = new Date(o.created_at);
            const dateStr = d.toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
            });
            if (!dateMap[dateStr]) {
              dateMap[dateStr] = {
                revenue: 0,
                orders: 0,
                timestamp: new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(),
              };
            }
            dateMap[dateStr].revenue += Number(o.total || 0);
            dateMap[dateStr].orders += 1;
          });

          revenueGrowth = Object.entries(dateMap)
            .map(([date, val]) => ({
              date,
              revenue: val.revenue,
              orders: val.orders,
              timestamp: val.timestamp,
            }))
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(({ date, revenue, orders }) => ({ date, revenue, orders }))
            .slice(-30);

          // Conversion Funnel
          const confirmedAndPaidCount = dbOrders.filter((o) =>
            ['confirmed', 'shipped', 'delivered'].includes((o.order_status || '').toLowerCase())
          ).length;

          const inTransitDispatchedCount = dbOrders.filter((o) =>
            ['shipped', 'delivered'].includes((o.order_status || '').toLowerCase())
          ).length;

          const deliveredCount = dbOrders.filter((o) =>
            (o.order_status || '').toLowerCase() === 'delivered'
          ).length;

          const computeStageMetrics = (stageName: string, count: number, note: string) => {
            if (totalOrders === 0) {
              return {
                stage: stageName,
                count: 0,
                conversionRate: '0.0%',
                dropOff: '0.0%',
                note,
              };
            }
            const rate = (count / totalOrders) * 100;
            const drop = 100 - rate;
            return {
              stage: stageName,
              count,
              conversionRate: `${rate.toFixed(1)}%`,
              dropOff: drop > 0 ? `-${drop.toFixed(1)}%` : '0.0%',
              note,
            };
          };

          conversionFunnel = [
            {
              stage: 'Orders Placed',
              count: totalOrders,
              conversionRate: '100%',
              dropOff: '0%',
              note: 'Total customer orders logged in EVC marketplace',
            },
            computeStageMetrics(
              'Confirmed & Paid',
              confirmedAndPaidCount,
              'Payment verified & order accepted'
            ),
            computeStageMetrics(
              'In Transit / Dispatched',
              inTransitDispatchedCount,
              'Handed over to regional courier'
            ),
            computeStageMetrics(
              'Delivered',
              deliveredCount,
              'Successfully completed deliveries'
            ),
          ];
        }
      } catch (err) {
        console.warn('Could not query Supabase analytics:', err);
      }
    }

    if (conversionFunnel.length === 0) {
      conversionFunnel = [
        { stage: 'Orders Placed', count: 0, conversionRate: '100%', dropOff: '0%', note: 'Total customer orders logged in EVC marketplace' },
        { stage: 'Confirmed & Paid', count: 0, conversionRate: '0.0%', dropOff: '0.0%', note: 'Payment verified & order accepted' },
        { stage: 'In Transit / Dispatched', count: 0, conversionRate: '0.0%', dropOff: '0.0%', note: 'Handed over to regional courier' },
        { stage: 'Delivered', count: 0, conversionRate: '0.0%', dropOff: '0.0%', note: 'Successfully completed deliveries' },
      ];
    }

    return NextResponse.json({
      success: true,
      isLiveFromSupabase,
      timestamp: new Date().toISOString(),
      kpis: {
        grossRevenue: {
          value: grossRevenue,
          formatted: '₦' + Math.round(grossRevenue).toLocaleString('en-NG'),
          change: revenueChange.change,
          isPositive: revenueChange.isPositive,
          subtitle: 'from live database orders',
        },
        totalOrders: {
          value: totalOrders,
          formatted: totalOrders.toString(),
          change: ordersChange.change,
          isPositive: ordersChange.isPositive,
          subtitle: `${pendingDispatches} pending dispatch`,
        },
        averageOrderValue: {
          value: aov,
          formatted: '₦' + Math.round(aov).toLocaleString('en-NG'),
          change: aovChange.change,
          isPositive: aovChange.isPositive,
          subtitle: 'average order value',
        },
        fulfillmentRate: {
          value: `${fulfillmentRate}%`,
          formatted: `${fulfillmentRate}%`,
          change: fulfillmentChange.change,
          isPositive: fulfillmentChange.isPositive,
          subtitle: 'Ilorin, Ibadan, Abuja & nationwide',
        },
        netRevenue,
        todayOrders: todayOrdersCount,
        pendingDispatches,
      },
      revenueGrowth,
      categoryBreakdown,
      stateDistribution,
      conversionFunnel,
    });
  } catch (error: any) {
    console.error('Analytics API Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
