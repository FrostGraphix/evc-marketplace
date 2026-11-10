'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger?: boolean;
}

export const ConfettiEffect: React.FC<ConfettiProps> = ({ trigger = true }) => {
  useEffect(() => {
    if (!trigger) return;

    const count = 180;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#f26522', '#ff7a33', '#f59e0b', '#ffffff', '#cbd5e1', '#0a1219'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 28,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [trigger]);

  return null;
};
