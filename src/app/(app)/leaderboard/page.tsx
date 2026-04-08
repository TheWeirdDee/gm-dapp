'use client';

import LeaderboardTable from '@/components/LeaderboardTable';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useState } from 'react';
import { Trophy, Flame, Star, Target } from 'lucide-react';
import { MOCK_USERS, User } from '@/lib/mock-data';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'streak' | 'points'>('streak');
  
  // Convert map to array
  const usersArray: User[] = Object.values(MOCK_USERS);
  
  // Sort for Top Streaks
  const topStreaks = [...usersArray].sort((a, b) => b.streak - a.streak).slice(0, 50);
  
  // Sort for Top Points
  const topPoints = [...usersArray].sort((a, b) => b.points - a.points).slice(0, 50);

  const tabs = [
    { id: 'streak', name: 'Top Streaks', icon: Flame, color: 'text-orange-500' },
    { id: 'points', name: 'Global Reputation', icon: Star, color: 'text-yellow-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 mb-2">
           <Trophy className="h-4 w-4 text-yellow-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Global Rankings</span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter">The Hall of GM</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-medium">
          The most consistent and influential collectors in the Stacks ecosystem. 
          Build your streak to rise.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl text-center">
           <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Total Participants</div>
           <div className="text-3xl font-black text-white">{usersArray.length}</div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl text-center">
           <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Max Streak</div>
           <div className="text-3xl font-black text-orange-500">{topStreaks[0]?.streak || 0}</div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl text-center">
           <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Total Power</div>
           <div className="text-3xl font-black text-yellow-500">{(usersArray.reduce((acc, u) => acc + u.points, 0) / 1000).toFixed(1)}K</div>
        </div>
      </div>

      {/* Tab Interface */}
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4 bg-white/[0.02] p-2 rounded-2xl border border-white/5 w-fit mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-black transition-all ${
                  isActive 
                    ? 'bg-white text-black shadow-2xl scale-105' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? tab.color : ''}`} />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
           <LeaderboardTable 
             users={activeTab === 'streak' ? topStreaks : topPoints} 
             type={activeTab} 
           />
        </div>
      </div>

      <div className="text-center py-10">
         <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.02] border border-white/5 grayscale opacity-50">
            <Target className="h-4 w-4 text-gray-600" />
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Snapshot taken {new Date().toLocaleDateString()}</span>
         </div>
      </div>
    </div>
  );
}
