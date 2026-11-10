'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Sun,
  Moon,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  LogIn,
  UserPlus,
  Phone,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { getAdminSession, clearAdminSession, AdminUser } from '@/lib/adminAuth';
import { MegaMenu } from './MegaMenu';
import { CFG, CATS } from '@/lib/products';

function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    const local = email.split('@')[0];
    return local.slice(0, 2).toUpperCase();
  }
  return 'EVC';
}

function getFirstName(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    return name.trim().split(/\s+/)[0];
  }
  if (email && email.trim()) {
    const local = email.split('@')[0];
    return local.charAt(0).toUpperCase() + local.slice(1);
  }
  return 'Client';
}

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, openDrawer } = useCart();
  const { wishlist } = useWishlist();
  const { user, profile, stats, signOut } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Sync admin session
  useEffect(() => {
    setAdminUser(getAdminSession());
    const handleAdminAuth = (e: any) => {
      setAdminUser(e?.detail?.user ?? getAdminSession());
    };
    window.addEventListener('evc:admin-auth', handleAdminAuth);
    window.addEventListener('mc:admin-auth', handleAdminAuth);
    return () => {
      window.removeEventListener('evc:admin-auth', handleAdminAuth);
      window.removeEventListener('mc:admin-auth', handleAdminAuth);
    };
  }, []);

  // Close profile dropdown on route changes
  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [pathname]);

  const activeUser = user || adminUser;
  const displayName = profile?.full_name || adminUser?.name || user?.user_metadata?.full_name || '';
  const displayEmail = adminUser?.email || user?.email || profile?.email || '';
  const userInitials = getInitials(displayName, displayEmail);
  const firstName = getFirstName(displayName, displayEmail);
  const isStaff = Boolean(
    adminUser ||
    (displayEmail && (displayEmail.includes('@evcng.com') || displayEmail.includes('admin') || displayEmail.includes('manager') || displayEmail.includes('dispatch')))
  );

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    clearAdminSession();
    setAdminUser(null);
    await signOut();
  };

  const headerRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navWrapRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLElement>(null);
  const catLinkRef = useRef<HTMLAnchorElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMega = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMegaOpen(true);
  }, []);

  const closeMega = useCallback((delay = 200) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsMegaOpen(false);
    }, delay);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) return;
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 30);

      if (currentScrollY > lastScrollY.current + 8 && currentScrollY > 220) {
        setIsHidden(true);
        setIsMegaOpen(false);
      } else if (currentScrollY < lastScrollY.current - 6 || currentScrollY < 100) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('locked', isMobileMenuOpen);
    return () => {
      document.body.classList.remove('locked');
    };
  }, [isMobileMenuOpen]);

  // Click outside and escape handling
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMegaOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMegaOpen(false);
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Specified nav links: Shop, Categories, Track Order, About, Contact
  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/shop#categories', hasMega: true },
    { label: 'Track Order', href: '/track' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const movePill = useCallback((target: HTMLElement | null) => {
    const pill = pillRef.current;
    const wrap = navWrapRef.current;
    if (!pill || !wrap) return;

    if (!target) {
      pill.style.opacity = '0';
      return;
    }

    const wrapRect = wrap.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    pill.style.width = `${targetRect.width}px`;
    pill.style.height = `${targetRect.height}px`;
    pill.style.transform = `translate(${targetRect.left - wrapRect.left}px, ${targetRect.top - wrapRect.top}px)`;
    pill.style.opacity = '1';
  }, []);

  const resetPill = useCallback(() => {
    const wrap = navWrapRef.current;
    if (!wrap) return;

    if (isMegaOpen && catLinkRef.current) {
      movePill(catLinkRef.current);
      return;
    }

    const activeEl = wrap.querySelector<HTMLElement>('.nl-active');
    movePill(activeEl);
  }, [isMegaOpen, movePill]);

  useEffect(() => {
    const handleResize = () => resetPill();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resetPill]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => resetPill());
    return () => cancelAnimationFrame(raf);
  }, [resetPill]);

  useEffect(() => {
    if (isMegaOpen && catLinkRef.current) {
      movePill(catLinkRef.current);
    } else {
      resetPill();
    }
  }, [pathname, isMegaOpen, resetPill, movePill]);

  useEffect(() => {
    setIsMegaOpen(false);
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-3 z-50 transition-transform duration-300 w-full max-w-[1080px] mx-auto px-4 relative ${
          isHidden ? '-translate-y-28' : 'translate-y-0'
        }`}
      >
        <div
          className={`flex items-center justify-between gap-3 rounded-full border border-[var(--line)] bg-[var(--nav-bg)] backdrop-blur-xl px-4 md:px-6 transition-all duration-300 relative shadow-sm ${
            isScrolled ? 'h-14' : 'h-16'
          }`}
        >
          {/* Header Logo (Rule 3: Light -> /images/evc-logo-light.png, Dark -> /images/evc-logo-dark.png, Mark -> /images/evc-mark.png) */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 flex-shrink-0"
            aria-label="EVC Nigeria Homepage"
          >
            {/* Logo Mark with clean outline */}
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex items-center justify-center p-0.5 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/images/evc-mark.png"
                alt="EVC Mark"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {/* Wordmark rendered smoothly for light and dark themes */}
            <div className="relative h-7 w-28 sm:w-32 hidden xs:block">
              {/* Light Theme Logo */}
              <Image
                src="/images/evc-logo-light.png"
                alt="EVC Nigeria"
                fill
                sizes="128px"
                className="object-contain object-left dark:hidden"
                priority
              />
              {/* Dark Theme Logo */}
              <Image
                src="/images/evc-logo-dark.png"
                alt="EVC Nigeria"
                fill
                sizes="128px"
                className="object-contain object-left hidden dark:block"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation with Sliding Pill Tracker */}
          <nav
            ref={navWrapRef}
            onMouseLeave={resetPill}
            className="hidden lg:flex items-center gap-1 relative flex-shrink-0"
          >
            <i ref={pillRef} className="nl-pill" />
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href.split('#')[0]) && link.href !== '/shop#categories';

              if (link.hasMega) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={openMega}
                    onMouseLeave={() => closeMega(200)}
                  >
                    <Link
                      ref={catLinkRef}
                      href={link.href}
                      onClick={(e) => {
                        if (!isMegaOpen) {
                          e.preventDefault();
                          openMega();
                        }
                      }}
                      onMouseEnter={(e) => {
                        openMega();
                        movePill(e.currentTarget);
                      }}
                      onFocus={(e) => {
                        openMega();
                        movePill(e.currentTarget);
                      }}
                      className={`relative z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 select-none whitespace-nowrap ${
                        isMegaOpen
                          ? 'text-brand font-semibold nl-active'
                          : 'text-[var(--ink)] hover:text-brand'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isMegaOpen ? 'rotate-180 text-brand' : 'opacity-70'
                        }`}
                      />
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={(e) => {
                    closeMega(50);
                    movePill(e.currentTarget);
                  }}
                  onFocus={(e) => {
                    closeMega(50);
                    movePill(e.currentTarget);
                  }}
                  className={`relative z-10 px-3.5 py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 select-none whitespace-nowrap ${
                    isActive && !isMegaOpen
                      ? 'text-brand font-semibold nl-active'
                      : 'text-[var(--ink)] hover:text-brand'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-[var(--pill)] text-[var(--ink)] hover:text-brand active:scale-95 transition-all"
              aria-label="Search catalog"
              title="Search catalog (Ctrl+K or /)"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-[var(--pill)] text-[var(--ink)] hover:text-brand active:scale-95 transition-all"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              )}
            </button>

            {/* Wishlist Trigger */}
            <Link
              href="/wishlist"
              className="hidden sm:flex group/wishlist relative w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center hover:bg-[var(--pill)] text-[var(--ink)] hover:text-brand active:scale-95 transition-all"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/wishlist:scale-110" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white font-bold text-[10px] flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              id="headerCartBtn"
              onClick={openDrawer}
              className="flex group/cart relative w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center hover:bg-[var(--pill)] text-[var(--ink)] hover:text-brand active:scale-95 transition-all"
              aria-label="Shopping cart"
              title="View cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/cart:scale-110" />
              {cartCount > 0 && (
                <span className="cart-badge absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white font-bold text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            <div ref={profileRef} className="relative">
              <div className="hidden sm:flex items-center">
                {activeUser ? (
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--surface2)] hover:border-brand/40 transition-all text-left"
                    aria-label="User account menu"
                  >
                    <span className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
                      {userInitials}
                    </span>
                    <span className="text-xs font-semibold max-w-[90px] truncate text-[var(--ink)]">
                      {firstName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--mute)]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-[var(--pill)] text-[var(--ink)] hover:text-brand active:scale-95 transition-all"
                    aria-label="Sign in"
                    title="Sign In / Account"
                  >
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>

              {/* Popover Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {activeUser ? (
                    <div className="space-y-2">
                      <div className="px-2 py-1.5 border-b border-[var(--line)] pb-2">
                        <strong className="block text-xs font-bold text-[var(--ink)] truncate">
                          {displayName || 'Client Member'}
                        </strong>
                        <span className="block text-[11px] text-[var(--mute)] truncate">
                          {displayEmail}
                        </span>
                        {isStaff && (
                          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-brand px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20">
                            EVC Staff Access
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 text-xs font-medium">
                        <Link
                          href="/account"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-[var(--surface2)] text-[var(--ink)] hover:text-brand transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-brand" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          href="/track"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-[var(--surface2)] text-[var(--ink)] hover:text-brand transition-colors"
                        >
                          <Package className="w-4 h-4 text-brand" />
                          <span>Track Shipments</span>
                        </Link>
                        {isStaff && (
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-brand/10 text-brand font-semibold hover:bg-brand/15 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Staff Admin Portal</span>
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors text-left font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="px-2 py-1 text-[11px] text-[var(--mute)] border-b border-[var(--line)] pb-2">
                        Sign in for tracked orders, corporate quotes & warranty records.
                      </div>
                      <Link
                        href="/login"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="btn-primary w-full py-2 text-xs justify-center"
                      >
                        <LogIn className="w-3.5 h-3.5" /> Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="btn-ghost w-full py-2 text-xs justify-center"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[var(--ink)] hover:bg-[var(--pill)] active:scale-95 transition-all"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        {isMegaOpen && (
          <div
            onMouseEnter={openMega}
            onMouseLeave={() => closeMega(200)}
          >
            <MegaMenu onClose={() => setIsMegaOpen(false)} />
          </div>
        )}

        {/* Mobile Fullscreen Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[72px] bg-[var(--bg)] z-40 p-6 flex flex-col justify-between overflow-y-auto border-t border-[var(--line)]">
            <div className="space-y-4">
              <nav className="flex flex-col gap-2">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] font-display font-bold text-lg text-[var(--ink)]"
                >
                  Shop Catalog
                </Link>

                {/* Mobile Categories Accordion */}
                <div className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileCategoriesExpanded(!mobileCategoriesExpanded)}
                    className="w-full flex items-center justify-between px-4 py-3 font-display font-bold text-lg text-[var(--ink)]"
                  >
                    <span>Categories</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileCategoriesExpanded ? 'rotate-180 text-brand' : ''}`} />
                  </button>
                  {mobileCategoriesExpanded && (
                    <div className="px-4 pb-3 grid grid-cols-1 gap-2 pt-1 border-t border-[var(--line)]">
                      {CATS.map((c) => (
                        <Link
                          key={c.id}
                          href={`/shop?cat=${c.id}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 text-xs font-semibold text-[var(--mute)] hover:text-brand py-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                          <span>{c.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/track"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] font-display font-bold text-lg text-[var(--ink)]"
                >
                  Track Order
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] font-display font-bold text-lg text-[var(--ink)]"
                >
                  About EVC
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] font-display font-bold text-lg text-[var(--ink)]"
                >
                  Contact & Offices
                </Link>
              </nav>

              {/* Direct WhatsApp Callout */}
              <a
                href={`https://wa.me/${CFG.phone}?text=Hello%20EVC%20Nigeria`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa w-full py-3 text-xs justify-center"
              >
                <Phone className="w-4 h-4" />
                <span>Chat on WhatsApp: {CFG.phoneDisp}</span>
              </a>
            </div>

            {/* Footer details in mobile menu */}
            <div className="pt-6 border-t border-[var(--line)] text-center text-xs text-[var(--mute)]">
              &copy; {new Date().getFullYear()} EVC Nigeria. All rights reserved.
            </div>
          </div>
        )}
      </header>
    </>
  );
};
