'use client';

import { Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

export default function PointsCard() {
  const points = useSelector((state: RootState) => state.user.currentUser.points);

  return (
    <div className="card flex flex-col items-center justify-center p-6 text-center transition-transform hover:-translate-y-1">
      <div className="mb-4 rounded-full bg-yellow-500/20 p-4">
        <Star className="h-10 w-10 text-yellow-500 shadow-yellow-500/50 drop-shadow-md" />
      </div>
      <h3 className="text-xl font-medium text-gray-400">Reputation</h3>
      <p className="mt-2 text-5xl font-black text-white">{points.toLocaleString()} <span className="text-2xl font-semibold text-yellow-500">Pts</span></p>
      <div className="mt-4 w-full rounded-full bg-gray-800 h-2">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2 rounded-full" style={{ width: '70%' }}></div>
      </div>
    </div>
  );
}
