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
      {/* Header Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0047FF] via-[#4F46E5] to-[#7C3AED] rounded-[3.5rem] overflow-hidden p-10 md:p-16 text-left group shadow-[0_40px_100px_rgba(0,71,255,0.2)]">
        {/* Decorative Patterns */}
        
        {/* Left: Concentric Circles */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 opacity-20 pointer-events-none transition-transform group-hover:scale-110 duration-1000">
           <div className="absolute inset-0 border-[1.5rem] border-white rounded-full"></div>
           <div className="absolute inset-[3rem] border-[1rem] border-white rounded-full"></div>
           <div className="absolute inset-[6rem] border-[0.7rem] border-white rounded-full"></div>
           <div className="absolute inset-[9rem] border-[0.5rem] border-white rounded-full"></div>
        </div>

        {/* Right: Diagonal Stripes */}
        <div className="absolute -top-10 -right-10 w-64 h-64 opacity-20 rotate-45 pointer-events-none transition-transform group-hover:-translate-y-4 duration-1000"
             style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, white 50%)', backgroundSize: '20px 100%' }}>
        </div>
        
        {/* Top-right pattern (small dots/strips) */}
        <div className="absolute top-10 right-20 flex gap-2 opacity-30 pointer-events-none">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="w-1 h-8 bg-white/50 rounded-full"></div>
           ))}
        </div>

        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
             <Trophy className="h-4 w-4 text-yellow-300" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">The Global Stage</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
              The Hall <br/> of <span className="text-white/60">GM.</span>
            </h1>
            <p className="text-blue-100/70 max-w-lg font-medium text-lg leading-relaxed">
              Celebrating the most consistent and influential collectors in the Stacks ecosystem. 
              Only the elite thrive here.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
             <button className="bg-white text-[#0047FF] font-black px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-blue-50 transition-all active:scale-95 shadow-2xl">
                Get Active
                <Flame className="h-4 w-4" />
             </button>
             <button className="bg-transparent border-2 border-white/20 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/10 transition-all active:scale-95">
                View Rules
             </button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}

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
