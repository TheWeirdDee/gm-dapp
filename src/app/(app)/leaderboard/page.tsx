'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';
import { 
  Loader2, 
  Trophy, 
  Flame, 
  Star, 
  Target, 
  Crown, 
  Circle, 
  HelpCircle, 
  Users 
} from 'lucide-react';

import LeaderboardTable from '@/components/LeaderboardTable';
import RulesModal from '@/components/RulesModal';
import IdentityAvatar from '@/components/IdentityAvatar';

// Helper for Nested Star Icon (Diamond Dev)
const NestedStar = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <Star className="h-7 w-7 fill-current opacity-20 animate-pulse" />
    <Star className="h-4 w-4 fill-current absolute opacity-50" />
    <Star className="h-2 w-2 fill-current absolute" />
  </div>
);

// Helper for Vanguard Icon - 4 hollow concentric rings matching reference
const NestedCircle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.2" />
    <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.4" />
    <circle cx="50" cy="50" r="19" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.7" />
    <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="6" />
  </svg>
);

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'streak' | 'points' | 'gm_balance' | 'impact'>('streak');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  
  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/leaderboard?type=${activeTab}&limit=50`);
      const data = await res.json();
      if (data.data) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);
  
  const top3 = users.slice(0, 3);
  const remainingUsers = users.slice(3);

  // Dynamic Tier Metadata Helper
  const getTierMetadata = (rank: number) => {
    if (rank <= 10) return {
      name: 'Grandmaster',
      color: 'text-slate-300',
      borderColor: 'border-slate-300/40',
      glowColor: 'shadow-[0_20px_50px_rgba(203,213,225,0.2)]',
      gradient: 'from-slate-200 via-slate-400 to-slate-600',
      icon: Trophy,
      pattern: 'cups'
    };
    if (rank <= 50) return {
      name: 'Diamond Dev',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-400/40',
      glowColor: 'shadow-[0_20px_50px_rgba(34,211,238,0.2)]',
      gradient: 'from-cyan-400 via-purple-500 to-indigo-600',
      icon: Star,
      pattern: 'stars'
    };
    return {
      name: 'Vanguard',
      color: 'text-blue-500',
      borderColor: 'border-blue-500/40',
      glowColor: 'shadow-[0_20px_50px_rgba(59,130,246,0.1)]',
      gradient: 'from-blue-600 via-blue-700 to-blue-800',
      icon: Circle,
      pattern: 'concentric'
    };
  };

  const leaderTier = getTierMetadata(1);

  const tabs = [
    { id: 'streak', name: 'Streaks', icon: Flame, color: 'text-orange-500' },
    { id: 'points', name: 'Reputation', icon: Star, color: 'text-yellow-500' },
    { id: 'gm_balance', name: 'Rewards', icon: Crown, color: 'text-purple-500' },
    { id: 'impact', name: 'Impact', icon: Target, color: 'text-blue-500' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      
      {/* 0. Web3 Perspective Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]"></div>
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 60% 80% at 50% 100%, black, transparent)',
            transform: 'perspective(1000px) rotateX(60deg) translateY(100px) scale(2)',
            transformOrigin: 'center bottom'
          }}
        ></div>
        {/* Ambient Glows */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-10 px-6 space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* 1. Header Hero Section */}
        <section className="relative bg-[#050505]/40 backdrop-blur-3xl rounded-[3.5rem] overflow-hidden p-10 md:p-24 text-center group shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0047FF] via-[#4F46E5] to-[#7C3AED] opacity-10 blur-[120px] pointer-events-none"></div>
          
          {/* Decorative Patterns - Dynamic based on Leader Tier */}
        {leaderTier.pattern === 'concentric' && (
          <>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-1000">
               <NestedCircle className="h-full w-full text-white" />
            </div>
            <div className="absolute -top-20 -right-20 w-80 h-80 opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-1000">
               <NestedCircle className="h-full w-full text-white" />
            </div>
          </>
        )}
        
        {leaderTier.pattern === 'stars' && (
          <>
            <div className="absolute -bottom-20 -left-20 h-64 w-64 opacity-10 transition-transform group-hover:rotate-45 duration-1000">
               <Star className="h-full w-full text-white fill-white/10" />
            </div>
            <div className="absolute -top-20 -right-20 h-64 w-64 opacity-10 transition-transform group-hover:-rotate-45 duration-1000">
               <Star className="h-full w-full text-white fill-white/10" />
            </div>
          </>
        )}

        {leaderTier.pattern === 'cups' && (
          <>
            <div className="absolute -bottom-20 -left-20 h-64 w-64 opacity-10 transition-transform group-hover:scale-110 duration-1000">
               <Trophy className="h-full w-full text-white fill-white/10" />
            </div>
            <div className="absolute -top-20 -right-20 h-64 w-64 opacity-10 transition-transform group-hover:scale-110 duration-1000">
               <Trophy className="h-full w-full text-white fill-white/10" />
            </div>
          </>
        )}

          <div className="relative z-10 flex flex-col items-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
               <Trophy className="h-4 w-4 text-yellow-300" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">The Global Stage</span>
            </div>
            
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85]">
                The Hall <br/> of <span className="text-white/60">GM.</span>
              </h1>
              <p className="text-gray-400 max-w-lg mx-auto font-medium text-lg leading-relaxed">
                Celebrating the most consistent and influential collectors in the Stacks ecosystem. 
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
               <Link href="/feed" className="bg-white text-black font-black px-10 py-5 rounded-2xl flex items-center gap-2 hover:bg-gray-100 transition-all active:scale-95 shadow-2xl">
                  Get Active
                  <Flame className="h-4 w-4 text-orange-500" />
               </Link>
               <button 
                onClick={() => setIsRulesOpen(true)}
                className="bg-transparent border-2 border-white/10 text-white font-black px-10 py-5 rounded-2xl hover:bg-white/5 transition-all active:scale-95 flex items-center gap-2"
               >
                  <HelpCircle className="h-4 w-4" />
                  View Rules
               </button>
            </div>
          </div>
        </section>

        {/* Rules Modal */}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

        {/* 2. Top 3 Podium Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
           {top3.length === 0 ? (
             <div className="col-span-3 py-20 text-center space-y-6 bg-white/[0.02] border border-white/5 rounded-[3rem] backdrop-blur-sm">
                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 opacity-50">
                   <Users className="h-9 w-9 text-gray-400" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-white font-black text-xl tracking-tight">The Podium is Empty</h3>
                   <p className="text-gray-500 font-medium">Be the first to secure your position in history.</p>
                </div>
             </div>
           ) : (
             <>
              {top3.map((user, i) => {
                const rank = i + 1;
                const meta = getTierMetadata(rank);
                const order = rank === 1 ? 'order-1 md:order-2 z-20 scale-110 mb-8' : rank === 2 ? 'order-2 md:order-1 z-10' : 'order-3 z-0 opacity-80';
                
                return (
                  <div key={user.address} className={`flex flex-col items-center space-y-6 transition-all duration-1000 ${order}`}>
                     <div className="relative group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                        <IdentityAvatar 
                          address={user.address} 
                          src={user.avatar} 
                          size="lg" 
                          className={`h-32 w-32 md:h-44 md:w-44 border-4 ${meta.borderColor} !rounded-[3rem] shadow-2xl relative z-10`} 
                        />
                        <div className={`absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl ${meta.glowColor} bg-[#0A0A0A] border border-white/10 flex items-center justify-center z-20`}>
                           <meta.icon className={`h-6 w-6 ${meta.color}`} />
                        </div>
                     </div>
                     
                     <div className="text-center space-y-2">
                        <h3 className="text-xl font-black text-white tracking-tighter truncate max-w-[200px]">
                          {user.username || (user.address ? `${user.address.substring(0, 6)}...` : 'User')}
                        </h3>
                        <div className="flex items-center justify-center gap-2">
                           <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 ${meta.color}`}>
                              {meta.name}
                           </span>
                        </div>
                        <div className="text-3xl font-black text-white">
                          {activeTab === 'streak' && `${user.streak}d`}
                          {activeTab === 'points' && user.points.toLocaleString()}
                          {activeTab === 'gm_balance' && `${((user.gmBalance || 0) / 1000000).toLocaleString()} $GM`}
                          {activeTab === 'impact' && `${((user.totalReceived || 0) / 1000000).toLocaleString()} STX`}
                        </div>
                     </div>
                  </div>
                );
              })}
            </>
           )}
        </section>

        {/* 3. Bento Grid Stats */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-64">
           <div className="md:col-span-8 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110">
                 <Target className="h-40 w-40" />
              </div>
              <div className="flex flex-col justify-between h-full relative z-10">
                 <div>
                    <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-1">Network Power</h4>
                    <p className="text-6xl font-black text-white tracking-tighter">
                       0.0K
                    </p>
                 </div>
                 <p className="text-sm text-gray-500 max-w-sm">Cumulative reputation points generated by active Stacks collectors in the current cycle.</p>
              </div>
           </div>
           <div className="md:col-span-4 grid grid-rows-2 gap-6">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-[2rem] p-6 flex flex-col justify-center">
                 <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Highest Streak</h4>
                 <p className="text-4xl font-black text-white">0 DAYS</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-[2rem] p-6 flex flex-col justify-center">
                 <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Global Users</h4>
                 <p className="text-4xl font-black text-white">0</p>
              </div>
           </div>
        </section>

        {/* 4. Main Rankings Section */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-10">
             <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Active Rankings</h2>
                <p className="text-gray-500 text-sm">Showing the top 50 performers in the {activeTab === 'streak' ? 'Streak' : 'Reputation'} category.</p>
             </div>
             
             <div className="flex items-center gap-3 bg-[#0A0A0A] p-2 rounded-2xl border border-white/5 self-end">
               {tabs.map((tab) => {
                 const Icon = tab.icon;
                 const isActive = activeTab === tab.id;
                 return (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black transition-all ${
                       isActive 
                         ? 'bg-white text-black shadow-2xl' 
                         : 'text-gray-500 hover:text-white'
                     }`}
                   >
                     <Icon className={`h-4 w-4 ${isActive ? tab.color : ''}`} />
                     {tab.name}
                   </button>
                 );
               })}
             </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 min-h-[400px]">
             {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                   <Loader2 className="h-10 w-10 animate-spin text-gray-700 mb-4" />
                   <p className="text-gray-500 font-bold animate-pulse">Scanning Protocol Records...</p>
                </div>
             ) : (
                <LeaderboardTable 
                  users={remainingUsers} 
                  type={activeTab as any} 
                />
             )}
          </div>
        </div>

        {/* 5. Status & Privileges Tiers */}
        <section className="bg-gradient-to-t from-white/[0.02] to-transparent rounded-[3.5rem] p-12 md:p-20 border border-white/5">
           <div className="max-w-4xl mx-auto text-center space-y-16">
              <div className="space-y-4">
                 <h2 className="text-4xl font-black text-white tracking-tight">Status & Privileges</h2>
                 <p className="text-gray-500">How we tier the network participants based on reputation and consistency.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 <div className="space-y-6 group">
                    <div className="h-16 w-16 mx-auto bg-slate-300/10 rounded-2xl flex items-center justify-center border border-slate-300/20 group-hover:scale-110 transition-transform">
                       <Trophy className="h-8 w-8 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-lg font-black text-white">Grandmaster</h4>
                       <p className="text-xs font-black uppercase tracking-widest text-slate-400">Top 10 Rankings</p>
                       <p className="text-sm text-gray-600 leading-relaxed">Early access to governance tokens and exclusive STX distribution pools.</p>
                    </div>
                 </div>

                 <div className="space-y-6 group">
                    <div className="h-16 w-16 mx-auto bg-cyan-400/10 rounded-2xl flex items-center justify-center border border-cyan-400/20 group-hover:scale-110 transition-transform">
                       <Star className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-lg font-black text-white">Diamond Dev</h4>
                       <p className="text-xs font-black uppercase tracking-widest text-cyan-500">Top 50 Rankings</p>
                       <p className="text-sm text-gray-600 leading-relaxed">Enhanced streak protection and priority support in the Gm ecosystem.</p>
                    </div>
                 </div>

                 <div className="space-y-6 group text-center">
                    <div className="h-16 w-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-900/20 group-hover:scale-110 transition-transform p-3">
                       <NestedCircle className="h-full w-full text-blue-500" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-lg font-black text-white">Vanguard</h4>
                       <p className="text-xs font-black uppercase tracking-widest text-blue-500">Top 100 Rankings</p>
                       <p className="text-sm text-gray-600 leading-relaxed">Unique profile badges and visibility multipliers on the global feed.</p>
                    </div>
                 </div>
              </div>

              <button className="py-4 px-12 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-white hover:border-white/20 transition-all">
                 View Full Protocol Roadmap
              </button>
           </div>
        </section>

        {/* Footer Snapshot */}
        <div className="text-center">
           <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.02] border border-white/5 opacity-50">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Last Snapshot Sync: {new Date().toLocaleDateString()}</span>
           </div>
        </div>

      </div>
    </div>
  );
}
