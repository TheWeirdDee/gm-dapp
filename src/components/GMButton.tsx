'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { CheckCircle2, Loader2, Wallet as WalletIcon, AlertCircle, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStats, fetchOnChainStats } from '../lib/features/userSlice';
import { RootState } from '../lib/store';
import { callContract } from '../lib/stacks';
import { APP_CONFIG, getExplorerLink } from '../lib/config';
import { 
  AnchorMode, 
  PostConditionMode,
} from '@stacks/transactions';
import { supabase } from '@/lib/supabase';

export default function GMButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'wallet_open' | 'pending' | 'success' | 'error'>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const [localCooldown, setLocalCooldown] = useState(false);
  const dispatch = useDispatch();
  const { address, isPro, currentBlockHeight, streak, points, lastGm } = useSelector((state: RootState) => state.user);

  // 1. CALENDAR-DAY COOLDOWN (LocalStorage)
  useEffect(() => {
    if (!address) return;
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem(`gm_date_${address}`);
    if (savedDate === today) {
      setLocalCooldown(true);
    }
  }, [address]);

  // 2. BLOCK-HEIGHT COOLDOWN
  const blocksToWait = lastGm > 0 ? 144 - (currentBlockHeight - lastGm) : 0;
  const isChainCooldown = lastGm > 0 && (currentBlockHeight === 0 || blocksToWait > 0);
  
  // Final decision: if either local or chain says we're cooling down
  const isCooldownActive = localCooldown || isChainCooldown;



  const handleGM = async () => {
    if (state !== 'idle' || isCooldownActive) return;
    if (!address) return;

    setState('wallet_open');

    try {
      const options = {
        anchorMode: AnchorMode.Any,
        contractAddress: APP_CONFIG.contractAddress,
        contractName: APP_CONFIG.contractName,
        functionName: 'say-gm',
        functionArgs: [],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        onFinish: async (data: any) => {
          setTxId(data.txId);
          setState('pending');
          
          const today = new Date().toISOString().split('T')[0];
          localStorage.setItem(`gm_date_${address}`, today);
          setLocalCooldown(true);

          // 1. Record in Supabase for Hybrid Feed
          try {
             await supabase.from('posts').insert([{
                address: address,
                tx_id: data.txId,
                content: 'Said GM!',
                points: isPro ? 10 : 5
             }]);
          } catch (supaErr) {
             console.error('Supabase indexing error:', supaErr);
          }

          const pointsToAdd = isPro ? 10 : 5;
          dispatch(updateStats({
            streak: (streak || 0) + 1,
            points: (points || 0) + pointsToAdd
          }));
          
          dispatch(fetchOnChainStats(address!) as any);
          
          setTimeout(() => {
            setState('success');
            setTimeout(() => {
              setState('idle');
              setTxId(null);
            }, 8000);
          }, 3000);
        },
        onCancel: () => setState('idle'),
      };

      await callContract(options);
    } catch (error: any) {
      if (error.message?.includes('u101')) {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`gm_date_${address}`, today);
        setLocalCooldown(true);
        setState('error');
      } else {
        setState('error');
      }
      setTimeout(() => setState('idle'), 4000);
    }
  };

  return (
    <div ref={containerRef} className="relative group flex flex-col items-center gap-4">
      <div className={`absolute -inset-1 rounded-full blur opacity-[0.02] transition duration-1000 group-hover:opacity-[0.05] pointer-events-none bg-white`}></div>
      
      <button
        ref={buttonRef}
        onClick={handleGM}
        disabled={state !== 'idle' || isCooldownActive}
        className={`relative z-10 flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-full border transition-all duration-1000 shadow-inner ${
          isCooldownActive ? 'border-white/[0.04] bg-[#0c0c0e] text-white/5' :
          state === 'success' ? 'border-emerald-900/10 bg-emerald-950/2 text-emerald-500/10' :
          state === 'pending' ? 'border-white/5 bg-zinc-950/5 text-zinc-700 animate-pulse' :
          state === 'wallet_open' ? 'border-white/5 bg-slate-950/5 text-slate-600' :
          state === 'error' ? 'border-red-900/10 bg-red-950/5 text-red-900/30' :
          'border-white/[0.05] bg-[#020202] hover:border-white/10 text-gray-500'
        }`}
      >
        {state === 'idle' && !isCooldownActive && (
          <>
            <span className="text-6xl font-black transition-transform group-hover:scale-[1.01] tracking-tighter opacity-70">GM</span>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20 mt-1">Say GM</span>
          </>
        )}
        {state === 'idle' && isCooldownActive && (
          <>
            <CheckCircle2 className="h-8 w-8 mb-2 opacity-[0.02]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-[0.05]">Confirmed</span>
          </>
        )}
        {state === 'wallet_open' && (
          <>
            <WalletIcon className="h-10 w-10 mb-2 opacity-20 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-center px-4 opacity-40">Confirm</span>
          </>
        )}
        {state === 'pending' && (
          <>
            <Loader2 className="h-10 w-10 animate-spin mb-2 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Indexing...</span>
          </>
        )}
        {state === 'success' && (
          <>
            <CheckCircle2 className="h-12 w-12 mb-2 opacity-20" />
            <span className="text-lg font-black uppercase tracking-widest opacity-30">GM SENT</span>
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="h-10 w-10 mb-2 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">FAILED</span>
          </>
        )}
      </button>

      {/* COUNTDOWN UI */}
      {isCooldownActive && (
        <div className="flex flex-col items-center gap-1.5 animate-in fade-in slide-in-from-top-4 duration-700">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 opacity-60">
             Next window opens in:
           </p>
           <p className="text-xl font-mono font-black text-white/20 tracking-widest">
             {blocksToWait > 0 ? blocksToWait : 144} BLOCKS
           </p>
           <p className="text-[9px] text-gray-800 italic opacity-40">
             ~{Math.ceil((blocksToWait > 0 ? blocksToWait : 144) * 10 / 60)} hours remaining
           </p>
        </div>
      )}

      {txId && (
        <a 
          href={getExplorerLink(txId)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[9px] font-mono font-bold text-gray-700 hover:text-white transition-colors flex items-center gap-1.5 opacity-40 hover:opacity-100"
        >
          {txId.substring(0, 10)}... <ArrowRight className="h-3 w-3" />
        </a>
      )}


      
      <div className={`absolute -inset-8 rounded-full blur-3xl opacity-[0.01] pointer-events-none bg-white`}></div>
    </div>
  );
}
