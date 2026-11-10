export type ColorKey =
  | 'orange'
  | 'navy'
  | 'glow'
  | 'black'
  | 'ivory'
  | 'gold'
  | 'blue'
  | 'slate'
  | 'brand'
  | 'white'
  | 'silver'
  | 'amber'
  | 'charcoal'
  | 'violet'
  | 'orchid'
  | 'lilac'
  | 'plum';

export interface ColorDef {
  n: string;
  main: string;
  dark: string;
  light: string;
  deep: string;
}

export type ArtType =
  // EVC Core Categories
  | 'doorbell'
  | 'smartlock'
  | 'curtain'
  | 'securityhub'
  | 'inverter'
  | 'powerwall'
  | 'solarpanel'
  | 'evcharger'
  | 'tiles'
  | 'sanitaryware'
  | 'pendant'
  | 'faucet'
  | 'desk'
  | 'loungechair'
  | 'privacypod'
  | 'starlinkmount'
  | 'submeter'
  | 'climatesensor'
  | 'journal'
  | 'smartring'
  | 'polo'
  | 'folio'
  // Smart Tech & Automation aliases
  | 'smart-switch'
  | 'smart-lock'
  | 'cctv'
  | 'earbuds'
  | 'watch'
  | 'ledpanel'
  | 'tablet'
  | 'powerbank'
  // Solar Energy & Power aliases
  | 'solar-inverter'
  | 'solar-panel'
  | 'battery'
  | 'solar-street-light'
  // Architectural Finishes aliases
  | 'acoustic-panel'
  | 'wall-panel'
  | 'marble-slab'
  | 'chandelier'
  | 'downlight'
  // Furniture & Workspaces aliases
  | 'ergonomic-chair'
  | 'executive-desk'
  | 'sofa'
  | 'smart-console'
  // Living & Lifestyle aliases
  | 'air-purifier'
  | 'smart-diffuser'
  | 'automated-curtains'
  | 'smart-kettle'
  // Compatibility
  | 'dress'
  | 'abaya'
  | 'hoodie'
  | 'sneaker'
  | 'heel'
  | 'tote'
  | 'crossbody'
  | 'necklace'
  | 'earrings'
  | 'ring'
  | 'pot'
  | 'spoons'
  | 'bottles'
  | 'basket'
  | 'cushion'
  | 'candles'
  | 'perfume'
  | 'gummies'
  | 'nailkit';

export interface Category {
  id: string;
  name: string;
  blurb: string;
  art: ArtType[];
  cols: ColorKey[];
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  cat: string;
  price: number;
  was?: number | null;
  art: ArtType;
  colors: ColorKey[];
  sizes?: string[];
  badge?: string | null;
  desc: string;
  feat: string[];
  images: string[];
  cogs?: number;
  stock?: number;
  lowStockThreshold?: number;
  status?: 'active' | 'draft' | 'archived';
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: number;
  color: ColorKey;
  size?: string;
  qty: number;
}

export type DeliveryType = 'abuja' | 'ilorin' | 'ibadan' | 'nationwide' | 'pickup';
export type PaymentMethod = 'transfer' | 'link' | 'pod';

export interface DeliveryOption {
  label: string;
  eta: string;
  fee: number;
}

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  landmark?: string;
  note?: string;
}

export interface OrderItemRecord {
  productId?: number | string;
  name: string;
  price: number;
  qty: number;
  art: ArtType;
  color: ColorKey;
  opt: string;
  image?: string;
}

export type OrderStatus =
  | 'received'
  | 'confirmed'
  | 'shipped'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export interface OrderRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  landmark?: string;
  deliveryLabel: string;
  eta: string;
  payLabel: string;
  paymentMethod: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  orderStatus?: OrderStatus;
  fee: number;
  subtotal: number;
  discount: number;
  total: number;
  items: OrderItemRecord[];
  lines: string[];
  wa: string;
  createdAt?: string;
  note?: string;
  userId?: string;
  carrier?: string;
  trackingNumber?: string;
  riderName?: string;
  riderPhone?: string;
  dispatchNote?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
}

export type CustomerVIPTier =
  | 'Corporate Elite'
  | 'VIP Platinum'
  | 'Gold Partner'
  | 'Gold Member'
  | 'Silver Member'
  | 'Bronze Member'
  | 'Regular';

export interface UserProfileStats {
  totalOrders: number;
  lifetimeValue: number;
  tier: CustomerVIPTier;
  lastOrderDate?: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
  revenueDriven: number;
  isActive: boolean;
  createdAt?: string;
  description?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  state: string;
  address?: string;
  landmark?: string;
  totalOrders: number;
  lifetimeValue: number;
  lastOrderDate: string | null;
  tier: CustomerVIPTier;
  orders?: OrderRecord[];
}

export type NotificationType =
  | 'order_new'
  | 'order_confirmed'
  | 'order_dispatched'
  | 'order_delivered'
  | 'payment_alert'
  | 'vip_customer'
  | 'stock_warning'
  | 'inquiry';

export interface StoreNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  orderId?: string;
  customerName?: string;
  amount?: number;
  read: boolean;
  priority: 'low' | 'normal' | 'high';
}

export interface TrackingMilestone {
  step: 'received' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface OrderTrackingInfo {
  orderId: string;
  orderStatus: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  payLabel: string;
  createdAt: string;
  updatedAt?: string;
  eta: string;
  deliveryLabel: string;
  carrier?: string;
  trackingNumber?: string;
  riderName?: string;
  riderPhone?: string;
  dispatchNote?: string;
  destination: {
    name: string;
    city: string;
    state: string;
    addressMasked: string;
  };
  items: OrderItemRecord[];
  subtotal: number;
  fee: number;
  discount: number;
  total: number;
  milestones: TrackingMilestone[];
  progressPercent: number;
  waSupportUrl: string;
}
