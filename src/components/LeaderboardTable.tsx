'use client';

import { Trophy, Flame, Star, Medal, ArrowUpRight } from 'lucide-react';
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
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-white/[0.03]">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Rank</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Collector</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 text-right">
                {type === 'streak' ? 'Streak' : 'Reputation'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {users.map((user, index) => {
              const isTop3 = index < 3;
              const rankColor = index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-700';
              
              return (
                <tr key={user.address} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className={`flex items-center gap-3 font-black text-lg ${rankColor}`}>
                      {index === 0 ? <Trophy className="h-5 w-5" /> : 
                       index === 1 ? <Medal className="h-5 w-5" /> : 
                       index === 2 ? <Medal className="h-5 w-5" /> : 
                       <span className="text-gray-800 ml-1">#{(index + 1).toString().padStart(2, '0')}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <Link href={`/profile/${user.address}`} className="flex items-center gap-4 group/user">
                      <div className="h-11 w-11 rounded-2xl overflow-hidden bg-white/5 border border-white/5 group-hover/user:border-[var(--color-accent)]/50 transition-colors">
                        <img src={`https://api.dicebear.com/7.x/builder/svg?seed=${user.address}`} alt="avatar" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5 group-hover/user:text-[var(--color-accent)] transition-colors">
                          {user.username || `user_${user.address.substring(user.address.length - 4)}`}
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover/user:opacity-100 transition-all" />
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono tracking-tighter uppercase">
                          {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-8 py-5 text-right font-black">
                    {type === 'streak' ? (
                      <div className="flex items-center justify-end gap-2 text-xl text-orange-500">
                        {user.streak}
                        <Flame className="h-4 w-4 fill-orange-500/20" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2 text-xl text-yellow-500">
                        {user.points.toLocaleString()}
                        <Star className="h-4 w-4 fill-yellow-500/20" />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
