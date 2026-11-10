import { NextResponse } from 'next/server';
import { CustomerProfile, CustomerVIPTier } from '@/types';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateVIPTier } from '@/lib/utils';
import { verifyStaffAuth } from '@/lib/adminAuthServer';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!(await verifyStaffAuth(request))) {
    return NextResponse.json(
      { error: 'Unauthorized: Staff access required' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || searchParams.get('q');
    const tier = searchParams.get('tier');
    const state = searchParams.get('state');
    const idParam = searchParams.get('id');

    let customerList: CustomerProfile[] = [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient(true);

        const [profilesRes, ordersRes] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
        ]);

        const profiles = profilesRes.data || [];
        const orders = ordersRes.data || [];

        if (profiles.length > 0 || orders.length > 0) {
          const customerMap = new Map<
            string,
            {
              id: string;
              name: string;
              phone: string;
              email: string;
              state: string;
              address: string;
              landmark: string;
              orders: any[];
            }
          >();

          profiles.forEach((p) => {
            const key = (p.email || p.id).toLowerCase().trim();
            customerMap.set(key, {
              id: p.id,
              name: p.full_name || p.email.split('@')[0],
              phone: p.phone || '',
              email: p.email,
              state: p.state || 'Kwara',
              address: p.address || '',
              landmark: '',
              orders: [],
            });
          });

          orders.forEach((ord) => {
            const emailKey = (ord.email || '').toLowerCase().trim();
            const cleanPhone = (ord.phone || '').replace(/[^0-9]/g, '');

            let cust = customerMap.get(emailKey);

            if (!cust && ord.user_id) {
              for (const c of Array.from(customerMap.values())) {
                if (c.id === ord.user_id) {
                  cust = c;
                  break;
                }
              }
            }

            if (!cust && cleanPhone) {
              for (const c of Array.from(customerMap.values())) {
                if (c.phone && c.phone.replace(/[^0-9]/g, '') === cleanPhone) {
                  cust = c;
                  break;
                }
              }
            }

            if (!cust) {
              const custId = ord.user_id || `cust-${ord.id || Math.random().toString(36).slice(2, 8)}`;
              cust = {
                id: custId,
                name: ord.name || 'EVC Client',
                phone: ord.phone || '',
                email: ord.email || '',
                state: ord.state || 'Kwara',
                address: ord.address || '',
                landmark: ord.landmark || '',
                orders: [],
              };
              customerMap.set(emailKey || cleanPhone || custId, cust);
            } else {
              if (!cust.address && ord.address) cust.address = ord.address;
              if (!cust.landmark && ord.landmark) cust.landmark = ord.landmark;
              if (!cust.state && ord.state) cust.state = ord.state;
              if (!cust.phone && ord.phone) cust.phone = ord.phone;
            }

            cust.orders.push(ord);
          });

          customerList = Array.from(customerMap.values()).map((c) => {
            const totalOrders = c.orders.length;
            const lifetimeValue = c.orders.reduce(
              (sum, o) => sum + Number(o.total ?? o.subtotal ?? 0),
              0
            );

            const dates = c.orders
              .map((o) => o.created_at)
              .filter(Boolean)
              .sort();
            const lastOrderDate =
              dates.length > 0
                ? new Date(dates[dates.length - 1]).toISOString().slice(0, 10)
                : null;

            return {
              id: c.id,
              name: c.name,
              phone: c.phone,
              email: c.email,
              state: c.state,
              address: c.address,
              landmark: c.landmark,
              totalOrders,
              lifetimeValue,
              lastOrderDate,
              tier: calculateVIPTier(lifetimeValue),
            };
          });

          customerList.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
        }
      } catch (err) {
        console.warn('Supabase customers query error:', err);
      }
    }

    if (idParam) {
      const single = customerList.find((c) => c.id === idParam);
      if (!single) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
      return NextResponse.json({ customer: single });
    }

    let results = [...customerList];

    if (tier && tier !== 'all') {
      const tierLower = tier.toLowerCase();
      results = results.filter((c) => {
        const cTier = c.tier.toLowerCase();
        if (cTier === tierLower) return true;
        if (tierLower === 'platinum' && cTier.includes('platinum')) return true;
        if (tierLower === 'gold' && cTier.includes('gold')) return true;
        if (tierLower === 'silver' && cTier.includes('silver')) return true;
        if (tierLower === 'regular' && cTier === 'regular') return true;
        return false;
      });
    }

    if (state && state !== 'all') {
      const stateLower = state.toLowerCase();
      results = results.filter((c) => c.state.toLowerCase().includes(stateLower));
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q)
      );
    }

    const totalShoppers = results.length;
    const totalLTV = results.reduce((sum, c) => sum + c.lifetimeValue, 0);
    const avgLTV = Math.round(totalLTV / (totalShoppers || 1));
    const platinumCount = results.filter((c) => c.tier === 'VIP Platinum' || c.tier === 'Corporate Elite').length;
    const goldCount = results.filter((c) => c.tier === 'Gold Partner').length;
    const silverCount = results.filter((c) => c.tier === 'Silver Member').length;
    const regularCount = results.filter((c) => c.tier === 'Regular').length;

    return NextResponse.json({
      customers: results,
      total: results.length,
      stats: {
        totalShoppers,
        totalLTV,
        avgLTV,
        platinumCount,
        goldCount,
        silverCount,
        bronzeCount: 0,
        regularCount,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/customers:', error);
    return NextResponse.json({ error: 'Failed to retrieve customers' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await verifyStaffAuth(request))) {
    return NextResponse.json(
      { error: 'Unauthorized: Staff access required' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (body.full_name !== undefined) updates.full_name = String(body.full_name).trim();
    if (body.name !== undefined && body.full_name === undefined) updates.full_name = String(body.name).trim();
    if (body.phone !== undefined) updates.phone = String(body.phone).trim();
    if (body.address !== undefined) updates.address = String(body.address).trim();
    if (body.state !== undefined) updates.state = String(body.state).trim();

    if (isSupabaseConfigured()) {
      const supabase = createAdminClient(true);
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Supabase customer profile update error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      try {
        await supabase.auth.admin.updateUserById(id, {
          user_metadata: {
            full_name: updates.full_name,
            phone: updates.phone,
            address: updates.address,
            state: updates.state,
          },
        });
      } catch (metaErr) {
        console.warn('Metadata sync warning on customer update:', metaErr);
      }

      return NextResponse.json({
        success: true,
        message: 'Customer updated successfully',
        customer: updatedProfile,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Customer updated',
      customer: { id, ...updates },
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/admin/customers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyStaffAuth(request))) {
    return NextResponse.json(
      { error: 'Unauthorized: Staff access required' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required for deletion' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = createAdminClient(true);
      const { error: profileErr } = await supabase.from('profiles').delete().eq('id', id);
      if (profileErr) {
        console.warn('Supabase customer delete profile warning:', profileErr.message);
      }

      try {
        await supabase.auth.admin.deleteUser(id);
      } catch (authErr) {
        console.warn('Supabase customer delete auth warning:', authErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully',
      deletedId: id,
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/customers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
