import { money } from '@/lib/utils';

export interface StateDeliveryInfo {
  state: string;
  zone: string;
  baseFee: number;
  sla: string;
  courierMode: string;
  isDoorstep: boolean;
  isPodAvailable: boolean;
  description: string;
}

export const NIGERIAN_STATES = [
  'Abuja (FCT)',
  'Kwara',
  'Oyo',
  'Lagos',
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
] as const;

export type NigerianState = (typeof NIGERIAN_STATES)[number];

const STATE_RATES_MAP: Record<string, Omit<StateDeliveryInfo, 'state'>> = {
  Kwara: {
    zone: 'EVC Central Hub (Ilorin)',
    baseFee: 2000,
    sla: 'Same-Day / 24 Hours',
    courierMode: 'EVC Direct Hub Fleet',
    isDoorstep: true,
    isPodAvailable: true,
    description: 'Corporate hub delivery across Fate, GRA, Bodunde, Tanke, University Road & environs.',
  },
  Oyo: {
    zone: 'EVC South West Hub (Ibadan)',
    baseFee: 2500,
    sla: 'Same-Day / 24 Hours',
    courierMode: 'EVC Regional Dispatch',
    isDoorstep: true,
    isPodAvailable: true,
    description: 'Bodija, Oluyoro, Ring Road, Akobo, UI Axis & Ibadan metropolitan.',
  },
  'Abuja (FCT)': {
    zone: 'EVC Northern Hub (FCT Abuja)',
    baseFee: 2500,
    sla: 'Same-Day / 24 Hours',
    courierMode: 'Doorstep Bike / Van Courier',
    isDoorstep: true,
    isPodAvailable: true,
    description: 'Direct courier to Maitama, Wuse 2, Garki, Gwarinpa, Asokoro, Jabi, Apo, Kubwa & environs.',
  },
  Lagos: {
    zone: 'Commercial Hub (South West)',
    baseFee: 4500,
    sla: '24 to 48 Hours',
    courierMode: 'Priority Interstate Freight / Express Dispatch',
    isDoorstep: true,
    isPodAvailable: false,
    description: 'Island (Ikoyi, Lekki, VI) & Mainland express courier dispatch.',
  },
  Rivers: {
    zone: 'South-South Hub',
    baseFee: 5000,
    sla: '48 to 72 Hours',
    courierMode: 'Express Regional Courier',
    isDoorstep: true,
    isPodAvailable: false,
    description: 'Port Harcourt GRA, Peter Odili, Trans-Amadi, and interstate pickup stations.',
  },
  Kano: {
    zone: 'Northern Commercial Hub',
    baseFee: 4500,
    sla: '48 to 72 Hours',
    courierMode: 'Direct Interstate Courier',
    isDoorstep: true,
    isPodAvailable: false,
    description: 'Nassarawa GRA, Bompai, Sabon Gari, and city center drop-off.',
  },
  Kaduna: {
    zone: 'North Central',
    baseFee: 4500,
    sla: '24 to 48 Hours',
    courierMode: 'Direct Highway Interstate Courier',
    isDoorstep: true,
    isPodAvailable: false,
    description: 'Barnawa, Malali, Ungwan Rimi, and central Kaduna delivery.',
  },
  Ogun: {
    zone: 'South West',
    baseFee: 4500,
    sla: '24 to 48 Hours',
    courierMode: 'Regional Express Courier',
    isDoorstep: true,
    isPodAvailable: false,
    description: 'Abeokuta, Sagamu, Ota, and environs.',
  },
  Osun: {
    zone: 'South West (Kwara Border)',
    baseFee: 3500,
    sla: '24 Hours',
    courierMode: 'Direct Regional Fleet',
    isDoorstep: true,
    isPodAvailable: true,
    description: 'Osogbo, Ile-Ife, Ede, and environs.',
  },
  Delta: {
    zone: 'South-South',
    baseFee: 5000,
    sla: '2 to 3 Days',
    courierMode: 'Interstate Courier',
    isDoorstep: true,
    isPodAvailable: false,
    description: 'Asaba, Warri, Effurun doorstep & courier stations.',
  },
  Edo: {
    zone: 'South-South',
    baseFee: 4500,
    sla: '48 to 72 Hours',
    courierMode: 'Interstate Courier',
    isDoorstep: true,
    isPodAvailable: false,
    description: 'Benin City GRA, Ugbowo, and environs.',
  },
  Enugu: {
    zone: 'South East',
    baseFee: 5000,
    sla: '2 to 3 Days',
    courierMode: 'Interstate Regional Logistics',
    isDoorstep: true,
    isPodAvailable: false,
    description: 'Independence Layout, New Haven, and Enugu metropolitan.',
  },
  Anambra: {
    zone: 'South East',
    baseFee: 5000,
    sla: '2 to 3 Days',
    courierMode: 'Interstate Regional Logistics',
    isDoorstep: true,
    isPodAvailable: false,
    description: 'Awka, Onitsha, Nnewi commercial hubs.',
  },
};

const DEFAULT_NATIONWIDE_RATE: Omit<StateDeliveryInfo, 'state'> = {
  zone: 'Nationwide Logistics',
  baseFee: 5500,
  sla: '2 to 4 Working Days',
  courierMode: 'Nationwide Tracked Courier',
  isDoorstep: true,
  isPodAvailable: false,
  description: 'Tracked interstate courier delivery to site or residential address.',
};

export const FREE_DELIVERY_THRESHOLD = 150000;

export function getStateDeliveryInfo(state: string, subtotal = 0): StateDeliveryInfo & {
  effectiveFee: number;
  effectiveFeeFormatted: string;
  isFreeDelivery: boolean;
} {
  const cleanState = (state || '').trim();
  const matched =
    STATE_RATES_MAP[cleanState] ||
    Object.entries(STATE_RATES_MAP).find(([k]) =>
      cleanState.toLowerCase().includes(k.toLowerCase())
    )?.[1] ||
    DEFAULT_NATIONWIDE_RATE;

  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const effectiveFee = isFreeDelivery ? 0 : matched.baseFee;

  return {
    state: cleanState || 'Abuja (FCT)',
    ...matched,
    effectiveFee,
    effectiveFeeFormatted: isFreeDelivery ? 'FREE (Orders over ₦150k)' : money(effectiveFee),
    isFreeDelivery,
  };
}
