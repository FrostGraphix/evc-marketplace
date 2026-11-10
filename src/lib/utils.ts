import { CartItem, ColorKey, CustomerVIPTier, OrderRecord } from '@/types';
import { byId, CFG, PAL } from './products';

export function money(n: number): string {
  return '₦' + Math.round(n).toLocaleString('en-NG');
}

export function calculateVIPTier(lifetimeValue: number): CustomerVIPTier {
  if (lifetimeValue >= 1000000) {
    return 'Corporate Elite';
  } else if (lifetimeValue >= 500000) {
    return 'VIP Platinum';
  } else if (lifetimeValue >= 200000) {
    return 'Gold Partner';
  } else if (lifetimeValue >= 80000) {
    return 'Silver Member';
  } else {
    return 'Regular';
  }
}

export function lineKey(item: { id: number; color: ColorKey; size?: string }): string {
  return `${item.id}|${item.color}|${item.size || ''}`;
}

export function waLink(text: string): string {
  return `https://wa.me/${CFG.phone}?text=${encodeURIComponent(text)}`;
}

export function generateOrderText(
  order: OrderRecord | null,
  cartItems?: CartItem[],
  subtotalAmount?: number
): string {
  if (order) {
    return (
      `Hello EVC Nigeria, I just placed order ${order.id}.\n` +
      `${order.lines.join('\n')}\n` +
      `Total: ${money(order.total)}\n` +
      `Name: ${order.name}\n` +
      `Phone: ${order.phone}\n` +
      `Delivery: ${order.deliveryLabel}, ${order.address}, ${order.state}\n` +
      `Payment: ${order.payLabel}`
    );
  }

  if (cartItems && cartItems.length) {
    const lines = cartItems.map((l) => {
      const p = byId(l.id);
      if (!p) return '';
      const colName = PAL[l.color]?.n || l.color;
      return `- ${l.qty} x ${p.name} (${colName}${l.size ? ', ' + l.size : ''}) ${money(p.price * l.qty)}`;
    }).filter(Boolean);

    return (
      `Hello EVC Nigeria, I would like to order:\n` +
      `${lines.join('\n')}\n` +
      `Subtotal: ${money(subtotalAmount || 0)}`
    );
  }

  return `Hello EVC Nigeria, I would like to place an inquiry / order.`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
