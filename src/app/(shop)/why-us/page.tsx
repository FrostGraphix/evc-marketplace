'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  TrendingUp,
  MapPin,
  Wallet,
  Users,
  Building2,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Quote,
  Send,
  Sparkles,
  PhoneCall,
  MessageSquare,
  Award,
  Compass,
} from 'lucide-react';
import { CFG } from '@/lib/products';
import { waLink } from '@/lib/utils';

export default function WhyUsPage() {
  const [citySuggestion, setCitySuggestion] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityPhone, setCityPhone] = useState('');
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello EVC Nigeria, [City Expansion Suggestion] from ${cityName || 'Client'} (${cityPhone || 'No phone'}): I would love to see EVC Nigeria develop projects in ${citySuggestion}!`;
    window.open(waLink(text), '_blank', 'noopener,noreferrer');
    setSuggestSuccess(true);
    setTimeout(() => setSuggestSuccess(false), 4000);
  };

  return (
    <div className="flex flex-col gap-16 md:gap-24 bg-[#03090a] text-slate-100 min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 md:pt-16 pb-8 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-[-80px] right-[-100px] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">Why Us</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-brand border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 px-3.5 py-1.5 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Why Choose EVC Nigeria &bull; evcng.com/why-us
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.95] text-white">
              Envisioning Prosperity.
              <span className="block text-brand mt-1">
                <em className="serif-italic text-white">Smart Property</em> Investments.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Your journey to financial independence begins now. We specialize in verified land acquisition, master-planned residential estates, and building construction, passionate about bringing designs to life for the modern investor.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/shop" className="btn-primary text-sm inline-flex items-center gap-2">
                Explore Land Catalog <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={waLink('Hello EVC Nigeria, I would like to schedule a free physical inspection tour.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm border border-glow/25 inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-brand" /> Book Inspection (Tue, Thu, Sat)
              </a>
              <a
                href={waLink('Hello EVC Nigeria, I want to become an EVC Realtor / Referral Partner.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full text-xs font-semibold border border-brand/40 bg-brand/10 text-brand hover:bg-brand hover:text-white transition-all inline-flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" /> Become an EVC Realtor
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 relative aspect-square rounded-[36px] overflow-hidden border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 p-8 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center p-1.5">
                <Image
                  src="/images/evc-mark.png"
                  alt="EVC Mark"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                100% Dry Land
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand">The EVC Advantage</span>
              <p className="text-sm font-semibold text-white leading-snug">
                {CFG.whyUs.allInOne}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>Zero Omonile Issues</span>
              <span className="font-bold text-brand">Verified Titles</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Core Pillars of Why Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Guaranteed Standards
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mt-1">
            The 4 Pillars That Set Us Apart
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Why high-net-worth investors, diaspora buyers, and first-time homeowners trust EVC Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Affordability */}
          <div className="p-6 sm:p-7 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col justify-between gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-2">
                Affordability &amp; Installments
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Begin your home ownership journey on a budget and ease you have never seen before with our structured installment plans and convenient payment methods tailored for young and old.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-brand mt-auto">Flexible milestone terms &rarr;</span>
          </div>

          {/* Pillar 2: Expert Engagements */}
          <div className="p-6 sm:p-7 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col justify-between gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-2">
                Expert Engagements
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                With the guidance of our trained, certified, and experienced property consultants, be completely assured that your documentation and allocations are in safe hands.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-brand mt-auto">Professional realtors &rarr;</span>
          </div>

          {/* Pillar 3: Valuable Information */}
          <div className="p-6 sm:p-7 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col justify-between gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-2">
                Valuable Information
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our professionals have the nose for details and a penchant for the next big growth wave. Deep industry insights and corridor appreciation data will surely be at your advantage.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-brand mt-auto">High-yield ROI data &rarr;</span>
          </div>

          {/* Pillar 4: Strategic Investments */}
          <div className="p-6 sm:p-7 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col justify-between gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-brand">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-2">
                Strategic Investments
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Location is indispensable in real estate. We understand this deeply and play strictly by the rules always to guarantee your personal fulfillment and assured prosperity.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-brand mt-auto">Prime growth corridors &rarr;</span>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="p-8 sm:p-10 rounded-[32px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand">Our Vision</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
              To be a Real Estate Magnate in the Nigerian industry propelled by Crafts, Expertise &amp; Innovation.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We envision master-planned smart communities that bridge wealth creation with sustainable architecture, creating lasting intergenerational equity for our subscribers.
            </p>
          </div>

          {/* Mission */}
          <div className="p-8 sm:p-10 rounded-[32px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand">Our Mission</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
              To redefine the concepts of comfort and expertise locally through a global compass bearing in mind luxury and affordability.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Whether it is buying land, building projects, joint-venture partnerships, or remote diaspora acquisitions, we provide an all-in-one solution that guarantees peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership & Operational Directorate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Operational Team
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            The Minds Behind EVC Nigeria
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A dedicated multidisciplinary team of engineers, surveyors, procurement managers, and customer experience leads.
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

      {/* Verified Client Testimonials from evcng.com/why-us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Client Voices &bull; Trusted by Luxury Owners
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mt-1">
            Take Our Word For It
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Our clients love our services as much as we do — here are a few of their wonderful thoughts about EVC Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CFG.whyUs.testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-7 sm:p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex flex-col justify-between gap-6 relative overflow-hidden"
            >
              <Quote className="w-10 h-10 text-brand/20 absolute right-6 top-6 pointer-events-none" />
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10 relative z-10">
                <div className="w-10 h-10 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-xs font-bold text-brand">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <strong className="block text-xs font-bold text-white">{t.author}</strong>
                  <span className="text-[11px] text-slate-400">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "You Want Us in a City?" Suggestion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="rounded-[40px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 p-8 sm:p-12 md:p-14 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">
              Corridor Expansion
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              You want us in your City?
            </h2>
            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-lg">
              We are actively expanding our master-planned estates and agricultural hubs across Nigeria. Drop your city suggestion below, and our property acquisition team will reach out with early bird opportunities.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Current hubs: Ilorin (Kwara), Ibadan (Oyo), Epe (Lagos), Abuja (FCT)</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleCitySubmit} className="space-y-4 p-6 sm:p-8 rounded-3xl bg-black/60 border border-glow/25">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Which City / State do you want EVC to develop next? *
                </label>
                <input
                  type="text"
                  required
                  value={citySuggestion}
                  onChange={(e) => setCitySuggestion(e.target.value)}
                  placeholder="e.g. Akure, Osogbo, Port Harcourt, Kano..."
                  className="input-field w-full text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="e.g. Alhaji Sanusi"
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={cityPhone}
                    onChange={(e) => setCityPhone(e.target.value)}
                    placeholder="0801 234 5678"
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full h-11 text-xs justify-center items-center shadow-lg"
              >
                {suggestSuccess ? (
                  <span className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" /> Suggestion Sent to EVC Desk!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> Submit City Suggestion
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center p-8 sm:p-12 rounded-[36px] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Get Started Today
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Start Your Real Estate Investment Today!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Speak directly with an EVC property consultant or visit our regional hubs in Ilorin, Ibadan, and Abuja.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/shop" className="btn-primary text-xs py-3 px-6">
              Browse Available Land
            </Link>
            <a
              href={waLink('Hello EVC Nigeria, I want to start my real estate investment today.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs py-3 px-6 border border-glow/25"
            >
              <MessageSquare className="w-4 h-4 text-[#25d366]" /> Chat with Investment Advisor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
