'use client';

import LeaderboardTable from '@/components/LeaderboardTable';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

export default function LeaderboardPage() {
  const allUsers = useSelector((state: RootState) => state.user.allUsers);
  
  // Convert map to array
  const usersArray = Object.values(allUsers);
  
  // Sort for Top Streaks
  const topStreaks = [...usersArray].sort((a, b) => b.streak - a.streak).slice(0, 10);
  
  // Sort for Top Points
  const topPoints = [...usersArray].sort((a, b) => b.points - a.points).slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-black text-white mb-4">Global Leaderboard</h1>
        <p className="text-gray-400 text-lg">
          Compete on-chain. Build the longest streak and earn the highest reputation in the ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <LeaderboardTable users={topStreaks} type="streak" />
        </div>
        <div>
          <LeaderboardTable users={topPoints} type="points" />
        </div>
      </div>
    </div>
  );
}
