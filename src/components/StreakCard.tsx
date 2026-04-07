'use client';

import { Flame } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

export default function StreakCard() {
  const streak = useSelector((state: RootState) => state.user.currentUser.streak);

  return (
    <div className="card flex flex-col items-center justify-center p-6 text-center transition-transform hover:-translate-y-1">
      <div className="mb-4 rounded-full bg-orange-500/20 p-4">
        <Flame className="h-10 w-10 text-orange-500 shadow-orange-500/50 drop-shadow-md" />
      </div>
      <h3 className="text-xl font-medium text-gray-400">Current Streak</h3>
      <p className="mt-2 text-5xl font-black text-white">{streak} <span className="text-2xl font-semibold text-orange-500">Days</span></p>
      <p className="mt-3 text-sm text-[var(--color-accent)]">Keep it going! 🔥</p>
    </div>
  );
}
