'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAdminSession, AdminUser } from '@/lib/adminAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AudioAlert } from '@/components/admin/AudioAlert';
import { Loader2, ShieldCheck, Zap } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState<AdminUser | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // If on the login portal, no verification needed
    if (isLoginPage) {
      setIsVerifying(false);
      return;
    }

    // Check active session
    const currentSession = getAdminSession();

    if (!currentSession) {
      setIsVerifying(true);
      router.replace('/admin/login');
      return;
    }

    setSession(currentSession);
    setIsVerifying(false);

    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<{ user: AdminUser | null }>;
      const nextUser = custom.detail?.user;
      if (!nextUser && !isLoginPage) {
        setSession(null);
        setIsVerifying(true);
        router.replace('/admin/login');
      } else {
        setSession(nextUser || null);
      }
    };

    window.addEventListener('evc:admin-auth', handleAuthChange as EventListener);
    return () => {
      window.removeEventListener('evc:admin-auth', handleAuthChange as EventListener);
    };
  }, [pathname, isLoginPage, router]);

  // Clean presentation without layout frame on the login portal
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while verifying admin authentication
  if (isVerifying || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#03090a] text-[var(--ink)]">
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex items-center justify-center text-brand shadow-xl">
            <Zap className="w-7 h-7 animate-pulse" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-brand absolute -bottom-2 -right-2" />
        </div>
        <h3 className="font-display font-bold text-lg text-white">Securing Operations Session</h3>
        <p className="text-xs text-[var(--mute)] mt-1">Authenticating EVC Nig. Ltd Command Node...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#03090a] text-[var(--ink)] antialiased selection:bg-brand/20">
      {/* Background Audio Alert procedural synthesizer */}
      <div className="hidden" aria-hidden="true">
        <AudioAlert showTestButton={false} />
      </div>

      {/* Desktop / Mobile Admin Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <AdminHeader
          user={session}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}