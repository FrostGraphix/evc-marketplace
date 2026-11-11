'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap, Building2, MapPin, CheckCircle2, FileCheck, Calendar, Users, Award, Compass } from 'lucide-react';
import { CFG } from '@/lib/products';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-16 bg-[#03090a] text-slate-100 min-h-screen">
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
            <div className="w-20 h-20 rounded-3xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand p-2">
              <Image
                src="/images/evc-mark.png"
                alt="EVC Mark"
                width={60}
                height={60}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-display text-2xl font-bold text-[var(--ink)]">
              EVC Nigeria
            </h3>
            <p className="text-xs text-[var(--mute)] max-w-xs leading-relaxed">
              Experience Vision Creations — Pioneer real estate developer shaping master-planned residential communities, highway growth corridors, and smart cities.
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
            Our Vision &amp; Development Portfolio
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-[var(--ink)]">
            Pioneering verified real estate &amp; <em className="serif-italic">sustainable communities</em>.
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-[var(--ink2)] leading-relaxed">
            <p>
              EVC Nigeria (<strong>evcng.com</strong>) is an institutional real estate firm delivering guaranteed land titles, thoughtfully master-planned residential estates, student housing, and commercial agricultural developments across Nigeria.
            </p>
            <p>
              Every property in our portfolio—from <strong>Broadway Residentials</strong> in Malete to <strong>Eden Crest</strong> along the Agbowa-Ikosi corridor, <strong>Afonja Boulevard</strong> in Ilorin, and <strong>The Providence Corridors</strong> in Abeokuta, Moniya, and Epe—is 100% dry tableland with verified legal documentation (C of O, C of O in View, and Registered Survey).
            </p>
            <p>
              With strategic regional fulfillment centers in <strong>Ilorin (Kwara State)</strong>, <strong>Ibadan (Oyo State)</strong>, and <strong>Abuja (FCT)</strong>, we offer transparent milestone payments, weekly physical site tours, and prompt 24-to-48-hour deed documentation dispatch for local and diaspora clients.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link href="/shop" className="btn-primary text-sm">
              Explore Property Portfolio <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <Link href="/why-us" className="btn-ghost text-sm border border-glow/25">
              Why EVC Nigeria (4 Pillars) &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Vision & Mission from evcng.com/why-us */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 sm:p-10 rounded-[32px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Our Vision</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-white leading-snug">
            {CFG.whyUs.vision}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Propelled by architectural crafts, meticulous surveyor expertise, and modern community design to lead Nigeria&apos;s property transformation.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-[32px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Our Mission</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-white leading-snug">
            {CFG.whyUs.mission}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Delivering accessible, budget-friendly installment structures alongside premium master-planned standards across every Nigerian state.
          </p>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--ink)]">Guaranteed Title Security</h3>
          <p className="text-xs sm:text-sm text-[var(--mute)] leading-relaxed">
            Every project undergoes rigorous ministry searches and legal verification. We deliver genuine Certificates of Occupancy and Government Allocation records with zero third-party encumbrances.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--ink)]">Weekly Free Site Tours</h3>
          <p className="text-xs sm:text-sm text-[var(--mute)] leading-relaxed">
            We provide complimentary chauffeur-driven physical inspections every Tuesday, Thursday, and Saturday departing from our hubs in Ilorin and Ibadan, complete with virtual walk-throughs for diaspora investors.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--ink)]">Master-Planned Infrastructure</h3>
          <p className="text-xs sm:text-sm text-[var(--mute)] leading-relaxed">
            All estates feature perimeter fencing, gatehouse security, motorable internal road layouts, solar streetlights, drainage systems, and immediate physical pegging.
          </p>
        </div>
      </div>

      {/* Leadership Directorate from evcng.com/why-us */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Operational Team
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            Leadership &amp; Directorate
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            The experienced professionals guiding your land allocations and development projects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CFG.whyUs.leadership.map((leader, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col gap-3 text-center items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand font-display font-bold text-xl">
                {leader.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <strong className="block font-display text-base font-bold text-white">
                  {leader.name}
                </strong>
                <span className="text-xs font-semibold text-brand block mt-0.5">
                  {leader.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                {leader.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Regional Hubs Section */}
      <section className="p-8 sm:p-12 rounded-[40px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand">
            Regional Presence
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] mt-1">
            Experience Centers &amp; Advisory Hubs
          </h2>
          <p className="text-xs sm:text-sm text-[var(--mute)] mt-2">
            Visit any of our operational hubs for deed collections, consultations, or guided site departures.
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
