'use client';

import { Trophy, Flame, Star, Medal } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardUser {
  address: string;
  username: string;
  avatar: string;
  streak: number;
  points: number;
}

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  type: 'streak' | 'points';
}

export default function LeaderboardTable({ users, type }: LeaderboardTableProps) {
  return (
    <div className="card overflow-hidden">
      <div className="bg-white/5 p-4 flex items-center gap-2 border-b border-[var(--color-border)]">
        {type === 'streak' ? <Flame className="text-orange-500" /> : <Star className="text-yellow-500" />}
        <h2 className="text-lg font-bold">Top {type === 'streak' ? 'Streaks' : 'Points'}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-black/20 text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold w-16">Rank</th>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold text-right">
                {type === 'streak' ? 'Consecutive GMs' : 'Total Points'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {users.map((user, index) => (
              <tr key={user.address} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black/40 font-bold">
                    {index === 0 ? <Medal className="h-5 w-5 text-yellow-500" /> : 
                     index === 1 ? <Medal className="h-5 w-5 text-gray-300" /> : 
                     index === 2 ? <Medal className="h-5 w-5 text-amber-700" /> : 
                     `#${index + 1}`}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/profile/${user.address}`} className="flex items-center gap-3">
                    <img src={user.avatar} alt="avatar" className="h-10 w-10 rounded-full bg-gray-800" />
                    <div>
                      <div className="font-medium text-white group-hover:text-[var(--color-accent)] transition-colors">
                        {user.username}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-right font-bold text-lg">
                  {type === 'streak' ? (
                    <span className="text-orange-500">{user.streak} <span className="text-sm font-normal">🔥</span></span>
                  ) : (
                    <span className="text-yellow-500">{user.points.toLocaleString()} <span className="text-sm font-normal">⭐</span></span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
