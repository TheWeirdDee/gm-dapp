'use client';

import { 
  Trophy, 
  Zap, 
  Crown, 
  Coins, 
  ArrowUpRight, 
  Lock,
  ChevronRight,
  Gift
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';

export default function RewardsContent() {
  const { isConnected, isPro } = useSelector((state: RootState) => state.user);

  if (!isConnected || !isPro) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="card p-6 md:p-12 bg-[#0A0A0A] border-white/5 max-w-2xl w-full rounded-[2.5rem]">
          <div className="bg-indigo-500/10 p-5 rounded-3xl w-fit mx-auto mb-6">
            <Lock className="h-10 w-10 text-indigo-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-4">Pro Rewards Only</h1>
          <p className="text-gray-400 mb-8 text-sm md:text-base leading-relaxed">
            The Rewards Center is reserved for active Pro subscribers. <br/>
            Purchase a membership to unlock monthly STX distributions and elite benefits.
          </p>
          <Link href="/dashboard" className="inline-block w-full sm:w-auto bg-indigo-600 text-white font-black py-4 px-10 rounded-2xl hover:bg-indigo-500 transition-all shadow-xl">
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1400px] mx-auto">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-700 p-8 md:p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden group">
        <Crown className="absolute top-[-20px] right-[-20px] h-48 w-48 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-1000" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 mb-6 backdrop-blur-md">
             <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Member</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-[0.9]">
            Your Elite <br/> Rewards Hub.
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl font-medium opacity-80 mb-0">
            Exclusive yields and distribution cycles for the Stacks Social elite.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Distribution Tracker */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] relative group hover:border-indigo-500/30 transition-all">
              <div className="bg-indigo-500/10 p-4 rounded-3xl w-fit mb-6">
                <Coins className="h-6 w-6 text-indigo-400" />
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Distributed</p>
              <h3 className="text-4xl font-black text-white mb-4">1,240.50 <span className="text-base font-medium text-gray-500">STX</span></h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-green-500">
                 <ArrowUpRight className="h-3 w-3" />
                 <span>Next drop in 4 days</span>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] relative group hover:border-purple-500/30 transition-all">
              <div className="bg-purple-500/10 p-4 rounded-3xl w-fit mb-6">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Reputation Yield</p>
              <h3 className="text-4xl font-black text-white mb-4">2.0x <span className="text-base font-medium text-gray-500">Multiplier</span></h3>
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Permanent Bonus Active</div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
            <h4 className="text-lg font-black text-white mb-8">Snapshot History</h4>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/[0.03] rounded-2xl hover:bg-white/[0.04] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-800 p-3 rounded-xl">
                      <Gift className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-widest">Cycle #{24 - i}</p>
                      <p className="text-[10px] text-gray-500 font-mono">2024-0{4-i}-15 12:00 UTC</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">+0.45 STX</p>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Claimed</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border border-dashed border-white/10 rounded-2xl hover:text-white hover:border-white/20 transition-all">
               View All Historical Distributions
            </button>
          </div>

        </div>

        {/* Side Info */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-gradient-to-b from-[#111] to-[#050505] border border-white/5 rounded-[2.5rem] p-8">
             <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Pro Milestones</h4>
             </div>
             <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-indigo-500/30 py-1">
                   <div className="absolute top-2 left-[-5px] w-2 h-2 rounded-full bg-indigo-500" />
                   <p className="text-xs font-bold text-white mb-1">Founder Status</p>
                   <p className="text-[10px] text-gray-500 leading-relaxed">Member since the Genesis block. Eligible for early-adopter distribution multipliers.</p>
                </div>
                <div className="relative pl-6 border-l-2 border-white/5 py-1">
                   <div className="absolute top-2 left-[-5px] w-2 h-2 rounded-full bg-gray-700" />
                   <p className="text-xs font-bold text-gray-400 mb-1 opacity-50">Governance Power</p>
                   <p className="text-[10px] text-gray-500 leading-relaxed opacity-50">Ability to vote on protocol updates coming in Stage 2 of the roadmap.</p>
                </div>
             </div>
          </div>

          <div className="bg-indigo-600/5 border border-indigo-600/20 rounded-[2.5rem] p-8">
             <h4 className="text-sm font-black text-white mb-4 uppercase tracking-widest">Help & Support</h4>
             <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Problems with your distribution? Reach out to the Gm Protocol team for immediate assistance.
             </p>
             <button className="flex items-center justify-between w-full p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Open Support</span>
                <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
             </button>
          </div>

        </div>

      </div>
    </div>
  );
}
