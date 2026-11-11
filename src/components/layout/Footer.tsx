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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setTimeout(() => setNewsletterSuccess(false), 3500);
      setNewsletterEmail('');
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      handle: '@evc_ng',
      url: CFG.socials.instagram,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      handle: '@evcnigeria',
      url: CFG.socials.x,
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      handle: 'EVC Nigeria',
      url: CFG.socials.linkedin,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.39 9.74v-8.37H5.07v8.37h2.78z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      handle: '@evcnigeria',
      url: CFG.socials.youtube,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      handle: '@evcnigeria',
      url: CFG.socials.facebook,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      handle: '@evcnigeria',
      url: CFG.socials.tiktok,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.42a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.84 4.84 0 0 1-1-.13z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="mt-auto bg-[var(--inv)] text-[var(--inv-ink)] pt-16 md:pt-20 rounded-t-[40px] overflow-hidden relative border-t border-white/10">
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
            <Link href="/" className="flex items-center" aria-label="EVC Nigeria Homepage">
              <div className="relative h-8 w-32">
                <Image
                  src="/images/evc-logo-dark.png"
                  alt="EVC Nigeria"
                  fill
                  sizes="128px"
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

          {/* Corporate Offices */}
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

        {/* Verified Socials Dock - Icons Only */}
        <div className="py-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official Verified Channels:
          </span>
          <div className="flex items-center gap-2.5 sm:gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${s.name} (${s.handle})`}
                aria-label={`${s.name} (${s.handle})`}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 bg-white/5 hover:border-brand hover:bg-brand/10 hover:text-brand text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Clean Copyright */}
        <div className="py-6 flex items-center justify-center text-center text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} EVC Nigeria Limited. All rights reserved.</span>
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
