'use client';

import React, { useId } from 'react';
import { ArtType, ColorDef, ColorKey } from '@/types';
import { PAL } from '@/lib/products';

interface ProductArtProps {
  type: ArtType;
  color?: ColorKey;
  view?: 0 | 1 | 2 | 3 | 'bare';
  className?: string;
  ariaLabel?: string;
}

function lin(id: string, a: string, b: string, h?: boolean) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={h ? 1 : 0} y2={h ? 0 : 1}>
      <stop offset="0%" stopColor={a} />
      <stop offset="100%" stopColor={b} />
    </linearGradient>
  );
}

export const ProductArt: React.FC<ProductArtProps> = ({
  type,
  color = 'brand',
  view = 0,
  className = '',
  ariaLabel,
}) => {
  const reactId = useId().replace(/[:]/g, '');
  const c: ColorDef = PAL[color] || PAL.brand;
  const u = `${reactId}_${color}`;

  const renderShape = () => {
    switch (type) {
      // ----------------------------------------------------
      // SOLAR & CLEAN ENERGY
      // ----------------------------------------------------
      case 'solar-inverter':
        return (
          <>
            <defs>
              {lin('a' + u, '#1e293b', '#0f172a')}
              {lin('b' + u, c.light, c.main)}
            </defs>
            {/* Inverter Chassis */}
            <rect x="100" y="80" width="200" height="260" rx="20" fill={`url(#a${u})`} stroke={c.main} strokeWidth="3" />
            {/* Top Display Bezel */}
            <rect x="130" y="110" width="140" height="90" rx="10" fill="#03090a" stroke={c.light} strokeWidth="1.5" />
            {/* LCD Screen Glow & Telemetry */}
            <rect x="140" y="120" width="120" height="70" rx="6" fill="#0a1924" />
            <path d="M150 145 Q 170 130 190 150 T 230 135" fill="none" stroke={c.light} strokeWidth="3" strokeLinecap="round" />
            <circle cx="240" cy="135" r="3" fill="#10b981" />
            <text x="150" y="175" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">5.0 kW 230V</text>
            {/* Status LED Indicators */}
            <circle cx="160" cy="225" r="4" fill="#10b981" />
            <circle cx="185" cy="225" r="4" fill={c.main} />
            <circle cx="210" cy="225" r="4" fill="#f59e0b" />
            <circle cx="235" cy="225" r="4" fill="#3b82f6" />
            {/* Heat Sink Grill Lines */}
            <line x1="130" y1="260" x2="270" y2="260" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <line x1="130" y1="275" x2="270" y2="275" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <line x1="130" y1="290" x2="270" y2="290" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <line x1="130" y1="305" x2="270" y2="305" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          </>
        );

      case 'battery':
        return (
          <>
            <defs>
              {lin('bat' + u, '#1e293b', '#03090a')}
              {lin('lvl' + u, c.light, c.main)}
            </defs>
            {/* Battery Enclosure */}
            <rect x="110" y="70" width="180" height="270" rx="16" fill={`url(#bat${u})`} stroke="#334155" strokeWidth="3" />
            {/* Terminal Blocks */}
            <rect x="135" y="55" width="25" height="18" rx="4" fill="#ef4444" />
            <rect x="240" y="55" width="25" height="18" rx="4" fill="#0284c7" />
            {/* Brand Logo Accent Strip */}
            <rect x="130" y="95" width="140" height="6" rx="3" fill={c.main} />
            {/* SOC Battery Level Indicator Bar */}
            <rect x="130" y="125" width="140" height="110" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <rect x="140" y="140" width="120" height="18" rx="4" fill={`url(#lvl${u})`} />
            <rect x="140" y="165" width="120" height="18" rx="4" fill={`url(#lvl${u})`} />
            <rect x="140" y="190" width="120" height="18" rx="4" fill={`url(#lvl${u})`} />
            <rect x="140" y="215" width="90" height="12" rx="3" fill={c.light} />
            {/* Breaker Switch */}
            <rect x="180" y="260" width="40" height="40" rx="6" fill="#0a1219" stroke={c.main} strokeWidth="2" />
            <circle cx="200" cy="280" r="8" fill="#10b981" />
          </>
        );

      case 'solar-panel':
        return (
          <>
            <defs>
              {lin('pv' + u, '#0369a1', '#082f49')}
            </defs>
            {/* Outer Frame */}
            <polygon points="70,120 330,120 300,320 100,320" fill={`url(#pv${u})`} stroke="#94a3b8" strokeWidth="6" />
            {/* Photovoltaic Cell Grid Lines */}
            <line x1="135" y1="120" x2="150" y2="320" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="200" y1="120" x2="200" y2="320" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.7" />
            <line x1="265" y1="120" x2="250" y2="320" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="77" y1="170" x2="323" y2="170" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="85" y1="220" x2="315" y2="220" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="93" y1="270" x2="307" y2="270" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.7" />
            {/* Sun flare highlight */}
            <circle cx="280" cy="140" r="14" fill="#fbbf24" opacity="0.6" />
          </>
        );

      case 'solar-street-light':
        return (
          <>
            {/* Lamp Pole */}
            <line x1="170" y1="340" x2="200" y2="160" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
            {/* Angled Solar Panel */}
            <polygon points="170,130 260,110 250,150 160,170" fill="#0284c7" stroke="#cbd5e1" strokeWidth="2" />
            {/* LED Luminaire Body */}
            <path d="M200 160 Q 240 180 270 200 L 260 215 Q 230 195 195 175 Z" fill="#334155" />
            <ellipse cx="245" cy="195" rx="20" ry="10" fill="#fef08a" />
          </>
        );

      // ----------------------------------------------------
      // SMART TECH & AUTOMATION
      // ----------------------------------------------------
      case 'smart-lock':
        return (
          <>
            <defs>
              {lin('sl' + u, '#1e293b', '#03090a')}
            </defs>
            {/* Escutcheon Body */}
            <rect x="135" y="60" width="130" height="290" rx="26" fill={`url(#sl${u})`} stroke={c.main} strokeWidth="3" />
            {/* Facial Recognition Camera / Lens */}
            <circle cx="200" cy="95" r="16" fill="#03090a" stroke="#475569" strokeWidth="2" />
            <circle cx="200" cy="95" r="8" fill="#0284c7" />
            {/* Touch Keypad */}
            <g fill="#94a3b8" fontSize="12" fontFamily="sans-serif" textAnchor="middle">
              <circle cx="170" cy="140" r="8" fill="#0f172a" />
              <text x="170" y="144">1</text>
              <circle cx="200" cy="140" r="8" fill="#0f172a" />
              <text x="200" y="144">2</text>
              <circle cx="230" cy="140" r="8" fill="#0f172a" />
              <text x="230" y="144">3</text>
              <circle cx="170" cy="165" r="8" fill="#0f172a" />
              <text x="170" y="169">4</text>
              <circle cx="200" cy="165" r="8" fill="#0f172a" />
              <text x="200" y="169">5</text>
              <circle cx="230" cy="165" r="8" fill="#0f172a" />
              <text x="230" y="169">6</text>
            </g>
            {/* Smart Handle with Biometric Fingerprint Sensor */}
            <rect x="170" y="210" width="110" height="34" rx="17" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle cx="188" cy="227" r="10" fill="#03090a" stroke={c.light} strokeWidth="2" />
            {/* Lock Cylinder Ring */}
            <circle cx="200" cy="295" r="14" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <line x1="200" y1="290" x2="200" y2="300" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          </>
        );

      case 'smart-switch':
        return (
          <>
            <defs>
              {lin('sw' + u, '#0f172a', '#03090a')}
            </defs>
            {/* Glass Faceplate */}
            <rect x="90" y="90" width="220" height="220" rx="24" fill={`url(#sw${u})`} stroke={c.main} strokeWidth="3" />
            {/* Gang Touch Circles */}
            <g>
              <circle cx="145" cy="150" r="24" fill="#03090a" stroke={c.light} strokeWidth="2" />
              <circle cx="145" cy="150" r="6" fill={c.main} />

              <circle cx="255" cy="150" r="24" fill="#03090a" stroke="#334155" strokeWidth="2" />
              <circle cx="255" cy="150" r="6" fill="#64748b" />

              <circle cx="145" cy="250" r="24" fill="#03090a" stroke="#334155" strokeWidth="2" />
              <circle cx="145" cy="250" r="6" fill="#64748b" />

              <circle cx="255" cy="250" r="24" fill="#03090a" stroke={c.light} strokeWidth="2" />
              <circle cx="255" cy="250" r="6" fill={c.main} />
            </g>
            {/* Wi-Fi Indicator Emblem */}
            <path d="M190 115 A 15 15 0 0 1 210 115 M195 120 A 8 8 0 0 1 205 120 M200 125 A 1 1 0 0 1 200 126" stroke={c.light} strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        );

      case 'cctv':
        return (
          <>
            {/* Wall Mount Bracket */}
            <polygon points="80,180 130,160 130,240 80,220" fill="#334155" />
            <rect x="130" y="190" width="40" height="20" fill="#475569" />
            {/* Camera Dome / Bullet Body */}
            <ellipse cx="230" cy="200" rx="70" ry="40" fill="#1e293b" stroke={c.main} strokeWidth="2" />
            {/* Lens Hood & Glass */}
            <ellipse cx="275" cy="200" rx="20" ry="32" fill="#03090a" stroke="#64748b" strokeWidth="3" />
            <circle cx="275" cy="200" r="14" fill="#0284c7" />
            <circle cx="272" cy="197" r="4" fill="#ffffff" />
            {/* Status LED */}
            <circle cx="260" cy="175" r="3" fill="#ef4444" className="animate-pulse" />
          </>
        );

      case 'watch':
        return (
          <>
            <defs>
              {lin('w' + u, c.dark, c.deep)}
            </defs>
            {/* Straps */}
            <rect x="160" y="50" width="80" height="80" rx="10" fill={`url(#w${u})`} />
            <rect x="160" y="270" width="80" height="80" rx="10" fill={`url(#w${u})`} />
            {/* Watch Bezel */}
            <rect x="140" y="110" width="120" height="180" rx="30" fill="#0a1219" stroke={c.main} strokeWidth="4" />
            {/* Watch Screen Glass */}
            <rect x="150" y="125" width="100" height="150" rx="20" fill="#03090a" />
            {/* UI Display */}
            <text x="200" y="180" fill="#ffffff" fontSize="26" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">10:45</text>
            <text x="200" y="205" fill={c.light} fontSize="11" fontFamily="sans-serif" textAnchor="middle">EVC WATCH</text>
            <circle cx="200" cy="240" r="18" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="80 20" />
            <text x="200" y="244" fill="#10b981" fontSize="10" fontFamily="sans-serif" textAnchor="middle">84 bpm</text>
            {/* Digital Crown Knob */}
            <rect x="260" y="145" width="10" height="24" rx="4" fill={c.main} />
          </>
        );

      case 'earbuds':
        return (
          <>
            {/* Charging Case Body */}
            <rect x="120" y="120" width="160" height="150" rx="50" fill="#0a1219" stroke={c.main} strokeWidth="3" />
            {/* Lid Seam */}
            <line x1="120" y1="170" x2="280" y2="170" stroke="#334155" strokeWidth="2" />
            {/* LED Status Pip */}
            <circle cx="200" cy="210" r="4" fill={c.light} />
            {/* Floating Earbud Tip */}
            <path d="M220 80 Q 250 80 250 110 L 245 130 Q 235 135 230 110 Z" fill="#1e293b" stroke={c.main} strokeWidth="1.5" />
          </>
        );

      case 'ledpanel':
        return (
          <>
            {/* Creator LED Panel Frame */}
            <rect x="100" y="90" width="200" height="180" rx="14" fill="#0f172a" stroke={c.main} strokeWidth="3" />
            {/* LED Matrix Grid */}
            <rect x="115" y="105" width="170" height="150" rx="8" fill="#fef08a" opacity="0.9" />
            {/* Stand Mount */}
            <rect x="190" y="270" width="20" height="60" fill="#334155" />
            <ellipse cx="200" cy="330" rx="40" ry="10" fill="#1e293b" />
          </>
        );

      case 'tablet':
      case 'powerbank':
        return (
          <>
            <rect x="110" y="70" width="180" height="260" rx="16" fill="#0a1219" stroke={c.main} strokeWidth="3" />
            <rect x="125" y="85" width="150" height="230" rx="10" fill="#03090a" />
            <circle cx="200" cy="200" r="30" fill="none" stroke={c.light} strokeWidth="2" strokeDasharray="120 20" />
            <text x="200" y="206" fill="#ffffff" fontSize="16" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">100%</text>
          </>
        );

      // ----------------------------------------------------
      // ARCHITECTURAL FINISHES
      // ----------------------------------------------------
      case 'acoustic-panel':
        return (
          <>
            <defs>
              {lin('wood' + u, '#78350f', '#451a03')}
            </defs>
            {/* PET Felt Base (Black) */}
            <rect x="90" y="70" width="220" height="260" rx="8" fill="#03090a" stroke="#334155" strokeWidth="2" />
            {/* Natural Timber Slats */}
            <rect x="105" y="75" width="18" height="250" rx="3" fill={`url(#wood${u})`} />
            <rect x="135" y="75" width="18" height="250" rx="3" fill={`url(#wood${u})`} />
            <rect x="165" y="75" width="18" height="250" rx="3" fill={`url(#wood${u})`} />
            <rect x="195" y="75" width="18" height="250" rx="3" fill={`url(#wood${u})`} />
            <rect x="225" y="75" width="18" height="250" rx="3" fill={`url(#wood${u})`} />
            <rect x="255" y="75" width="18" height="250" rx="3" fill={`url(#wood${u})`} />
            <rect x="285" y="75" width="14" height="250" rx="3" fill={`url(#wood${u})`} />
          </>
        );

      case 'wall-panel':
        return (
          <>
            <rect x="90" y="80" width="220" height="240" rx="12" fill="#1e293b" stroke={c.main} strokeWidth="2" />
            {/* 3D Geometric Facets */}
            <polygon points="90,80 200,160 90,200" fill="#334155" />
            <polygon points="90,80 310,80 200,160" fill="#475569" />
            <polygon points="310,80 310,200 200,160" fill="#1e293b" />
            <polygon points="90,200 200,160 200,320 90,320" fill="#0f172a" />
            <polygon points="200,160 310,200 310,320 200,320" fill="#334155" />
          </>
        );

      case 'chandelier':
        return (
          <>
            {/* Ceiling Canopy & Suspension Wires */}
            <ellipse cx="200" cy="60" rx="30" ry="8" fill="#334155" />
            <line x1="185" y1="65" x2="150" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="215" y1="65" x2="250" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Outer LED Halo Ring */}
            <ellipse cx="200" cy="180" rx="90" ry="32" fill="none" stroke={c.main} strokeWidth="8" />
            <ellipse cx="200" cy="180" rx="90" ry="32" fill="none" stroke="#fef08a" strokeWidth="3" opacity="0.8" />
            {/* Inner Ring (Suspended at angle) */}
            <ellipse cx="200" cy="225" rx="60" ry="22" fill="none" stroke={c.main} strokeWidth="6" />
            <ellipse cx="200" cy="225" rx="60" ry="22" fill="none" stroke="#fef08a" strokeWidth="2" opacity="0.8" />
          </>
        );

      case 'downlight':
        return (
          <>
            <circle cx="200" cy="190" r="70" fill="#0a1219" stroke={c.main} strokeWidth="4" />
            <circle cx="200" cy="190" r="50" fill="#fef08a" />
            <circle cx="200" cy="190" r="30" fill="#ffffff" />
          </>
        );

      // ----------------------------------------------------
      // FURNITURE & WORKSPACE
      // ----------------------------------------------------
      case 'ergonomic-chair':
        return (
          <>
            {/* Mesh Backrest */}
            <path d="M165 70 Q 200 60 235 70 L 230 190 Q 200 200 170 190 Z" fill="#1e293b" stroke={c.main} strokeWidth="2.5" />
            {/* Lumbar Support Ring */}
            <ellipse cx="200" cy="165" rx="28" ry="12" fill="none" stroke={c.light} strokeWidth="2" />
            {/* Ergonomic Seat Cushion */}
            <path d="M150 205 Q 200 195 250 205 L 245 230 Q 200 240 155 230 Z" fill="#0f172a" stroke={c.main} strokeWidth="2" />
            {/* Armrests */}
            <rect x="135" y="165" width="20" height="8" rx="4" fill="#334155" />
            <rect x="245" y="165" width="20" height="8" rx="4" fill="#334155" />
            {/* Gas Lift Spindle */}
            <line x1="200" y1="235" x2="200" y2="290" stroke="#64748b" strokeWidth="6" />
            {/* 5-Star Caster Base */}
            <polygon points="200,290 140,325 170,335 200,300 230,335 260,325" fill="#334155" />
          </>
        );

      case 'executive-desk':
      case 'smart-console':
        return (
          <>
            {/* Desktop Surface */}
            <polygon points="90,140 310,140 280,200 120,200" fill="#1e293b" stroke={c.main} strokeWidth="3" />
            {/* Metal T-Legs */}
            <line x1="130" y1="200" x2="130" y2="320" stroke="#64748b" strokeWidth="8" />
            <line x1="110" y1="320" x2="160" y2="320" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
            <line x1="270" y1="200" x2="270" y2="320" stroke="#64748b" strokeWidth="8" />
            <line x1="250" y1="320" x2="290" y2="320" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          </>
        );

      // ----------------------------------------------------
      // LIVING & LIFESTYLE
      // ----------------------------------------------------
      case 'air-purifier':
        return (
          <>
            <defs>
              {lin('ap' + u, '#ffffff', '#e2e8f0')}
            </defs>
            {/* Tower Body */}
            <rect x="135" y="80" width="130" height="240" rx="28" fill={`url(#ap${u})`} stroke="#cbd5e1" strokeWidth="2" />
            {/* Top Outlet Vent */}
            <ellipse cx="200" cy="95" rx="45" ry="12" fill="#0f172a" />
            {/* Digital Air Quality Display Ring */}
            <circle cx="200" cy="140" r="18" fill="#03090a" stroke="#10b981" strokeWidth="3" />
            <text x="200" y="145" fill="#10b981" fontSize="10" fontFamily="sans-serif" textAnchor="middle">012</text>
            {/* 360-Degree Air Intake Micro-perforations */}
            <g fill="#94a3b8" opacity="0.6">
              <circle cx="160" cy="200" r="2.5" />
              <circle cx="180" cy="200" r="2.5" />
              <circle cx="200" cy="200" r="2.5" />
              <circle cx="220" cy="200" r="2.5" />
              <circle cx="240" cy="200" r="2.5" />
              <circle cx="160" cy="220" r="2.5" />
              <circle cx="180" cy="220" r="2.5" />
              <circle cx="200" cy="220" r="2.5" />
              <circle cx="220" cy="220" r="2.5" />
              <circle cx="240" cy="220" r="2.5" />
              <circle cx="160" cy="240" r="2.5" />
              <circle cx="180" cy="240" r="2.5" />
              <circle cx="200" cy="240" r="2.5" />
              <circle cx="220" cy="240" r="2.5" />
              <circle cx="240" cy="240" r="2.5" />
              <circle cx="160" cy="260" r="2.5" />
              <circle cx="180" cy="260" r="2.5" />
              <circle cx="200" cy="260" r="2.5" />
              <circle cx="220" cy="260" r="2.5" />
              <circle cx="240" cy="260" r="2.5" />
            </g>
          </>
        );

      case 'smart-diffuser':
      case 'smart-kettle':
        return (
          <>
            <path d="M150 280 C 140 180, 260 180, 250 280 Z" fill="#1e293b" stroke={c.main} strokeWidth="2.5" />
            {/* Ambient Mist Ring */}
            <path d="M195 160 Q 200 130 190 100 Q 210 120 205 160" fill={c.light} opacity="0.6" />
          </>
        );

      // EVC Real Estate, Land & Estates
      case 'estate':
      case 'land':
        return (
          <>
            <defs>
              {lin('a' + u, '#0a1924', '#03090a')}
              {lin('b' + u, c.light, c.main)}
            </defs>
            {/* Estate Perimeter / Land Plot Map */}
            <polygon points="200,90 320,160 280,310 120,310 80,160" fill={`url(#a${u})`} stroke={c.main} strokeWidth="3" />
            <polygon points="200,120 290,170 260,280 140,280 110,170" fill="none" stroke={c.light} strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Central Landmark / Geolocation Pin */}
            <path d="M200 150 C185 150 175 162 175 178 C175 200 200 225 200 225 C200 225 225 200 225 178 C225 162 215 150 200 150 Z" fill={`url(#b${u})`} />
            <circle cx="200" cy="175" r="7" fill="#03090a" />
            {/* Survey Grid & Compass */}
            <line x1="80" y1="230" x2="320" y2="230" stroke={c.main} strokeWidth="1" opacity="0.4" />
            <line x1="200" y1="90" x2="200" y2="310" stroke={c.main} strokeWidth="1" opacity="0.4" />
            <text x="200" y="270" fill={c.light} fontSize="13" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              VERIFIED C OF O PLOT
            </text>
          </>
        );

      case 'building':
        return (
          <>
            <defs>
              {lin('a' + u, '#1e293b', '#0a1628')}
              {lin('b' + u, c.light, c.main)}
            </defs>
            {/* Modern Residential Villa / Architectural Building */}
            <rect x="110" y="160" width="180" height="140" rx="8" fill={`url(#a${u})`} stroke={c.main} strokeWidth="2.5" />
            <polygon points="90,160 200,90 310,160" fill={c.main} opacity="0.9" />
            <rect x="140" y="190" width="40" height="40" rx="4" fill="#38bdf8" opacity="0.8" />
            <rect x="220" y="190" width="40" height="40" rx="4" fill="#38bdf8" opacity="0.8" />
            <rect x="175" y="240" width="50" height="60" rx="4" fill="#03090a" stroke={c.light} strokeWidth="1.5" />
            {/* Solar Roof Panels */}
            <polygon points="120,150 160,120 185,120 145,150" fill="#38bdf8" opacity="0.7" />
            <polygon points="150,150 190,120 215,120 175,150" fill="#38bdf8" opacity="0.7" />
          </>
        );

      case 'farmland':
        return (
          <>
            <defs>
              {lin('a' + u, '#14251a', '#03090a')}
            </defs>
            <rect x="90" y="100" width="220" height="200" rx="16" fill={`url(#a${u})`} stroke="#10b981" strokeWidth="2.5" />
            {/* Crop Contours */}
            <path d="M100 240 Q 200 200 300 240" stroke="#10b981" strokeWidth="3" fill="none" />
            <path d="M100 210 Q 200 170 300 210" stroke="#10b981" strokeWidth="2.5" fill="none" opacity="0.7" />
            <path d="M100 180 Q 200 140 300 180" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.5" />
            <circle cx="200" cy="140" r="20" fill="#f59e0b" opacity="0.8" />
            <text x="200" y="280" fill="#34d399" fontSize="12" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              EVC AGRO CITY
            </text>
          </>
        );

      case 'city':
        return (
          <>
            <rect x="100" y="150" width="50" height="150" fill="#0f172a" stroke={c.main} strokeWidth="2" />
            <rect x="160" y="110" width="80" height="190" fill="#1e293b" stroke={c.light} strokeWidth="2" />
            <rect x="250" y="170" width="50" height="130" fill="#0f172a" stroke={c.main} strokeWidth="2" />
            <circle cx="200" cy="90" r="4" fill="#ef4444" />
          </>
        );

      // Default Fallback
      default:
        return (
          <>
            <rect x="110" y="90" width="180" height="220" rx="20" fill="#0f172a" stroke={c.main} strokeWidth="3" />
            <circle cx="200" cy="200" r="40" fill={c.main} opacity="0.2" />
            <text x="200" y="206" fill={c.light} fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              EVC NIGERIA
            </text>
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 400 400"
      className={`w-full h-full select-none ${className}`}
      aria-label={ariaLabel || `${type} illustration`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderShape()}
    </svg>
  );
};
