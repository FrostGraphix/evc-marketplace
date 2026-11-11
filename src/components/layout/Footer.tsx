'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CFG } from '@/lib/products';
import { waLink } from '@/lib/utils';
import {
  Phone,
  Mail,
  Send,
  CheckCircle2,
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
      handle: 'EVC Nig. Ltd',
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
    <footer className="mt-auto bg-[var(--inv)] text-[var(--inv-ink)] pt-14 md:pt-16 pb-8 rounded-t-[40px] overflow-hidden relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Newsletter & Updates Banner */}
        <div className="pb-10 mb-10 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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
                placeholder="Enter your email address..."
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

        {/* Main Footer Navigation & Directory (Matching Image Specification) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center w-fit" aria-label="EVC Nig. Ltd Homepage">
              <div className="relative h-9 w-36">
                <Image
                  src="/images/evc-logo-dark.png"
                  alt="EVC Nig. Ltd"
                  fill
                  sizes="144px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              We are a company that specializes in building construction and passionate about bringing designs to live.
            </p>
          </div>

          {/* Portfolio Links */}
          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand mb-4">
              Portfolio
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
              <li>
                <Link href="/shop" className="hover:text-brand transition-colors inline-block">
                  Buy Land
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=housing-developments" className="hover:text-brand transition-colors inline-block">
                  Build Projects
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=corridor-developments" className="hover:text-brand transition-colors inline-block">
                  Investment
                </Link>
              </li>
            </ul>
          </div>

          {/* EVC Links */}
          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand mb-4">
              EVC
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
              <li>
                <a
                  href="https://evcng.com/why-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand transition-colors inline-block"
                >
                  Why EVC
                </a>
              </li>
              <li>
                <Link href="/shop" className="hover:text-brand transition-colors inline-block">
                  Marketplace
                </Link>
              </li>
              <li>
                <a
                  href="https://evcng.com/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand transition-colors inline-block"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href={waLink('Hello EVC Nig. Ltd, I would like to book a site inspection.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand transition-colors inline-block"
                >
                  Book Inspection
                </a>
              </li>
            </ul>
          </div>

          {/* Get in Touch (Strictly Ilorin and Ibadan - NO Abuja!) */}
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand mb-4">
              Get in Touch
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              {/* Ilorin Office */}
              <div className="space-y-1">
                <span className="font-bold text-white text-[11px] uppercase tracking-wider block">
                  ILORIN OFFICE
                </span>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Plot 7A, Adelodun Road, Bodunde Street Flower Garden G.R.A, Ilorin.
                </p>
              </div>

              {/* Ibadan Office */}
              <div className="space-y-1">
                <span className="font-bold text-white text-[11px] uppercase tracking-wider block">
                  IBADAN OFFICE
                </span>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Plot 11, Oluyoro Avenue, Off Awolowo Rd, Bodija, Ibadan, Oyo State.
                </p>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-400">
              <a href="tel:+2347082938870" className="flex items-center gap-1.5 hover:text-brand transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand" /> +234 708 293 8870
              </a>
              <a href="mailto:contact@evcng.com" className="flex items-center gap-1.5 hover:text-brand transition-colors">
                <Mail className="w-3.5 h-3.5 text-brand" /> contact@evcng.com
              </a>
            </div>
          </div>
        </div>

        {/* Verified Socials Dock - Icons Only */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold uppercase tracking-wider text-slate-400 text-[11px]">
              Follow Us:
            </span>
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} EVC Nig. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
