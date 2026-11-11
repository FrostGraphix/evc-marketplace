'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CFG } from '@/lib/products';

export const AnnouncementBar: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const items = [
    'EVC Nig. Ltd — Verified Real Estate, Land & Master-Planned Estates (evcng.com)',
    'Regional Experience Hubs: Ilorin (Flower Garden GRA) • Ibadan (Bodija)',
    'Free Guided Site Tours: Tuesdays, Thursdays & Saturdays (10:00 AM)',
    `WhatsApp Advisory & Site Inspection Booking: ${CFG.phoneDisp}`,
    'Guaranteed Titles: C of O, C of O in View, Registered Surveys & Zero Encumbrance',
    '100% Dry Tableland with Immediate Corner-Piece Allocation',
  ];

  return (
    <div
      className="bg-[var(--inv)] text-[var(--inv-ink)] text-xs font-medium overflow-hidden whitespace-nowrap py-2 border-b border-white/10 select-none"
      aria-label="Store announcements"
    >
      <div className="animate-marquee flex items-center gap-10">
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <span key={idx} className="inline-flex items-center gap-10">
            <span>{text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
};
