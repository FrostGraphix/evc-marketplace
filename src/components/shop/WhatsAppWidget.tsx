'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send } from 'lucide-react';
import { CFG } from '@/lib/products';
import { waLink } from '@/lib/utils';

export const WhatsAppWidget: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickPrompts = [
    {
      label: 'Ask about Solar Inverter',
      text: 'Hello EVC Nigeria, I would like to inquire about your hybrid solar inverter setups.',
    },
    {
      label: 'Delivery & Site Installation',
      text: 'Hello EVC Nigeria, do you provide site delivery and installation in my state?',
    },
    {
      label: 'Request Official Quote',
      text: 'Hello EVC Nigeria, I would like to request an official bill of quantities / invoice.',
    },
    {
      label: 'Smart Automation Consultation',
      text: 'Hello EVC Nigeria, I need consultation on smart locks, switches, and architectural finishes.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = message.trim() || 'Hello EVC Nigeria, I need assistance with an order.';
    window.open(waLink(textToSend), '_blank', 'noopener,noreferrer');
    setMessage('');
  };

  return (
    <div className="waf-container fixed right-4 sm:right-6 bottom-[calc(20px+env(safe-area-inset-bottom,0px))] z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div
          className="pointer-events-auto w-[min(360px,calc(100vw-32px))] rounded-3xl overflow-hidden bg-[var(--surface)] border border-glow/25 bg-gradient-to-br from-glow/20 to-brand/10 shadow-2xl animate-in zoom-in-95 origin-bottom-right duration-200"
        >
          <div className="bg-[var(--surface)]/95 flex flex-col">
            {/* Header */}
            <div className="bg-wa p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-white text-wa-dark flex items-center justify-center font-extrabold text-sm shadow">
                  EVC
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-wa" />
                </div>
                <div>
                  <strong className="block text-sm leading-tight">EVC Nigeria Desk</strong>
                  <small className="text-[11px] text-green-100">
                    Online &bull; Ilorin, Ibadan & Abuja
                  </small>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Close WhatsApp chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="p-4 bg-[var(--surface2)] flex flex-col gap-3 max-h-[280px] overflow-y-auto">
              <div className="bg-[var(--surface)] p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm max-w-[90%] border border-[var(--line)] text-[var(--ink)]">
                <p>
                  Welcome to EVC Nigeria. How can we support your energy, smart automation, or architectural project today?
                </p>
                <span className="block text-[10px] text-[var(--mute)] text-right mt-1">now</span>
              </div>

              {/* Quick action buttons */}
              <div className="flex flex-col gap-1.5 items-start">
                {quickPrompts.map((prompt, idx) => (
                  <a
                    key={idx}
                    href={waLink(prompt.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-wa/30 bg-[var(--surface)] text-wa-dark hover:bg-wa hover:text-white transition-all shadow-sm"
                  >
                    {prompt.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-[var(--surface)] border-t border-[var(--line)] flex gap-2 items-center"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your inquiry..."
                className="flex-1 bg-[var(--surface2)] text-xs h-10 px-4 rounded-full border border-[var(--line)] outline-none focus:border-wa text-[var(--ink)] placeholder:text-[var(--mute)]"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-wa text-white flex items-center justify-center hover:bg-wa-dark transition-colors flex-shrink-0"
                aria-label="Send WhatsApp message"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="pointer-events-auto relative flex items-center gap-3">
        {!isOpen && (
          <span className="hidden sm:inline-block px-3.5 py-1.5 rounded-full bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] shadow-lg text-xs font-semibold">
            Inquire on WhatsApp (+234 708 293 8870)
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-wa text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Chat on WhatsApp"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform rotate-0 hover:rotate-90" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};
