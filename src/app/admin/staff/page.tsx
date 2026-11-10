'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  KeyRound,
  X,
  Phone,
  Mail,
  Building,
  Clock,
  Sparkles,
  ShoppingBag,
  Truck,
  Crown,
  Store,
  Lock,
} from 'lucide-react';
import {
  getAdminSession,
  AdminUser,
  AdminRole,
  StaffMember,
  formatAdminRole,
} from '@/lib/adminAuth';
import { useModal } from '@/context/ModalContext';

interface StaffStats {
  total: number;
  rolesCount: {
    super_admin: number;
    store_manager: number;
    dispatcher: number;
  };
  activeCount: number;
  suspendedCount: number;
}

export default function AdminStaffPage() {
  const { confirm } = useModal();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AdminRole>('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Invite modal form fields
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<AdminRole>('store_manager');
  const [newStaffDept, setNewStaffDept] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    temporaryPassword?: string;
  } | null>(null);

  useEffect(() => {
    setCurrentUser(getAdminSession());
  }, []);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/staff');
      if (res.ok) {
        const data = await res.json();
        if (data.staff && Array.isArray(data.staff)) {
          setStaffList(data.staff);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch staff members:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStaffName.trim(),
          email: newStaffEmail.trim(),
          phone: newStaffPhone.trim(),
          role: newStaffRole,
          department: newStaffDept.trim(),
          password: newStaffPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to provision staff member.');
      }

      setToast({ message: data.message || 'Staff member invited successfully!', type: 'success' });
      if (data.temporaryPassword) {
        setCreatedCredentials({
          email: newStaffEmail.trim(),
          temporaryPassword: data.temporaryPassword,
        });
      } else {
        setIsInviteModalOpen(false);
      }
      fetchStaff();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to create staff account.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (staffId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: staffId, status: nextStatus }),
      });
      if (res.ok) {
        setStaffList((prev) =>
          prev.map((s) => (s.id === staffId ? { ...s, status: nextStatus as any } : s))
        );
        setToast({ message: `Staff status changed to ${nextStatus}`, type: 'success' });
      }
    } catch {
      setToast({ message: 'Could not update staff status.', type: 'error' });
    }
  };

  const handleDeleteStaff = async (staff: StaffMember) => {
    const ok = await confirm({
      title: 'Revoke Staff Access',
      message: `Are you sure you want to revoke operations access for ${staff.name} (${staff.email})?`,
      confirmText: 'Revoke Access',
      variant: 'error',
    });

    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/staff?id=${staff.id}`, { method: 'DELETE' });
      if (res.ok) {
        setStaffList((prev) => prev.filter((s) => s.id !== staff.id));
        setToast({ message: `Access revoked for ${staff.name}`, type: 'success' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Unable to delete staff member.', type: 'error' });
    }
  };

  const filteredStaff = staffList.filter((s) => {
    if (roleFilter !== 'all' && s.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = s.name.toLowerCase().includes(q);
      const matchesEmail = s.email.toLowerCase().includes(q);
      const matchesDept = s.department?.toLowerCase().includes(q) || false;
      if (!matchesName && !matchesEmail && !matchesDept) return false;
    }
    return true;
  });

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Crown className="w-3 h-3 text-amber-400" /> Super Admin
          </span>
        );
      case 'store_manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand/15 text-brand border border-brand/30">
            <Store className="w-3 h-3 text-brand" /> Systems Manager
          </span>
        );
      case 'dispatcher':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Truck className="w-3 h-3 text-blue-400" /> Dispatcher
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            Operations Staff &amp; Role Access
          </h1>
          <p className="text-xs text-[var(--mute)] mt-1">
            Manage administrative personnel, regional hub dispatchers, and engineering access permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStaff}
            disabled={isLoading}
            className="btn-ghost text-xs py-2 px-3.5 border border-glow/25 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => {
              setCreatedCredentials(null);
              setIsInviteModalOpen(true);
            }}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-md"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Provision Staff</span>
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="underline hover:opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-[var(--mute)]">Total Personnel</span>
          <div className="text-xl font-bold font-display text-[var(--ink)] mt-1">{stats?.total || staffList.length}</div>
        </div>
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-amber-400">Super Admins</span>
          <div className="text-xl font-bold font-display text-amber-400 mt-1">{stats?.rolesCount.super_admin || 1}</div>
        </div>
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-brand">Systems &amp; Store Mgrs</span>
          <div className="text-xl font-bold font-display text-brand mt-1">{stats?.rolesCount.store_manager || 1}</div>
        </div>
        <div className="p-4 rounded-2xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
          <span className="text-xs text-blue-400">Hub Dispatchers</span>
          <div className="text-xl font-bold font-display text-blue-400 mt-1">{stats?.rolesCount.dispatcher || 1}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <input
            type="text"
            placeholder="Search staff by name, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full pl-9 text-xs"
          />
          <Search className="w-3.5 h-3.5 text-[var(--mute)] absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="input-field text-xs py-1.5"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="store_manager">Systems Manager</option>
            <option value="dispatcher">Hub Dispatcher</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-[var(--mute)] uppercase text-[10px] tracking-wider border-b border-glow/15">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department / Hub</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glow/10">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--mute)]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand mb-2" />
                    Loading staff directory...
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--mute)]">
                    No staff members found matching query.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-brand/15 border border-brand/30 flex items-center justify-center font-bold text-brand font-display">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="text-white block font-medium">{staff.name}</strong>
                          <span className="text-[11px] text-[var(--mute)]">{staff.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getRoleBadge(staff.role)}</td>
                    <td className="py-3.5 px-4 text-white">
                      {staff.department || 'Operations'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          staff.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            staff.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        />
                        {staff.status?.toUpperCase() || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(staff.id, staff.status || 'active')}
                          className="btn-ghost text-xs py-1 px-2.5 border border-glow/25 text-[var(--mute)] hover:text-white"
                        >
                          {staff.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        {staff.email !== 'admin@evcng.com' && (
                          <button
                            onClick={() => handleDeleteStaff(staff)}
                            className="p-1.5 text-[var(--mute)] hover:text-rose-400 transition-colors"
                            title="Revoke Access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Staff Modal */}
      {isInviteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => !isSubmitting && setIsInviteModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-glow/25 bg-[#03090a] p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-[var(--mute)] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-display text-xl font-bold text-white">
                Provision Operations Staff
              </h3>
              <p className="text-xs text-[var(--mute)] mt-1">
                Assign administrative privileges for inventory control or regional dispatch.
              </p>
            </div>

            {createdCredentials ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  Staff member provisioned successfully!
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-glow/25 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--mute)]">Email:</span>
                    <span className="font-mono text-white">{createdCredentials.email}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-glow/15">
                    <span className="text-[var(--mute)]">Temporary Password:</span>
                    <button
                      onClick={() => handleCopy(createdCredentials.temporaryPassword || '', 'tempPass')}
                      className="flex items-center gap-1 font-mono font-bold text-brand hover:underline"
                    >
                      <span>{createdCredentials.temporaryPassword}</span>
                      {copiedId === 'tempPass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="btn-primary w-full h-10 justify-center text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateStaff} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Kunle Alabi"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="input-field w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="k.alabi@evcng.com"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="input-field w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                    Operational Role *
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as AdminRole)}
                    className="input-field w-full text-xs font-medium"
                  >
                    <option value="store_manager">Operations &amp; Store Manager</option>
                    <option value="dispatcher">Regional Dispatcher (Ilorin / Ibadan / Abuja)</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)] mb-1">
                    Department / Regional Hub
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ilorin Regional Logistics"
                    value={newStaffDept}
                    onChange={(e) => setNewStaffDept(e.target.value)}
                    className="input-field w-full text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full h-11 justify-center text-xs shadow-xl active:scale-98 transition-all disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? 'Provisioning...' : 'Provision Staff Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}