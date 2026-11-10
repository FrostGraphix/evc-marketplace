'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Percent,
  Bell,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { getAdminSession, AdminUser } from '@/lib/adminAuth';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    variant: 'brand' | 'amber' | 'emerald';
  };
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    badge: {
      text: '8 new',
      variant: 'emerald',
    },
  },
  {
    name: 'Equipment Catalog',
    href: '/admin/products',
    icon: Package,
    badge: {
      text: '2 low',
      variant: 'amber',
    },
  },
  {
    name: 'Clients & Sites',
    href: '/admin/customers',
    icon: Users,
  },
  {
    name: 'Discounts & Codes',
    href: '/admin/discounts',
    icon: Percent,
  },
  {
    name: 'Alerts & Telemetry',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    name: 'Staff & Roles',
    href: '/admin/staff',
    icon: ShieldCheck,
  },
];

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setCurrentUser(getAdminSession());
  }, []);

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex items-center justify-center p-0.5">
              <Image
                src="/images/evc-mark.png"
                alt="EVC Mark"
                width={30}
                height={30}
                className="w-full h-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-display font-bold text-sm tracking-tight text-[var(--ink)] block">
                  EVC Control
                </span>
                <span className="text-[10px] text-[var(--mute)] block">
                  Executive Suite
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-[var(--mute)] hover:text-[var(--ink)]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand text-white'
                    : 'text-[var(--ink)] hover:bg-[var(--surface2)] hover:text-brand'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge.variant === 'emerald'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {item.badge.text}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="space-y-3 pt-4 border-t border-[var(--line)]">
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--mute)] hover:text-brand transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Open Marketplace Storefront"
        >
          <ExternalLink className="w-4 h-4" />
          {!isCollapsed && <span>View Storefront</span>}
        </Link>

        {/* Collapse toggle (Desktop only) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-[var(--mute)] hover:bg-[var(--surface2)] hover:text-[var(--ink)] transition-colors text-xs"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 bottom-0 z-30 bg-[var(--surface)] border-r border-[var(--line)] transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 bg-[var(--surface)] border-r border-[var(--line)] z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
