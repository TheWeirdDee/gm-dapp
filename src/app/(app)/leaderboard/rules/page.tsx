'use client';

import { Trophy, Star, Shield, Flame, Target, ChevronLeft, Crown, Award, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardRulesPage() {
  const tiers = [
    {
      name: 'Grandmaster',
      rank: 'Rank 1 - 10',
      color: 'text-slate-300',
      bgColor: 'bg-slate-300/10',
      borderColor: 'border-slate-300/20',
      icon: Trophy,
      perks: [
        'Premium Silver Profile glow and identity plate',
        'Exclusive STX yield distribution pools',
        'Direct Governance voting weight multipliers',
        'VIP access to protocol roadmap discussions'
      ]
    },
    {
      name: 'Diamond Dev',
      rank: 'Rank 11 - 50',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-400/20',
      icon: Star,
      perks: [
        'Enhanced streak protection mechanism',
        'Priority support in the Gm ecosystem',
        'Diamond-themed reputation badges',
        'Early access to new protocol features'
      ]
    },
    {
      name: 'Vanguard',
      rank: 'Rank 51 - 100',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      icon: ShieldCheck,
      perks: [
        'Unique Vanguard protocol badge',
        'Feed visibility multipliers',
        'Access to regional GM community hubs',
        'Monthly reputation snapshot rewards'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="space-y-6">
          <Link 
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Hall of GM</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter italic">Protocol Rules.</h1>
            <p className="text-xl text-gray-500 font-medium">Decoding the mechanics of decentralised prestige.</p>
          </div>
        </div>

        {/* Core Mechanics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-6">
              <div className="h-14 w-14 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                 <Flame className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold">The 24h Window</h3>
              <p className="text-gray-400 leading-relaxed">
                Sustainability is key. To maintain your streak, you must send at least one "GM" transaction every 24 hours. A missed window resets your status, but Pro users get one "Streak Save" per month.
              </p>
           </div>
           
           <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 space-y-6">
              <div className="h-14 w-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20">
                 <Target className="h-7 w-7 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold">Reputation Weight</h3>
              <p className="text-gray-400 leading-relaxed">
                Reputation isn't just a number. It's calculated based on your total GM count, streak length, and the "GMs" you receive from other top-tier collectors. High reputation directly impacts your decentralized influence.
              </p>
           </div>
        </div>

        {/* Tier Deep Dive */}
        <div className="space-y-10">
           <div className="text-center space-y-2">
              <h2 className="text-3xl font-black">Tier Hierarchy</h2>
              <p className="text-gray-500">Exclusivity mapped to performance.</p>
           </div>

           <div className="grid gap-6">
              {tiers.map((tier) => (
                <div key={tier.name} className={`p-8 rounded-[3rem] border ${tier.bgColor} ${tier.borderColor} flex flex-col md:flex-row gap-10 items-center md:items-start`}>
                   <div className={`h-24 w-24 rounded-3xl shrink-0 flex items-center justify-center bg-black/40 border border-white/10 ${tier.color} shadow-2xl`}>
                      <tier.icon className="h-12 w-12" />
                   </div>
                   <div className="space-y-6 text-center md:text-left">
                      <div>
                         <h4 className={`text-4xl font-black ${tier.color}`}>{tier.name}</h4>
                         <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mt-1">{tier.rank}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {tier.perks.map((perk, i) => (
                           <div key={i} className="flex items-start gap-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                              <Zap className={`h-4 w-4 mt-1 shrink-0 ${tier.color}`} />
                              <span className="text-sm text-gray-300 font-medium">{perk}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-[3rem] p-12 text-center space-y-8 shadow-[0_40px_100px_rgba(59,130,246,0.2)]">
           <h3 className="text-4xl font-black tracking-tighter">Ready to ascend?</h3>
           <p className="max-w-xl mx-auto text-white/80 font-medium">Start your journey today. High consistency unlocks high rewards. The Hall of GM awaits its next legend.</p>
           <Link 
             href="/leaderboard"
             className="inline-block bg-white text-black font-black px-12 py-5 rounded-2xl hover:scale-105 transition-all shadow-2xl"
           >
             Go to Leaderboard
           </Link>
        </div>

      </div>
    </div>
  );
}
