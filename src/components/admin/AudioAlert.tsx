'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, BellRing, Sparkles } from 'lucide-react';

const AUDIO_MUTE_KEY = 'evc_admin_sound_muted';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(AUDIO_MUTE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAudioMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUDIO_MUTE_KEY, String(muted));
  } catch {}
  window.dispatchEvent(new CustomEvent('evc:audio-mute-change', { detail: { muted } }));
}

export function playOrderChime(force = false): boolean {
  if (typeof window === 'undefined') return false;
  if (!force && isAudioMuted()) return false;

  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, now);
    masterGain.connect(ctx.destination);

    // Harmonic 1: 528 Hz (warm harmonic base)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(528, now);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.24, now + 0.035);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.9);

    // Harmonic 2: 660 Hz (Major 3rd overtone)
    const t2 = now + 0.08;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(660, t2);

    gain2.gain.setValueAtTime(0.0001, t2);
    gain2.gain.linearRampToValueAtTime(0.2, t2 + 0.035);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.95);

    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(t2);
    osc2.stop(t2 + 1.0);

    return true;
  } catch (err) {
    console.warn('Audio chime failed:', err);
    return false;
  }
}

interface AudioAlertProps {
  compact?: boolean;
  className?: string;
  showTestButton?: boolean;
}

export const AudioAlert: React.FC<AudioAlertProps> = ({
  compact = false,
  className = '',
  showTestButton = true,
}) => {
  const [muted, setMuted] = useState(false);
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    setMuted(isAudioMuted());

    const handleNewOrder = () => {
      setIsRinging(true);
      playOrderChime(false);
      setTimeout(() => setIsRinging(false), 1200);
    };

    const handleMuteChange = (e: Event) => {
      const custom = e as CustomEvent<{ muted: boolean }>;
      if (custom.detail) {
        setMuted(custom.detail.muted);
      }
    };

    window.addEventListener('evc:new-order', handleNewOrder);
    window.addEventListener('mc:new-order', handleNewOrder);
    window.addEventListener('evc:audio-mute-change', handleMuteChange as EventListener);

    return () => {
      window.removeEventListener('evc:new-order', handleNewOrder);
      window.removeEventListener('mc:new-order', handleNewOrder);
      window.removeEventListener('evc:audio-mute-change', handleMuteChange as EventListener);
    };
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
  }, [muted]);

  const handleTestChime = useCallback(() => {
    setIsRinging(true);
    playOrderChime(true);
    setTimeout(() => setIsRinging(false), 1200);
  }, []);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={toggleMute}
          title={muted ? 'Order sound alerts muted. Click to enable' : 'Order sound alerts active. Click to mute'}
          className={`p-2 rounded-xl transition-all ${
            muted
              ? 'text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--line)]/30'
              : 'text-brand hover:bg-brand/10'
          }`}
          aria-label={muted ? 'Unmute order audio' : 'Mute order audio'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {showTestButton && (
          <button
            type="button"
            onClick={handleTestChime}
            title="Preview order alert chime"
            className="text-[11px] font-medium text-[var(--ink2)] hover:text-brand px-2 py-1 rounded-lg hover:bg-[var(--line)]/20 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-brand" />
            <span>Test</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-xs backdrop-blur-md ${className}`}
    >
      <button
        type="button"
        onClick={toggleMute}
        className={`flex items-center gap-1.5 font-medium transition-colors ${
          muted ? 'text-[var(--mute)] hover:text-[var(--ink)]' : 'text-brand'
        }`}
        title={muted ? 'Unmute order alert' : 'Mute order alert'}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        <span className="hidden sm:inline">{muted ? 'Alerts Muted' : 'Audio Active'}</span>
      </button>

      {showTestButton && (
        <>
          <span className="w-px h-3.5 bg-[var(--line)]" />
          <button
            type="button"
            onClick={handleTestChime}
            className="inline-flex items-center gap-1 text-[var(--ink2)] hover:text-brand transition-colors font-medium"
          >
            <BellRing className={`w-3.5 h-3.5 ${isRinging ? 'animate-spin text-brand' : ''}`} />
            <span>Test Chime</span>
          </button>
        </>
      )}
    </div>
  );
};
