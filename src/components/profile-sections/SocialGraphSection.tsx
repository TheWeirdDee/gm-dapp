'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Users, Search, MoreHorizontal, UserCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { MOCK_USERS } from '@/lib/mock-data';

export default function SocialGraphSection() {
  const { address, followers, following } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const [search, setSearch] = useState('');

  // Derive lists from real counts against mock data
  const allAddresses = Object.keys(MOCK_USERS);
  const followerAddresses = allAddresses.slice(0, followers);
  const followingAddresses = allAddresses.slice(0, following);
  const displayList = activeTab === 'followers' ? followerAddresses : followingAddresses;
  const displayCount = activeTab === 'followers' ? followers : following;

  const filtered = displayList.filter(addr => {
    const user = MOCK_USERS[addr];
    const q = search.toLowerCase();
    return !q || user?.username?.toLowerCase().includes(q) || addr.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-1000">

      {/* Stats Summary */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Social Graph</h3>
          <Link
            href="/followers"
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
          >
            Full View
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Followers', count: followers, tab: 'followers' as const },
            { label: 'Following', count: following, tab: 'following' as const },
          ].map(({ label, count, tab }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTab === tab
                  ? 'border-white/15 bg-white/5 ring-1 ring-white/10'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10'
              }`}
            >
              <p className={`text-2xl font-black mb-0.5 ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}>{count}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">{label}</p>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-700" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-white/20 transition-all"
          />
        </div>

        {/* List */}
        <div className="space-y-2">
          {displayCount === 0 ? (
            <div className="py-10 flex flex-col items-center gap-3 text-center">
              <div className="h-14 w-14 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-700" />
              </div>
              <p className="text-xs font-bold text-gray-600">
                {activeTab === 'followers' ? 'No followers yet' : 'Not following anyone'}
              </p>
              <Link href="/feed" className="text-[10px] font-black text-[var(--color-accent)] uppercase tracking-widest hover:underline">
                Explore Feed →
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-xs text-gray-700 py-6">No results for &ldquo;{search}&rdquo;</p>
          ) : (
            filtered.map((addr, i) => {
              const user = MOCK_USERS[addr] || { username: `${addr.substring(0, 8)}...`, streak: 0 };
              return (
                <div
                  key={addr}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] transition-all group"
                >
                  <Link href={`/profile/${addr}`} className="shrink-0">
                    <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/5 bg-black group-hover:border-white/20 transition-all">
                      <img src={`https://api.dicebear.com/7.x/builder/svg?seed=${addr}`} alt={user.username} />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{user.username}</p>
                    <p className="text-[10px] text-gray-600 font-mono truncate">{addr.substring(0, 12)}...</p>
                  </div>
                  {(user as any).streak > 0 && (
                    <span className="text-[10px] font-bold text-orange-500/70 shrink-0">🔥{(user as any).streak}d</span>
                  )}
                  <button className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 hover:bg-white/10 text-[10px] font-black text-gray-500 hover:text-white transition-all">
                    <UserCheck className="h-3 w-3" />
                    {activeTab === 'followers' ? 'Follow Back' : 'Connected'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {displayCount > 3 && (
          <div className="mt-4 pt-4 border-t border-white/[0.03] text-center">
            <Link href="/followers" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
              View all {displayCount} on the full page →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
