'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Check, ShieldCheck, MapPin, Calendar, FileCheck } from 'lucide-react';
import { money } from '@/lib/utils';

export const HowItWorksPhone: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stepsContainerRef.current) return;
    const stepElements = stepsContainerRef.current.querySelectorAll<HTMLElement>('.phone-step');
    if (!stepElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = Number(entry.target.getAttribute('data-step') || 0);
            setActiveStep(stepIndex);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    stepElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      title: 'Select Project & Choose Plot Size',
      desc: 'Browse master-planned estates across Ilorin, Ibadan, Epe, and Abeokuta. Select residential, commercial corridor, student housing, or agricultural hectare sizes.',
    },
    {
      title: 'Book a Free Guided Site Inspection',
      desc: 'Join our weekly inspection tours (every Tuesday, Thursday, and Saturday) from EVC Regional Hubs in Ilorin and Ibadan, or request a virtual video inspection.',
    },
    {
      title: 'Transparent Settlement & Deed Preparation',
      desc: 'Pay directly via official channels or structured milestone instalments. Our legal department drafts your Contract of Sale and Registered Deed of Assignment.',
    },
    {
      title: 'Physical Demarcation & Deed Dispatch',
      desc: 'Participate in physical corner-piece pegging on site and receive registered survey documents and deed package at your home or nearest EVC hub within 24 to 48 hours.',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
      {/* Pinned Sticky Phone */}
      <div className="sticky top-[80px] lg:top-28 z-20 flex flex-col items-center justify-center py-2 bg-[var(--bg)]/95 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none transition-all">
        <div
          className="w-full max-w-[300px] sm:max-w-[340px] rounded-[38px] sm:rounded-[44px] p-2.5 sm:p-3 bg-[#03090a] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl"
        >
          <div className="rounded-[30px] sm:rounded-[34px] overflow-hidden bg-[#0a1219] text-[#f8fafc] flex flex-col h-[350px] sm:h-[410px] lg:h-[450px] border border-white/10">
            {/* Phone Header */}
            <div className="flex items-center gap-3 p-4 bg-[#101c26] border-b border-white/10">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 flex items-center justify-center p-0.5">
                <Image
                  src="/images/evc-mark.png"
                  alt="EVC Mark"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <strong className="block font-medium text-sm text-white">EVC Property Advisory</strong>
                <small className="text-emerald-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Advisory Desk Active
                </small>
              </div>
            </div>

            {/* Simulated Chat Messages */}
            <div className="flex-1 p-4 flex flex-col justify-end gap-2.5 overflow-hidden bg-gradient-to-b from-[#0a1219] to-[#03090a]">
              {/* Message 1 (Step 0) */}
              <div className="self-end bg-brand text-white text-xs py-2 px-3.5 rounded-2xl rounded-br-sm max-w-[85%] animate-in fade-in slide-in-from-bottom-2">
                Hello! Is 500 SQM still available at Afonja Boulevard District 1?
              </div>
              <div className="self-start bg-[#182633] text-slate-200 text-xs py-2 px-3.5 rounded-2xl rounded-bl-sm max-w-[85%] border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                Yes! 500 SQM is available at {money(1800000)} with C of O in View. Free site inspection is this Thursday.
              </div>

              {/* Message 2 (Step 1) */}
              {activeStep >= 1 && (
                <>
                  <div className="self-end bg-brand text-white text-xs py-2 px-3.5 rounded-2xl rounded-br-sm max-w-[85%] animate-in fade-in slide-in-from-bottom-2">
                    Book inspection pickup for Thursday 10:00 AM from Fate Road Hub.
                  </div>
                  <div className="self-start bg-[#182633] text-slate-200 text-xs py-2 px-3.5 rounded-2xl rounded-bl-sm max-w-[85%] border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                    Confirmed! Chauffeur vehicle reserved. Chaperone: EVC Surveyor team.
                  </div>
                </>
              )}

              {/* Message 3 (Step 2) */}
              {activeStep >= 2 && (
                <div className="self-start bg-emerald-950/80 text-emerald-200 border border-emerald-700/60 text-xs py-2 px-3.5 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Allocation Letter &amp; Contract Drafted
                </div>
              )}

              {/* Message 4 (Step 3) */}
              {activeStep >= 3 && (
                <div className="self-start bg-sky-950/80 text-sky-200 border border-sky-700/60 text-xs py-2 px-3.5 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <FileCheck className="w-4 h-4 text-sky-400" /> Deed of Assignment Dispatched • Tracking Active
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Steps List on Right */}
      <div ref={stepsContainerRef} className="flex flex-col gap-12 py-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            data-step={idx}
            className={`phone-step p-6 rounded-3xl border transition-all duration-300 ${
              activeStep === idx
                ? 'border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-lg'
                : 'border-[var(--line)] bg-[var(--surface)] opacity-75'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
                0{idx + 1}
              </span>
              <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                {step.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--mute)] leading-relaxed pl-11">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
