'use client';

import LeaderboardTable from '@/components/LeaderboardTable';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useState } from 'react';
import { Trophy, Flame, Star, Target, Crown, Shield, HelpCircle } from 'lucide-react';
import { MOCK_USERS, User } from '@/lib/mock-data';
import RulesModal from '@/components/RulesModal';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'streak' | 'points'>('streak');
  
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  
  const usersArray: User[] = Object.values(MOCK_USERS);
  const topStreaks = [...usersArray].sort((a, b) => b.streak - a.streak).slice(0, 50);
  const topPoints = [...usersArray].sort((a, b) => b.points - a.points).slice(0, 50);
  
  const currentLeaderboard = activeTab === 'streak' ? topStreaks : topPoints;
  const top3 = currentLeaderboard.slice(0, 3);
  const remainingUsers = currentLeaderboard.slice(3);

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
    { id: 'streak', name: 'Top Streaks', icon: Flame, color: 'text-orange-500' },
    { id: 'points', name: 'Global Reputation', icon: Star, color: 'text-yellow-500' },
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
               <div className="absolute inset-0 border-[1.5rem] border-white rounded-full"></div>
               <div className="absolute inset-[3rem] border-[1rem] border-white rounded-full"></div>
            </div>
            <div className="absolute -top-20 -right-20 w-80 h-80 opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-1000">
               <div className="absolute inset-0 border-[1.5rem] border-white rounded-full"></div>
               <div className="absolute inset-[3rem] border-[1rem] border-white rounded-full"></div>
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
               <button className="bg-white text-black font-black px-10 py-5 rounded-2xl flex items-center gap-2 hover:bg-gray-100 transition-all active:scale-95 shadow-2xl">
                  Get Active
                  <Flame className="h-4 w-4 text-orange-500" />
               </button>
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
           {/* Rank 2 */}
           {(() => {
             const meta = getTierMetadata(2);
             const Icon = meta.icon;
             return (
               <div className="order-2 md:order-1 flex flex-col items-center gap-6 group">
                  <div className={`relative h-44 w-44 rounded-[2.5rem] p-1 bg-gradient-to-br ${meta.gradient}`}>
                     <div className="h-full w-full rounded-[2.2rem] bg-[#0A0A0A] overflow-hidden border-4 border-[#0A0A0A]">
                        <img src={top3[1]?.avatar} alt="rank 2" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                     </div>
                     <div className="absolute -top-3 -left-3 h-12 w-12 bg-black/80 backdrop-blur-md rounded-xl flex flex-col items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                        <Icon className={`h-4 w-4 ${meta.color}`} />
                        <span className="text-[10px] font-black text-white">#2</span>
                     </div>
                  </div>
                  <div className="text-center">
                     <h3 className="text-xl font-black text-white">{top3[1]?.username}</h3>
                     <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${meta.color}`}>{meta.name}</p>
                     <div className="mt-3 py-1.5 px-4 bg-white/5 border border-white/5 rounded-full text-sm font-black text-gray-500">
                        {activeTab === 'streak' ? `${top3[1]?.streak} Streak` : `${top3[1]?.points.toLocaleString()} Rep`}
                     </div>
                  </div>
               </div>
             );
           })()}

           {/* Rank 1 (Center - SILVER) */}
           {(() => {
             const meta = getTierMetadata(1);
             const Icon = meta.icon;
             return (
               <div className="order-1 md:order-2 flex flex-col items-center gap-8 mb-6 md:mb-12 group">
                  <div className={`relative h-64 w-64 rounded-[3.5rem] p-1.5 bg-gradient-to-br ${meta.gradient} ${meta.glowColor}`}>
                     <div className="absolute inset-0 rounded-[3.5rem] animate-pulse bg-white/10 blur-3xl -z-10"></div>
                     <div className="h-full w-full rounded-[3.1rem] bg-[#0A0A0A] overflow-hidden border-8 border-[#0A0A0A]">
                        <img src={top3[0]?.avatar} alt="rank 1" className="h-full w-full object-cover scale-110 group-hover:scale-125 transition-transform duration-1000" />
                     </div>
                     <div className={`absolute -top-6 -left-6 h-18 w-18 ${meta.color} bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col items-center justify-center shadow-2xl group-hover:scale-110 transition-all`}>
                        <Icon className="h-7 w-7 mb-0.5" />
                        <span className="text-[10px] font-black tracking-widest">SILVER</span>
                     </div>
                  </div>
                  <div className="text-center">
                     <div className="flex items-center justify-center gap-3 mb-2">
                        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter">{top3[0]?.username}</h3>
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${meta.borderColor}`}>
                           <Icon className={`h-5 w-5 ${meta.color}`} />
                        </div>
                     </div>
                     <p className={`text-xs font-black uppercase tracking-widest ${meta.color}`}>{meta.name} Leader</p>
                     <div className={`mt-4 py-3 px-10 bg-white/[0.03] border ${meta.borderColor} rounded-2xl text-2xl font-black ${meta.color} shadow-2xl`}>
                        {activeTab === 'streak' ? `${top3[0]?.streak} Streak` : `${top3[0]?.points.toLocaleString()} Reputation`}
                     </div>
                  </div>
               </div>
             );
           })()}

           {/* Rank 3 */}
           {(() => {
             const meta = getTierMetadata(3);
             const Icon = meta.icon;
             return (
               <div className="order-3 flex flex-col items-center gap-6 group">
                  <div className={`relative h-44 w-44 rounded-[2.5rem] p-1 bg-gradient-to-br ${meta.gradient}`}>
                     <div className="h-full w-full rounded-[2.2rem] bg-[#0A0A0A] overflow-hidden border-4 border-[#0A0A0A]">
                        <img src={top3[2]?.avatar} alt="rank 3" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                     </div>
                     <div className="absolute -top-3 -right-3 h-12 w-12 bg-black/80 backdrop-blur-md rounded-xl flex flex-col items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                        <Icon className={`h-4 w-4 ${meta.color}`} />
                        <span className="text-[10px] font-black text-white">#3</span>
                     </div>
                  </div>
                  <div className="text-center">
                     <h3 className="text-xl font-black text-white">{top3[2]?.username}</h3>
                     <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${meta.color}`}>{meta.name}</p>
                     <div className="mt-3 py-1.5 px-4 bg-white/5 border border-white/5 rounded-full text-sm font-black text-gray-500">
                        {activeTab === 'streak' ? `${top3[2]?.streak} Streak` : `${top3[2]?.points.toLocaleString()} Rep`}
                     </div>
                  </div>
               </div>
             );
           })()}
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
                       {(usersArray.reduce((acc, u) => acc + u.points, 0) / 1000).toFixed(1)}K
                    </p>
                 </div>
                 <p className="text-sm text-gray-500 max-w-sm">Cumulative reputation points generated by active Stacks collectors in the current cycle.</p>
              </div>
           </div>
           <div className="md:col-span-4 grid grid-rows-2 gap-6">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-[2rem] p-6 flex flex-col justify-center">
                 <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Highest Streak</h4>
                 <p className="text-4xl font-black text-white">{topStreaks[0]?.streak} DAYS</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-[2rem] p-6 flex flex-col justify-center">
                 <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Global Users</h4>
                 <p className="text-4xl font-black text-white">{usersArray.length}</p>
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

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
             <LeaderboardTable 
               users={remainingUsers} 
               type={activeTab} 
             />
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

                 <div className="space-y-6 group">
                    <div className="h-16 w-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                       <Circle className="h-8 w-8 text-blue-500" />
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
