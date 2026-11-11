'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CATS, CFG } from '@/lib/products';
import { waLink } from '@/lib/utils';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  MessageSquare,
  Send,
  CheckCircle2,
  Building,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setTimeout(() => setNewsletterSuccess(false), 3500);
      setNewsletterEmail('');
    }
  };

  const socialLinks = [
    { name: 'Instagram', handle: '@evc_ng', url: CFG.socials.instagram },
    { name: 'X (Twitter)', handle: '@evcnigeria', url: CFG.socials.x },
    { name: 'LinkedIn', handle: 'EVC Nigeria', url: CFG.socials.linkedin },
    { name: 'YouTube', handle: '@evcnigeria', url: CFG.socials.youtube },
    { name: 'Facebook', handle: '@evcnigeria', url: CFG.socials.facebook },
    { name: 'TikTok', handle: '@evcnigeria', url: CFG.socials.tiktok },
  ];

  return (
    <footer className="bg-[var(--inv)] text-[var(--inv-ink)] pt-16 md:pt-20 mt-20 rounded-t-[40px] overflow-hidden relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Newsletter & Quote Banner */}
        <div className="pb-12 mb-12 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand mb-2">
              Stay Ahead with EVC
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Verified Land &amp; Master-Planned Communities Across Nigeria
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
              Subscribe to project launch alerts, upcoming phase releases, and verified title updates delivered straight to your inbox.
            </p>
          </div>
          <div className="lg:col-span-5">
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your corporate email address..."
                className="flex-1 bg-white/5 border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-brand"
              />
              <button type="submit" className="btn-primary text-xs py-2.5 px-5 flex-shrink-0">
                {newsletterSuccess ? (
                  <span className="flex items-center gap-1 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Subscribe <Send className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Navigation & Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex items-center justify-center p-0.5">
                <Image
                  src="/images/evc-mark.png"
                  alt="EVC Mark"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="relative h-7 w-28">
                <Image
                  src="/images/evc-logo-dark.png"
                  alt="EVC Nigeria"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nigeria&apos;s premier developer for master-planned residential estates, strategic highway growth corridors, student housing, and commercial agro-cities.
            </p>
            <a
              href={waLink('Hello EVC Nigeria, I would like to request a quotation.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa inline-flex items-center gap-2 text-xs py-2 px-4 w-fit mt-1"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Instant WhatsApp Desk
            </a>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand mb-4">
              Catalog Categories
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-300">
              {CATS.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?cat=${cat.id}`}
                    className="hover:text-brand transition-colors inline-block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/shop"
                  className="text-brand font-semibold hover:text-brand-light transition-colors"
                >
                  View All Products &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Direct Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand mb-4">
              Customer Support
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-300">
              <li>
                <Link href="/about" className="hover:text-brand transition-colors">
                  About EVC Nigeria
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-brand transition-colors font-semibold text-brand">
                  Why Us &amp; Core Pillars
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-brand transition-colors font-medium text-brand-light">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand transition-colors">
                  Corporate Inquiries & Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brand transition-colors">
                  Review Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-brand transition-colors">
                  Saved Project Items
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-brand transition-colors">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate Offices (Rule 4) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand mb-4">
              Corporate Offices
            </h4>
            <div className="flex flex-col gap-3.5 text-xs text-slate-300">
              {/* Ilorin */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Ilorin Headquarters:</strong>
                  <span className="text-slate-400 leading-normal text-[11px]">
                    Suite C1, Kajo Mall, Opp Fresh Hotel, Fate / Plot 7A, Adelodun Rd, Bodunde St, Flower Garden G.R.A., Ilorin, Kwara State
                  </span>
                </div>
              </div>

              {/* Ibadan */}
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Ibadan Regional Office:</strong>
                  <span className="text-slate-400 leading-normal text-[11px]">
                    Plot 11, Oluyoro Avenue, Off Awolowo Road, Bodija, Ibadan, Oyo State
                  </span>
                </div>
              </div>

              {/* Abuja */}
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Abuja Corporate Center:</strong>
                  <span className="text-slate-400 leading-normal text-[11px]">
                    EVC Corporate / FCT Abuja
                  </span>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5 text-[11px]">
                <a href="tel:+2347082938870" className="flex items-center gap-2 hover:text-brand transition-colors">
                  <Phone className="w-3.5 h-3.5 text-brand" /> {CFG.phoneDisp}
                </a>
                <a href={`mailto:${CFG.email}`} className="flex items-center gap-2 hover:text-brand transition-colors">
                  <Mail className="w-3.5 h-3.5 text-brand" /> {CFG.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Socials Dock (Rule 4) */}
        <div className="py-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official Verified Channels:
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-brand hover:text-brand text-xs text-slate-300 transition-all duration-200"
              >
                <span className="font-semibold">{s.name}:</span> <span className="opacity-75">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} EVC Nigeria Limited. All rights reserved.</span>
          <span className="text-slate-500 text-[11px]">Master-Planned Estates • Guaranteed Titles • Physical Demarcation</span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white font-semibold transition-colors"
          >
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stylized Giant Background Typography */}
      <div
        className="font-display font-extrabold text-[clamp(3.5rem,18vw,16rem)] leading-none text-center select-none text-transparent tracking-tighter opacity-10 overflow-hidden whitespace-nowrap pointer-events-none mt-2 -mb-6"
        style={{
          WebkitTextStroke: '2px rgba(255, 122, 51, 0.4)',
        }}
        aria-hidden="true"
      >
        EVC NIGERIA
      </div>
    </footer>
  );
};
