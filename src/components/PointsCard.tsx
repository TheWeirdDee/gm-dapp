'use client';

import { Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

export default function PointsCard() {
  const { points } = useSelector((state: RootState) => state.user);

  return (
    <div className="card group relative overflow-hidden flex flex-col items-center justify-center p-8 text-center transition-all bg-[#0A0A0A] border-[var(--color-border)] hover:border-yellow-500/50">
      <div className="absolute -right-4 -bottom-4 opacity-5 transition-transform group-hover:scale-110 duration-700">
        <Star className="h-32 w-32 text-yellow-500" />
      </div>

      <div className="mb-4 rounded-2xl bg-yellow-500/10 p-4 border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
        <Star className="h-10 w-10 text-yellow-500" />
      </div>

      <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Total Points</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black text-white">{(points || 0).toLocaleString()}</span>
      </div>
      
      <p className="mt-4 text-gray-500 text-sm font-medium">Rank #1,240 globally</p>
    </div>
  );
}
