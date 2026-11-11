'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, Send } from 'lucide-react';
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
      label: 'Book Free Site Inspection',
      text: 'Hello EVC Nig. Ltd, I would like to schedule a physical site inspection (Tuesdays, Thursdays, Saturdays).',
    },
    {
      label: 'Land Title & Documentation',
      text: 'Hello EVC Nig. Ltd, I would like to verify title documentation (C of O / Survey) for your land parcels.',
    },
    {
      label: 'Installment & Payment Plans',
      text: 'Hello EVC Nig. Ltd, I would like details on your flexible installment plans for land and housing.',
    },
    {
      label: 'Broadway Residentials (Apartments)',
      text: 'Hello EVC Nig. Ltd, I would like to inquire about Broadway Residentials student apartments and bungalow units.',
    },
    {
      label: 'Idera Farm City (Agro)',
      text: 'Hello EVC Nig. Ltd, I am interested in farmland parcels at Idera Farm City, Iseyin.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = message.trim() || 'Hello EVC Nig. Ltd, I need assistance with a property inquiry.';
    window.open(waLink(textToSend), '_blank', 'noopener,noreferrer');
    setMessage('');
  };

  return (
    <div className="waf-container fixed right-4 sm:right-6 bottom-[calc(20px+env(safe-area-inset-bottom,0px))] z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="pointer-events-auto w-[min(360px,calc(100vw-32px))] rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--line)] shadow-2xl animate-in zoom-in-95 origin-bottom-right duration-200">
          <div className="flex flex-col">
            {/* Header (EVC Colors & Single Logo Mark) */}
            <div className="bg-gradient-to-r from-[#f26522] via-[#ff7a33] to-[#c24912] p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full bg-[#03090a] border border-white/20 p-1.5 flex items-center justify-center shadow flex-shrink-0">
                  <Image
                    src="/images/evc-mark.png"
                    alt="EVC Nig. Ltd Mark"
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#f26522]" />
                </div>
                <div>
                  <strong className="block text-sm leading-tight font-bold text-white">EVC Nig. Ltd Desk</strong>
                  <small className="text-[11px] text-orange-100 font-medium">
                    Online &bull; Ilorin &amp; Ibadan Desk
                  </small>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="p-4 bg-[var(--surface2)] flex flex-col gap-3 max-h-[300px] overflow-y-auto">
              <div className="bg-[var(--surface)] p-3.5 rounded-2xl rounded-tl-sm text-xs shadow-sm max-w-[90%] border border-[var(--line)] text-[var(--ink)] leading-relaxed">
                <p>
                  Welcome to EVC Nig. Ltd. How can we support your land acquisition, site inspection, or housing investment today?
                </p>
                <span className="block text-[10px] text-[var(--mute)] text-right mt-1.5">now</span>
              </div>

              {/* Quick Action Real Estate Prompts */}
              <div className="flex flex-col gap-1.5 items-start pt-1">
                {quickPrompts.map((prompt, idx) => (
                  <a
                    key={idx}
                    href={waLink(prompt.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-brand/30 bg-[var(--surface)] text-[var(--ink)] hover:bg-brand hover:text-white hover:border-brand transition-all shadow-sm"
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
                placeholder="Type your property inquiry..."
                className="flex-1 bg-[var(--surface2)] text-xs h-10 px-4 rounded-full border border-[var(--line)] outline-none focus:border-brand text-[var(--ink)] placeholder:text-[var(--mute)] font-medium"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-brand hover:bg-brand-deep text-white flex items-center justify-center transition-colors flex-shrink-0 shadow active:scale-95"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button (EVC Brand Colors & Single Mark) */}
      <div className="pointer-events-auto relative flex items-center gap-3">
        {!isOpen && (
          <span className="hidden sm:inline-block px-3.5 py-1.5 rounded-full bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] shadow-lg text-xs font-semibold">
            Inquire with EVC (+234 708 293 8870)
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#f26522] to-[#c24912] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20"
          aria-label="Contact EVC Nig. Ltd"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform rotate-0 hover:rotate-90" />
          ) : (
            <div className="relative w-7 h-7 flex items-center justify-center">
              <Image
                src="/images/evc-mark.png"
                alt="EVC Mark"
                width={28}
                height={28}
                className="object-contain drop-shadow"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#c24912]" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
