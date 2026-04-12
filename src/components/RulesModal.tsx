'use client';

import { X, Trophy, Star, Circle, Flame, Target } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  const tiers = [
    {
      name: 'Grandmaster',
      rank: 'Rank 1 - 10',
      icon: Trophy,
      color: 'text-slate-300',
      bgColor: 'bg-slate-300/10',
      borderColor: 'border-slate-300/20',
      perks: ['Exclusive STX Yields', 'Governance Voting Power', 'Silver Identity Plate']
    },
    {
      name: 'Diamond Dev',
      rank: 'Rank 11 - 50',
      icon: Star,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-400/20',
      perks: ['Streak Protection Buff', 'Priority Support', 'Diamond Profile Glow']
    },
    {
      name: 'Vanguard',
      rank: 'Rank 51 - 100',
      icon: Circle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      perks: ['Profile Badge', 'Feed Visibility Multiplier', 'Concentric Protocol Access']
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60 animate-in fade-in duration-300">
      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-600/10 to-transparent">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tighter">Protocol Rules</h2>
            <p className="text-gray-500 text-sm font-medium">How to ascend in the Hall of GM</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[70vh] space-y-10 custom-scrollbar">
          
          {/* Section: The Streak */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-orange-500">
                <Flame className="h-5 w-5 fill-orange-500/20" />
                <h3 className="text-xl font-bold tracking-tight">The 24h Window</h3>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed">
                Consistency is the primary metric of the GM protocol. You must broadcast a "GM" transaction once every 24 hours to maintain your streak. Missing the window resets your streak to 0. 
             </p>
          </div>

          {/* Section: Reputation (Points) */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-yellow-500">
                <Target className="h-5 w-5" />
                <h3 className="text-xl font-bold tracking-tight">Reputation Calculation</h3>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed">
                Reputation is earned through daily transactions, reactions received on posts, and consistent streaks. Users with the highest reputation gain the most influence in the network governance.
             </p>
          </div>

          {/* Section: Tiers */}
          <div className="space-y-6">
             <h3 className="text-xl font-bold text-white tracking-tight">Tier Hierarchy</h3>
             <div className="grid gap-4">
                {tiers.map((tier) => (
                  <div key={tier.name} className={`p-6 rounded-3xl border ${tier.bgColor} ${tier.borderColor} space-y-4 transition-transform hover:scale-[1.02]`}>
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-black/40 ${tier.color}`}>
                             <tier.icon className="h-6 w-6" />
                          </div>
                          <div>
                             <h4 className={`text-lg font-black ${tier.color}`}>{tier.name}</h4>
                             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{tier.rank}</p>
                          </div>
                       </div>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       {tier.perks.map((perk) => (
                         <li key={perk} className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            {perk}
                         </li>
                       ))}
                    </ul>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-white/[0.02]">
           <button 
             onClick={onClose}
             className="w-full py-4 rounded-2xl bg-white text-black font-black hover:opacity-90 transition-all uppercase tracking-widest text-xs"
           >
             Acknowledge & Sync
           </button>
        </div>

      </div>
    </div>
  );
}
