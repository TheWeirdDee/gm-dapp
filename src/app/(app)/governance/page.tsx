'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { 
  Gavel, 
  Flame, 
  Users, 
  BarChart3, 
  Vote, 
  TrendingUp,
  ShieldCheck,
  Clock as ClockIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function GovernanceHub() {
  const { isConnected } = useSelector((state: RootState) => state.user);
  const [stats] = useState({ burned: 12540, activeVoters: 84, proposals: 2 });
  
  const activeProposals = [
    {
      id: 1,
      title: "Increase $GM Daily Reward for Pro Users",
      description: "Proposed by @theweirddee. Increase daily GM reward from 2.0 to 2.5 $GM.",
      voters: 142,
      weight: "1.2M $GM",
      endTime: "48h left",
      type: "Economics"
    },
    {
      id: 2,
      title: "Add 'Community Spotlight' section to Feed",
      description: "A dedicated curated section for high-impact social posts.",
      voters: 89,
      weight: "850k $GM",
      endTime: "6d left",
      type: "Feature"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/50">Decentralized Governance</span>
           </div>
           <h1 className="text-5xl font-black text-white tracking-tighter">The Governance <span className="text-gray-600">Hub</span></h1>
        </div>
        
        <div className="flex gap-4">
           <button className="px-6 py-3 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-xl">
             New Proposal
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Stats & Pulse */}
        <div className="lg:col-span-1 space-y-8">
           {/* Protocol Pulse Card */}
           <div className="card p-8 bg-[#0A0A0A] border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative z-10">
                 <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6">
                    <Flame className="h-6 w-6" />
                 </div>
                 <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Total $GM Burned</h2>
                 <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-4xl font-black text-white tracking-tighter">{(stats.burned / 1000).toFixed(1)}k</span>
                    <span className="text-orange-500 font-black text-xs italic">DEFLATING</span>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-gray-600 font-bold">Scarcity Multiplier</span>
                       <span className="text-white font-black">1.4x</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-[60%] bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                 <Users className="h-4 w-4 text-blue-500 mb-3" />
                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Active Voters</span>
                 <span className="text-xl font-black text-white">{stats.activeVoters}</span>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                 <BarChart3 className="h-4 w-4 text-[var(--color-accent)] mb-3" />
                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Power Staked</span>
                 <span className="text-xl font-black text-white">4.2M</span>
              </div>
           </div>
        </div>

        {/* Right Column: Active Proposals */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Active Proposals</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest animate-pulse">
                Live
              </div>
           </div>

           <div className="space-y-6">
              {activeProposals.map(proposal => (
                <div key={proposal.id} className="card p-8 bg-[#0A0A0A] border border-white/5 rounded-[3rem] hover:border-white/10 transition-all hover:scale-[1.01] group cursor-pointer shadow-xl relative overflow-hidden">
                   <div className="flex flex-col md:flex-row gap-8 relative z-10">
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-500 text-[9px] font-black uppercase tracking-widest">
                               {proposal.type}
                            </span>
                            <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">
                               ID #{proposal.id}
                            </span>
                         </div>
                         <h4 className="text-xl font-black text-white tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                            {proposal.title}
                         </h4>
                         <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-xl">
                            {proposal.description}
                         </p>
                         
                         <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-2">
                               <TrendingUp className="h-4 w-4 text-gray-700" />
                               <span className="text-xs font-black text-white">{proposal.weight}</span>
                               <span className="text-[10px] font-bold text-gray-600">Weight</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <Vote className="h-4 w-4 text-gray-700" />
                               <span className="text-xs font-black text-white">{proposal.voters}</span>
                               <span className="text-[10px] font-bold text-gray-600">Voters</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <ClockIcon className="h-4 w-4 text-gray-700" />
                               <span className="text-xs font-black text-orange-500">{proposal.endTime}</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex md:flex-col justify-end items-end gap-3 shrink-0">
                         <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[var(--color-accent)] text-black font-black text-[11px] uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg">
                           Cast Vote
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* Empty State / More */}
           <div className="py-12 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center group hover:border-white/10 transition-colors">
              <Gavel className="h-10 w-10 text-gray-800 mb-4 group-hover:rotate-12 transition-transform" />
              <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Past Proposals Archived</p>
              <button className="text-[var(--color-accent)] text-[10px] font-black uppercase tracking-widest mt-4 hover:underline">
                 View History
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
