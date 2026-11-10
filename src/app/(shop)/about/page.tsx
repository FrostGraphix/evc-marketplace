'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap, Building2, Wrench, CheckCircle2 } from 'lucide-react';
import { CFG } from '@/lib/products';
import { ProductArt } from '@/components/shop/ProductArt';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--mute)]">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-semibold">About</span>
      </nav>

      {/* Main Split Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Visual Card */}
        <div className="lg:col-span-5 relative aspect-square rounded-[40px] overflow-hidden border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-radial-glow opacity-30" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand">
              <Zap className="w-10 h-10" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[var(--ink)]">
              EVC Nigeria
            </h3>
            <p className="text-xs text-[var(--mute)] max-w-xs leading-relaxed">
              Powering modern residences, commercial facilities, and off-grid infrastructure across Nigeria with tier-1 technology.
            </p>
            <div className="flex gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-brand/15 text-brand border border-brand/30">
                Ilorin Hub
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-brand/15 text-brand border border-brand/30">
                Ibadan Hub
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-brand/15 text-brand border border-brand/30">
                Abuja Hub
              </span>
            </div>
          </div>
        </div>

        {/* Right Story Copy */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand">
            Our Mission &amp; Infrastructure
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-[var(--ink)]">
            Engineering sustainable energy &amp; <em className="serif-italic">smart living</em>.
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-[var(--ink2)] leading-relaxed">
            <p>
              EVC Nigeria was established to solve Nigeria&apos;s dual challenge: dependable, uninterrupted clean power and intelligent, high-finish architectural living spaces.
            </p>
            <p>
              From commercial solar generation, industrial lithium power storage, and remote telemetry to smart biometric automation, architectural acoustic panels, and executive workspace appointments, we curate and engineer complete turn-key infrastructure.
            </p>
            <p>
              With strategic regional fulfillment centers in <strong>Ilorin (Kwara State)</strong>, <strong>Ibadan (Oyo State)</strong>, and <strong>Abuja (FCT)</strong>, we provide rapid field deployment, verified warranties, and nationwide consignment delivery to all 36 states.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link href="/shop" className="btn-primary text-sm">
              Explore Equipment Catalog <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <Link href="/contact" className="btn-ghost text-sm border border-glow/25">
              Contact Engineering Team
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--ink)]">Tier-1 Clean Energy</h3>
          <p className="text-xs sm:text-sm text-[var(--mute)] leading-relaxed">
            High-efficiency solar PV arrays, hybrid inverters, and Grade-A lithium iron phosphate (LiFePO4) energy storage built for durability.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--ink)]">Intelligent Spaces</h3>
          <p className="text-xs sm:text-sm text-[var(--mute)] leading-relaxed">
            Matter &amp; Zigbee enabled automation, biometric access control, smart lighting systems, and acoustic architectural paneling.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--ink)]">Regional Field Support</h3>
          <p className="text-xs sm:text-sm text-[var(--mute)] leading-relaxed">
            Dedicated engineers in Kwara, Oyo, and Abuja ready for on-site load audits, professional installations, and after-sales maintenance.
          </p>
        </div>
      </div>

      {/* Regional Hubs Section */}
      <section className="p-8 sm:p-12 rounded-[40px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand">
            Regional Presence
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] mt-1">
            Fulfillment Hubs &amp; Engineering Offices
          </h2>
          <p className="text-xs sm:text-sm text-[var(--mute)] mt-2">
            Visit any of our operational locations or order online for direct doorstep dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CFG.offices.map((office, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-glow/25 space-y-2">
              <h4 className="font-display font-bold text-base text-white">{office.city} Hub</h4>
              <p className="text-xs text-brand font-medium">{office.state}</p>
              <p className="text-xs text-[var(--mute)] leading-relaxed">{office.address}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}