'use client';

import { ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCardVerticalProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext: string;
  accentColor?: string;
}

export default function StatCardVertical({ label, value, icon: Icon, subtext, accentColor = 'var(--color-accent)' }: StatCardVerticalProps) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 transition-all shadow-xl">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6" style={{ color: accentColor }} />
        </div>
        <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors" />
      </div>
      
      <div>
        <h4 className="text-2xl font-black text-white">{value}</h4>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">{label}</p>
      </div>

      <p className="text-xs text-gray-600 font-medium">{subtext}</p>
      
      {/* Subtle indicator beam */}
      <div className="absolute top-0 right-0 w-[2px] h-full opacity-30 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: accentColor }}></div>
    </div>
  );
}
