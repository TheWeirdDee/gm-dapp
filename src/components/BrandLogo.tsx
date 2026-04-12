'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export default function BrandLogo({ className = '', size = 32 }: BrandLogoProps) {
  return (
    <div className={`flex items-center -space-x-1.5 ${className}`}>
      {/* Stylized G - Geometric Circular Arc */}
      <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-none stroke-white" style={{ strokeWidth: 16, strokeLinecap: 'butt' }}>
          <path d="M 80 35 A 40 40 0 1 0 80 65" />
          <path d="M 80 50 L 50 50" />
        </svg>
      </div>

      {/* Stylized M - Cellular / Network Dots */}
      <div style={{ width: size * 1.2, height: size }} className="relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 120 100" className="w-full h-full" style={{ opacity: 0.8 }}>
          {/* Top Left Node */}
          <circle cx="15" cy="25" r="10" fill="#22d3ee" />
          
          {/* Bottom Left Node + Connection */}
          <rect x="10" y="25" width="10" height="50" rx="5" fill="#22d3ee" />
          <circle cx="15" cy="75" r="10" fill="#22d3ee" />
          
          {/* Middle Connecting Bridge */}
          <path d="M 20 30 L 45 50" stroke="#22d3ee" strokeWidth="10" strokeLinecap="round" />
          <circle cx="50" cy="55" r="10" fill="#22d3ee" />
          
          {/* Top Right Node + Connection */}
          <path d="M 55 50 L 80 30" stroke="#22d3ee" strokeWidth="10" strokeLinecap="round" />
          <path d="M 80 30 L 80 50" stroke="#22d3ee" strokeWidth="10" strokeLinecap="round" />
          <circle cx="85" cy="25" r="10" fill="#22d3ee" />
          
          {/* Bottom Right Node */}
          <circle cx="85" cy="75" r="10" fill="#22d3ee" />
        </svg>
      </div>
    </div>
  );
}
