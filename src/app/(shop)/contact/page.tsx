'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Zap, Building2 } from 'lucide-react';
import { CFG } from '@/lib/products';
import { waLink } from '@/lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: 'Solar & Clean Energy Consultation',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = `Hello EVC Nigeria, [${formData.topic}] from ${formData.name || 'Client'} (${formData.phone || 'Phone not specified'}): ${formData.message || 'I would like to inquire about your equipment and services.'}`;
    window.open(waLink(query), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--mute)] mb-6">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-semibold">Contact &amp; Hubs</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--ink)]">
          Speak with <em className="serif-italic">EVC Nigeria</em>
        </h1>
        <p className="text-xs sm:text-base text-[var(--mute)] max-w-lg mt-2">
          Reach our engineering consultants, request site energy audits, or track hardware consignments directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* WhatsApp Direct */}
          <a
            href={waLink('Hello EVC Nigeria! I would like to inquire about equipment and installation.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 hover:border-brand transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)]">
                WhatsApp Operations
              </span>
              <strong className="text-base font-semibold text-[var(--ink)] group-hover:text-brand transition-colors">
                {CFG.phoneDisp}
              </strong>
              <span className="block text-xs text-[var(--mute)] mt-0.5">Instant engineering response</span>
            </div>
          </a>

          {/* Email Support */}
          <a
            href={`mailto:${CFG.email}`}
            className="flex items-center gap-4 p-5 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 hover:border-brand transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand/15 text-brand flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)]">
                Corporate Inquiries &amp; Procurement
              </span>
              <strong className="text-base font-semibold text-[var(--ink)] group-hover:text-brand transition-colors">
                {CFG.email}
              </strong>
              <span className="block text-xs text-[var(--mute)] mt-0.5">RFQs &amp; corporate partnerships</span>
            </div>
          </a>

          {/* Operating Hours */}
          <div className="flex items-center gap-4 p-5 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--mute)]">
                Dispatch &amp; Operations
              </span>
              <strong className="text-base font-semibold text-[var(--ink)]">
                Monday – Saturday: 8:00 AM – 6:00 PM
              </strong>
              <span className="block text-xs text-[var(--mute)] mt-0.5">Emergency grid support 24/7 on WhatsApp</span>
            </div>
          </div>

          {/* Hub Locations */}
          <div className="p-6 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 space-y-4">
            <h4 className="font-display font-bold text-sm text-[var(--ink)] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand" /> Regional Fulfillment Centers
            </h4>
            <div className="space-y-3 divide-y divide-glow/15">
              {CFG.offices.map((office, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-3' : ''}>
                  <strong className="text-xs text-white block">{office.city} ({office.state})</strong>
                  <span className="text-xs text-[var(--mute)] leading-relaxed block">{office.address}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-xl">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)] mb-2">
            Send an Engineering Request
          </h3>
          <p className="text-xs sm:text-sm text-[var(--mute)] mb-6">
            Fill in your details below to route directly to our technical consultants on WhatsApp.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-1.5">
                Your Full Name / Company *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Babatunde Adeleke"
                className="input-field w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-1.5">
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 0801 234 5678"
                className="input-field w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-1.5">
                Inquiry Topic
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="input-field w-full text-sm font-medium"
              >
                <option value="Solar & Clean Energy Consultation">Solar &amp; Hybrid Inverter Sizing</option>
                <option value="Lithium Battery Storage Quote">Lithium Powerwall Storage Quote</option>
                <option value="Smart Living & Automation">Smart Biometric Locks &amp; IoT</option>
                <option value="Architectural Finishes & Lighting">Architectural Lighting &amp; Wall Panels</option>
                <option value="Consignment Tracking & Logistics">Consignment Dispatch Status</option>
                <option value="Corporate Partnership / RFQ">Corporate RFQ / Bulk Procurement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--mute)] mb-1.5">
                Your Project Description / Message
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your property, power loads, or specific hardware requirements..."
                className="input-field w-full text-sm"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full h-12 justify-center text-sm shadow-xl active:scale-98 transition-all"
            >
              <Send className="w-4 h-4 mr-2" /> Route Inquiry to WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}