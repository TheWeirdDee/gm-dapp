'use client';

import { CreditCard, CheckCircle2, Star, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useState } from 'react';
import ProPlanModal from '@/components/ProPlanModal';

export default function ProPlanSection() {
  const { isPro, proExpiry } = useSelector((state: RootState) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-10 opacity-[0.03] transition-transform group-hover:scale-110 duration-1000">
            <Star className="h-32 w-32 text-amber-500" />
         </div>

         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
               <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-2">Protocol Membership</h3>
               <div className="flex items-center gap-3">
                  <span className={`text-3xl font-black tracking-tighter ${isPro ? 'text-amber-500' : 'text-gray-700'}`}>
                    {isPro ? 'Pro Status' : 'Standard Node'}
                  </span>
                  {isPro && (
                     <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                        Active Lifetime
                     </div>
                  )}
               </div>
            </div>
            
            {!isPro && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl active:scale-95"
              >
                 Upgrade Now
              </button>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
               <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Zap className="h-5 w-5" />
               </div>
               <h4 className="text-sm font-bold text-white">1.0x Multiplier</h4>
               <p className="text-xs text-gray-500 font-medium">Earn maximum reputation points for every GM broadcast.</p>
            </div>

            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
               <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <ShieldCheck className="h-5 w-5" />
               </div>
               <h4 className="text-sm font-bold text-white">Verified Badge</h4>
               <p className="text-xs text-gray-500 font-medium">Distinctive on-chain visual status across the social graph.</p>
            </div>

            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
               <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <CheckCircle2 className="h-5 w-5" />
               </div>
               <h4 className="text-sm font-bold text-white">Priority Access</h4>
               <p className="text-xs text-gray-500 font-medium">Early access to protocol governance and future feature drops.</p>
            </div>
         </div>
         
         <div className="mt-10 p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-amber-500" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Protocol Support Plan</span>
               </div>
               <button className="text-[10px] font-black text-amber-900/60 uppercase hover:text-amber-500 transition-colors">Billing Details</button>
            </div>
         </div>
      </div>

      <ProPlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
