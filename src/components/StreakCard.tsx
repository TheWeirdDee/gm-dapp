'use client';

import { Flame } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

export default function StreakCard() {
  const { streak } = useSelector((state: RootState) => state.user);

  return (
    <div className="card group relative overflow-hidden flex flex-col items-center justify-center p-8 text-center transition-all bg-[#0A0A0A] border-[var(--color-border)] hover:border-orange-500/50">
      <div className="absolute -right-4 -bottom-4 opacity-5 transition-transform group-hover:scale-110 duration-700">
        <Flame className="h-32 w-32 text-orange-500" />
      </div>
      
      <div className="mb-4 rounded-2xl bg-orange-500/10 p-4 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
        <Flame className="h-10 w-10 text-orange-500" />
      </div>
      
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Current Streak</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black text-white">{streak || 0}</span>
        <span className="text-xl font-bold text-gray-600 italic">days</span>
      </div>
      
      <p className="mt-4 text-[var(--color-accent)] font-bold text-sm">
        {streak && streak > 7 ? 'You are on fire! 🔥' : 'Maintain your streak!'}
      </p>
    </div>
  );
}
