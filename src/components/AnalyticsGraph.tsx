'use client';

import { TrendingUp } from 'lucide-react';

export default function AnalyticsGraph() {
  const points = [
    { x: 0, y: 70 },
    { x: 10, y: 40 },
    { x: 20, y: 65 },
    { x: 30, y: 35 },
    { x: 40, y: 55 },
    { x: 50, y: 25 },
    { x: 60, y: 85 },
    { x: 70, y: 45 },
    { x: 80, y: 60 },
    { x: 90, y: 30 },
    { x: 100, y: 50 },
  ];

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Engagement Analytics</h3>
          <p className="text-gray-500 text-sm">Real-time GM activity over the last 30 days</p>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest">Monthly</span>
          <TrendingUp className="h-4 w-4 text-[var(--color-accent)]" />
        </div>
      </div>

      <div className="relative h-48 w-full mt-8">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => (
            <line 
              key={val} 
              x1="0" y1={val} x2="100" y2={val} 
              stroke="white" strokeOpacity="0.05" strokeWidth="0.5" 
            />
          ))}
          
          {/* Main Line */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-dash"
          />
          
          {/* Points */}
          {points.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} cy={p.y} r="1.5" 
              fill="white" 
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          ))}

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Data Markers */}
        <div className="absolute top-1/2 left-[60%] -translate-y-1/2 bg-white text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-2xl transition-transform group-hover:scale-110">
          Peak Active: 1.2k
        </div>
      </div>
    </div>
  );
}
