'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { Sun, CheckCircle2, Loader2, Wallet as WalletIcon, AlertCircle, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStats, fetchOnChainStats } from '../lib/features/userSlice';
import { RootState } from '../lib/store';
import { callContract } from '../lib/stacks';
import { APP_CONFIG, getExplorerLink } from '../lib/config';
import { 
  AnchorMode, 
  PostConditionMode,
} from '@stacks/transactions';

export default function GMButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'wallet_open' | 'pending' | 'success' | 'error'>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const { mockData, address } = useSelector((state: RootState) => state.user);

  const handleGM = async () => {
    // DIAGNOSTIC ALERT: Prove the click reached the code
    if (typeof window !== 'undefined') window.alert('GM TRIGGERED');
    
    console.error('CRITICAL: GM Button Click Registered');
    console.log('GM Button Details - State:', state, 'Addr:', address);
    if (state !== 'idle') {
      console.log('Button blocked: State is', state);
      return;
    }

    if (!address) {
      console.log('Button blocked: No wallet address found');
      return;
    }

    setState('wallet_open');
    console.log('Transitioning to wallet_open...');

    try {
      console.log('Invoking callContract-say-gm...');
      await callContract({
        anchorMode: AnchorMode.Any,
        contractAddress: APP_CONFIG.contractAddress,
        contractName: APP_CONFIG.contractName,
        functionName: 'say-gm',
        functionArgs: [],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        onFinish: (data: any) => {
          console.log('GM Transaction Success! TXID:', data.txId);
          setTxId(data.txId);
          setState('pending');
          
          dispatch(fetchOnChainStats(address) as any);
          
          setTimeout(() => {
            setState('success');
            const tl = gsap.timeline();
            tl.to(buttonRef.current, { scale: 1.1, duration: 0.2, ease: 'back.out' })
              .to(buttonRef.current, { scale: 1, duration: 0.2 });

            setTimeout(() => {
              setState('idle');
              setTxId(null);
            }, 8000);
          }, 3000);
        },
        onCancel: () => {
          console.log('GM Transaction Cancelled by user');
          setState('idle');
        },
      });
    } catch (error: any) {
      console.error('GM ERROR TRAP:', error);
      setState('error');
      setErrorMessage(error.message || 'Transaction failed');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  return (
    <div ref={containerRef} className="relative group flex flex-col items-center gap-4">
      <div className={`absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${
        state === 'error' ? 'bg-red-500' : 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)]'
      }`}></div>
      
      <button
        ref={buttonRef}
        onClick={handleGM}
        disabled={state !== 'idle'}
        className={`relative flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-full border-4 transition-all duration-500 shadow-2xl ${
          state === 'success' ? 'border-green-500 bg-green-500/10 text-green-500' :
          state === 'pending' ? 'border-orange-500 bg-orange-500/10 text-orange-500 animate-pulse' :
          state === 'wallet_open' ? 'border-blue-500 bg-blue-500/10 text-blue-500' :
          state === 'error' ? 'border-red-500 bg-red-500/10 text-red-500' :
          'border-[var(--color-accent)] bg-black hover:border-white text-[var(--color-accent)]'
        }`}
      >
        {state === 'idle' && (
          <>
            <span className="text-6xl font-black transition-transform group-hover:scale-110">GM</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Say GM</span>
          </>
        )}
        {state === 'wallet_open' && (
          <>
            <WalletIcon className="h-12 w-12 mb-2 animate-bounce" />
            <span className="text-xs font-black uppercase tracking-widest text-center px-4">Confirm in Wallet</span>
          </>
        )}
        {state === 'pending' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin mb-2" />
            <span className="text-xs font-black uppercase tracking-widest">Sending GM...</span>
          </>
        )}
        {state === 'success' && (
          <>
            <CheckCircle2 className="h-16 w-16 mb-2" />
            <span className="text-xl font-black uppercase tracking-widest">✅ GM Sent</span>
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="h-12 w-12 mb-2" />
            <span className="text-xs font-black uppercase tracking-widest">Error</span>
          </>
        )}
      </button>

      {/* Task 6: Transaction Hash & Explorer Link */}
      {txId && (
        <a 
          href={getExplorerLink(txId)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-mono font-bold text-gray-500 hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2"
        >
          TX: {txId.substring(0, 10)}... <ArrowRight className="h-3 w-3" />
        </a>
      )}
      
      {/* Decorative Glow */}
      <div className={`absolute -inset-4 rounded-full blur-2xl opacity-10 transition-colors duration-1000 ${
        state === 'success' ? 'bg-green-500' : 
        state === 'pending' ? 'bg-orange-500' : 
        state === 'wallet_open' ? 'bg-blue-500' :
        state === 'error' ? 'bg-red-500' :
        'bg-[var(--color-accent)]'
      }`}></div>
    </div>
  );
}
