'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, MessageSquare, HelpCircle, Zap, ShieldCheck } from 'lucide-react';
import { waLink } from '@/lib/utils';
import { CFG } from '@/lib/products';

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Where are your regional fulfillment centers located?',
      a: 'We operate fully stocked logistics hubs in Ilorin (Kwara State), Ibadan (Oyo State), and Abuja (FCT). Hub orders can be delivered doorstep within 24 to 48 hours or picked up directly from our premises.',
    },
    {
      q: 'Do you deliver heavy solar panels and inverters nationwide?',
      a: 'Yes! We ship heavy equipment, lithium powerwalls, and architectural finishes to all 36 states across Nigeria using reinforced wooden crating and tracked interstate logistics carriers.',
    },
    {
      q: 'How do I know what size inverter or battery I need?',
      a: 'You can reach our engineering team directly on WhatsApp with a list of your appliances (e.g. ACs, pumps, freezers, TVs, lighting). We will run a complete electrical load analysis and recommend the exact kW inverter and kWh lithium capacity required.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept instant online card/USSD payments via Paystack, direct corporate bank transfer to our Stanbic IBTC corporate account, or pay on delivery for verified residential/office deliveries within Ilorin, Ibadan, and Abuja.',
    },
    {
      q: 'Do you provide professional installation and commissioning?',
      a: 'Yes. EVC certified field engineers handle professional roof mounting, battery integration, earthing, surge protection, and telemetry setup across Kwara, Oyo, Lagos, and Abuja. You can add installation to any equipment order.',
    },
    {
      q: 'What warranty is provided with EVC products?',
      a: 'All our equipment is backed by manufacturer warranties: up to 10 years on lithium storage batteries, 25 years on Tier-1 monocrystalline solar panels, 2 years on hybrid inverters, and 1 year on smart biometric locks and smart accessories.',
    },
    {
      q: 'What if an item is damaged during transit?',
      a: 'Inspect your delivery upon arrival. If there is transit damage, document it and notify our dispatch officer on WhatsApp within 24 hours. We arrange immediate return and expedited replacement at no extra charge.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--mute)] mb-6">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-semibold">Help &amp; FAQ</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--ink)]">
          Frequently Asked <em className="serif-italic">Questions</em>
        </h1>
        <p className="text-xs sm:text-base text-[var(--mute)] max-w-lg mt-2">
          Everything you need to know about purchasing solar equipment, smart automation, delivery schedules, and warranties across Nigeria.
        </p>
      </div>

      {/* Accordion FAQ list */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-[var(--ink)] hover:text-brand transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-brand flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[var(--ink2)] leading-relaxed border-t border-glow/15 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help CTA */}
      <div className="mt-12 p-8 rounded-3xl border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand/15 text-brand flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-display text-xl font-bold text-[var(--ink)]">
          Still Have Questions About Your Power Sizing?
        </h3>
        <p className="text-xs sm:text-sm text-[var(--mute)] max-w-md mx-auto">
          Chat directly with our clean energy engineers on WhatsApp for a custom sizing audit and quote.
        </p>
        <a
          href={waLink('Hello EVC Nigeria, I have a question regarding solar sizing and equipment options.')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa inline-flex text-xs py-3 px-6 shadow-lg"
        >
          <MessageSquare className="w-4 h-4 mr-2" /> Chat with an Engineer
        </a>
      </div>
    </div>
  );
}