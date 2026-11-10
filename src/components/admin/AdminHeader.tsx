'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Clock,
  ShoppingBag,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import {
  getAdminSession,
  clearAdminSession,
  isStoreOpen,
  setStoreOpen,
  AdminUser,
} from '@/lib/adminAuth';
import { AudioAlert } from './AudioAlert';
import { useTheme } from '@/context/ThemeContext';

interface AdminHeaderProps {
  user?: AdminUser | null;
  onToggleMobileMenu?: () => void;
  onOpenSearch?: () => void;
}

interface StoreNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'order' | 'stock' | 'payment' | 'dispatch';
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: StoreNotification[] = [
  {
    id: 'n1',
    title: 'New Order #EVC-1082',
    desc: 'Engr. Bello placed order for 5kW Pure Sine Wave Inverter (₦485,000)',
    time: '2m ago',
    type: 'order',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Low Stock Alert',
    desc: 'LiFePO4 5.12kWh Lithium Battery (3 units left in Ilorin Hub)',
    time: '18m ago',
    type: 'stock',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Payment Settlement Confirmed',
    desc: 'Corporate transfer confirmed for invoice #EVC-1079',
    time: '45m ago',
    type: 'payment',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Regional Fleet Dispatched',
    desc: 'Courier vehicle departed Ibadan facility towards Bodija site batch',
    time: '2h ago',
    type: 'dispatch',
    unread: false,
  },
];

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  onToggleMobileMenu,
  onOpenSearch,
}) => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(user || null);
  const [storeActive, setStoreActive] = useState<boolean>(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<StoreNotification[]>(INITIAL_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUser(getAdminSession());
    setStoreActive(isStoreOpen());

    const handleAuth = (e: any) => {
      setCurrentUser(e?.detail?.user ?? getAdminSession());
    };
    const handleStoreStatus = (e: any) => {
      setStoreActive(e?.detail?.isOpen ?? isStoreOpen());
    };

    window.addEventListener('evc:admin-auth', handleAuth);
    window.addEventListener('mc:admin-auth', handleAuth);
    window.addEventListener('evc:store-status', handleStoreStatus);
    window.addEventListener('mc:store-status', handleStoreStatus);

    return () => {
      window.removeEventListener('evc:admin-auth', handleAuth);
      window.removeEventListener('mc:admin-auth', handleAuth);
      window.removeEventListener('evc:store-status', handleStoreStatus);
      window.removeEventListener('mc:store-status', handleStoreStatus);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleStoreStatus = () => {
    const next = !storeActive;
    setStoreActive(next);
    setStoreOpen(next);
  };

  const handleSignOut = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-20 h-16 bg-[var(--surface)] border-b border-[var(--line)] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--surface2)]"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Store Active Toggle */}
        <button
          onClick={handleToggleStoreStatus}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            storeActive
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
          }`}
          title="Click to toggle marketplace live operational status"
        >
          <span className={`w-2 h-2 rounded-full ${storeActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span>{storeActive ? 'Marketplace Live' : 'Marketplace Paused'}</span>
        </button>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Procedural Audio Chime Alert */}
        <AudioAlert compact={true} />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl border border-[var(--line)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--surface2)]"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative w-9 h-9 rounded-xl border border-[var(--line)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--surface2)]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--line)] mb-2 px-2">
                <span className="text-xs font-bold text-[var(--ink)]">Store Notifications</span>
                <span className="text-[10px] text-brand font-semibold">{unreadCount} unread</span>
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      n.unread
                        ? 'bg-[var(--surface2)] border-brand/20'
                        : 'border-transparent hover:bg-[var(--surface2)]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--ink)]">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[var(--mute)] font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[var(--mute)] mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Staff User Avatar & Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full border border-[var(--line)] bg-[var(--surface2)] hover:border-brand/40 transition-all"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-brand text-white text-xs font-bold flex items-center justify-center">
              {currentUser?.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              ) : (
                'EVC'
              )}
            </div>
            <span className="text-xs font-semibold max-w-[85px] truncate hidden sm:inline text-[var(--ink)]">
              {currentUser?.name || 'Administrator'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--mute)]" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 border-b border-[var(--line)] mb-1">
                <span className="block text-xs font-bold text-[var(--ink)] truncate">
                  {currentUser?.name || 'Executive Staff'}
                </span>
                <span className="block text-[11px] text-[var(--mute)] truncate">
                  {currentUser?.email || 'admin@evcng.com'}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
