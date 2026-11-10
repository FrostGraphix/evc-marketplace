'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Clock, MapPin, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import {
  NIGERIAN_STATES,
  getStateDeliveryInfo,
  FREE_DELIVERY_THRESHOLD,
} from '@/lib/deliveryRates';
import { money } from '@/lib/utils';

interface DeliveryEstimatorProps {
  subtotal?: number;
  cartTotal?: number;
  className?: string;
  compact?: boolean;
  onStateSelect?: (state: string) => void;
  onRateCalculated?: (info: ReturnType<typeof getStateDeliveryInfo>) => void;
}

export const DeliveryEstimator: React.FC<DeliveryEstimatorProps> = ({
  subtotal = 0,
  cartTotal,
  className = '',
  compact = false,
  onStateSelect,
  onRateCalculated,
}) => {
  const activeSubtotal = cartTotal ?? subtotal;
  const [selectedState, setSelectedState] = useState<string>('Kwara');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('evc_delivery_state');
      if (saved && NIGERIAN_STATES.includes(saved as any)) {
        setSelectedState(saved);
      }
    } catch {}
  }, []);

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    try {
      localStorage.setItem('evc_delivery_state', newState);
      window.dispatchEvent(
        new CustomEvent('evc:delivery-state-changed', { detail: { state: newState } })
      );
    } catch {}
    if (onStateSelect) {
      onStateSelect(newState);
    }
  };

  const deliveryInfo = getStateDeliveryInfo(selectedState, activeSubtotal);
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - activeSubtotal);

  useEffect(() => {
    if (onRateCalculated) {
      onRateCalculated(deliveryInfo);
    }
  }, [deliveryInfo, onRateCalculated]);

  if (compact) {
    return (
      <div className={`p-3 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-2 text-xs ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-[var(--ink)]">
            <Truck className="w-4 h-4 text-brand" />
            <span>Delivery Hub:</span>
          </div>

          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="appearance-none bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] text-xs font-semibold rounded-xl pl-2.5 pr-7 py-1 outline-none focus:border-brand cursor-pointer"
            >
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--mute)]" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[var(--line)]">
          <span className="text-[var(--mute)] flex items-center gap-1">
            <Clock className="w-3 h-3 text-brand" /> {deliveryInfo.sla}
          </span>
          <span className="font-extrabold text-[var(--ink)]">
            {deliveryInfo.isFreeDelivery ? (
              <span className="text-emerald-500 font-bold">FREE</span>
            ) : (
              deliveryInfo.effectiveFeeFormatted
            )}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-3xl bg-[var(--surface)] border border-[var(--line)] space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-[var(--ink)]">
              State Delivery &amp; Site Dispatch
            </h4>
            <span className="text-xs text-[var(--mute)]">
              Ilorin • Ibadan • Abuja &amp; 36 States
            </span>
          </div>
        </div>

        <div className="relative">
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="appearance-none bg-[var(--surface2)] text-[var(--ink)] border border-[var(--line)] text-xs font-semibold rounded-xl pl-3 pr-8 py-2 outline-none focus:border-brand cursor-pointer"
          >
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--mute)]" />
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-[var(--surface2)] space-y-2 border border-[var(--line)]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--mute)] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand" /> Estimated SLA:
          </span>
          <span className="font-bold text-[var(--ink)]">{deliveryInfo.sla}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--mute)] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand" /> Courier Fleet:
          </span>
          <span className="font-semibold text-[var(--ink)]">{deliveryInfo.courierMode}</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--line)]">
          <span className="text-[var(--ink)] font-semibold">Delivery Fee:</span>
          <span className="font-display font-extrabold text-sm text-brand">
            {deliveryInfo.isFreeDelivery ? 'FREE DELIVERY' : money(deliveryInfo.effectiveFee)}
          </span>
        </div>
      </div>

      {remainingForFree > 0 ? (
        <p className="text-[11px] text-[var(--mute)] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          Add <b>{money(remainingForFree)}</b> more equipment to qualify for free nationwide dispatch.
        </p>
      ) : (
        <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Order exceeds ₦150,000 threshold — Free Delivery active!
        </p>
      )}
    </div>
  );
};
