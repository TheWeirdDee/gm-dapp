'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Users, UserCheck, UserPlus, MoreHorizontal } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';

type Tab = 'followers' | 'following';

export default function FollowersContent() {
  const { address, followers, following } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState<Tab>('followers');
  const [search, setSearch] = useState('');

  // Build the list: real followers first (from mock data), then empty state if none
  const allMockAddresses = Object.keys(MOCK_USERS);
  const followersAddresses = allMockAddresses.slice(0, followers); // use real follower count
  const followingAddresses = allMockAddresses.slice(0, following);

  const displayList = activeTab === 'followers' ? followersAddresses : followingAddresses;
  const filtered = displayList.filter(addr => {
    const user = MOCK_USERS[addr];
    return user?.username?.toLowerCase().includes(search.toLowerCase()) || addr.toLowerCase().includes(search.toLowerCase());
  });

  const displayCount = activeTab === 'followers' ? followers : following;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Network</h1>
          <p className="text-xs text-gray-600 font-mono truncate max-w-[200px]">{address}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-2xl mb-6">
        {([
          { id: 'followers', label: 'Followers', count: followers },
          { id: 'following', label: 'Following', count: following },
        ] as { id: Tab; label: string; count: number }[]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === tab.id ? 'bg-black/10' : 'bg-white/5'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/20 transition-all"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {displayCount === 0 ? (
          // True empty state — no followers yet
          <div className="py-20 flex flex-col items-center gap-5 text-center">
            <div className="h-20 w-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
              <Users className="h-9 w-9 text-gray-700" />
            </div>
            <div className="space-y-1">
              <p className="text-white font-bold text-base">
                {activeTab === 'followers' ? 'No followers yet' : 'Not following anyone'}
              </p>
              <p className="text-gray-600 text-sm font-medium">
                {activeTab === 'followers'
                  ? 'When someone follows you, they\'ll show up here.'
                  : 'Explore the feed and connect with other participants.'}
              </p>
            </div>
            <Link
              href="/feed"
              className="mt-2 px-6 py-3 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              Explore Feed
            </Link>
          </div>
        ) : filtered.length === 0 && search ? (
          <div className="py-16 text-center">
            <p className="text-gray-600 font-medium text-sm">No results for &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          filtered.map((addr, i) => {
            const user = MOCK_USERS[addr] || { username: `${addr.substring(0,8)}...`, points: 0, streak: 0 };
            return (
              <div
                key={addr}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] transition-all group animate-in fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Avatar */}
                <Link href={`/profile/${addr}`} className="shrink-0">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/5 bg-black group-hover:border-white/20 transition-all">
                    <img src={`https://api.dicebear.com/7.x/builder/svg?seed=${addr}`} alt={user.username} />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${addr}`} className="hover:underline">
                    <p className="text-sm font-bold text-white truncate">{user.username}</p>
                  </Link>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-gray-600 font-mono truncate">{addr.substring(0,10)}...</span>
                    {user.streak > 0 && (
                      <span className="text-[10px] font-bold text-orange-500/70">🔥 {user.streak}d</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white hover:text-black hover:border-transparent text-xs font-black uppercase tracking-widest text-gray-400 transition-all">
                    <UserCheck className="h-3.5 w-3.5" />
                    Connected
                  </button>
                  <button className="h-8 w-8 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-600 hover:text-white transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
