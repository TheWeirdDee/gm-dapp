'use client';

import { Trophy, Flame, Star, Medal, ArrowUpRight, Crown, Circle } from 'lucide-react';
import Link from 'next/link';
import IdentityAvatar from './IdentityAvatar';

// Helper for Nested Star Icon (Diamond Dev)
const NestedStar = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <Star className="h-5 w-5 fill-current opacity-20" />
    <Star className="h-3 w-3 fill-current absolute opacity-50" />
    <Star className="h-1.5 w-1.5 fill-current absolute" />
  </div>
);

// Helper for Vanguard Icon - 4 hollow concentric rings matching reference
const NestedCircle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.2" />
    <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.4" />
    <circle cx="50" cy="50" r="19" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.7" />
    <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="8" />
  </svg>
);

interface LeaderboardUser {
  address: string;
  username: string;
  avatar?: string;
  streak: number;
  points: number;
  isPro?: boolean;
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
              const rankLevel = index + 4; // Because users prop starts from rank 4
              
              const getTierColor = (r: number) => {
                if (r <= 10) return 'text-slate-300';
                if (r <= 50) return 'text-cyan-400';
                return 'text-blue-500';
              };

              const getTierIcon = (r: number) => {
                if (r <= 10) return <Trophy className="h-4 w-4" />;
                if (r <= 50) return <NestedStar className="h-4 w-4" />;
                return <NestedCircle className="h-4 w-4" />;
              };

              const rowColor = getTierColor(rankLevel);
              
              return (
                <tr key={user.address} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className={`flex items-center gap-3 font-black text-sm ${rowColor} bg-white/[0.02] w-fit px-3 py-1 rounded-lg border border-white/5`}>
                      {getTierIcon(rankLevel)}
                      <span className="opacity-50">#{rankLevel.toString().padStart(2, '0')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <Link href={`/profile/${user.address}`} className="flex items-center gap-4 group/user">
                      <IdentityAvatar address={user.address} src={user.avatar} size="md" className="!rounded-2xl" />
                      <div>
                        <div className="font-bold text-white flex items-center gap-2 group-hover/user:text-[var(--color-accent)] transition-colors">
                          {user.username || `user_${user.address.substring(user.address.length - 4)}`}
                          {user.isPro && <Crown className="h-4 w-4 text-white fill-white/20" />}
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
