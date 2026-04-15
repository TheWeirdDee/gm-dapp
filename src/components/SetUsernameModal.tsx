'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsername, fetchOnChainStats } from '../lib/features/userSlice';
import { RootState } from '../lib/store';
import { UserCheck, Sparkles, ArrowRight, Wallet as WalletIcon, Loader2, CheckCircle2, X } from 'lucide-react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { callContract } from '../lib/stacks';
import { supabase, getSupaClient } from '../lib/supabase';
import { APP_CONFIG, getExplorerLink } from '../lib/config';
import { 
  AnchorMode, 
  PostConditionMode,
  stringUtf8CV,
} from '@stacks/transactions';

interface SetUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetUsernameModal({ isOpen, onClose }: SetUsernameModalProps) {
  const [name, setName] = useState('');
  const [state, setState] = useState<'idle' | 'wallet_open' | 'pending' | 'success'>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const { address } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 3 && state === 'idle') {
      
      setState('wallet_open');

      try {
        await callContract({
          anchorMode: AnchorMode.Any,
          contractAddress: APP_CONFIG.contractAddress,
          contractName: APP_CONFIG.contractName,
          functionName: 'set-username',
          functionArgs: [stringUtf8CV(name.trim())],
          postConditionMode: PostConditionMode.Deny,
          postConditions: [],
          onFinish: async (data: any) => {
            console.log('Username transaction sent:', data.txId);
            setTxId(data.txId);
            setState('pending');
            
            // 1. SAVE TO LOCALSTORAGE (Immediate Persistence)
            if (address) {
              localStorage.setItem(`username_${address}`, name.trim());
            }

            // 2. UPSERT TO SUPABASE (Strict Persistence via Backend Proxy)
            if (address) {
              try {
                const token = localStorage.getItem('gm_session_token');
                await fetch('/api/profile/update', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    address,
                    username: name.trim()
                  })
                });
              } catch (supaErr) {
                console.error('Supabase persistence error:', supaErr);
              }
            }
            
            // 3. Update Redux State
            dispatch(setUsername(name.trim()));
            
            if (address) {
              dispatch(fetchOnChainStats(address) as any);
            }
            
            setTimeout(() => {
              setState('success');
              
              setTimeout(() => {
                onClose();
                setTxId(null);
                setState('idle');
              }, 4000);
            }, 3000);
          },
          onCancel: () => {
            setState('idle');
          },
        });
      } catch (error) {
        console.error('Set Username Error:', error);
        setState('idle');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        ref={overlayRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-[#0A0A0A] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all z-20"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Sparkles className="h-40 w-40 text-[var(--color-accent)]" />
        </div>

        <div className="relative z-10">
          <div className="h-16 w-16 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center mb-6">
            <UserCheck className="h-8 w-8 text-[var(--color-accent)]" />
          </div>

          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Set Your Name</h2>
          <p className="text-gray-500 mb-8 font-medium">This will be your permanent, on-chain social identity.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-600 font-black ml-1">New Username</label>
              <input
                autoFocus
                disabled={state !== 'idle'}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Satoshi"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[var(--color-accent)]/50 transition-all font-bold placeholder:text-gray-800 disabled:opacity-50"
                minLength={3}
                maxLength={20}
              />
            </div>

            <button
              type="submit"
              disabled={name.trim().length < 3 || state !== 'idle'}
              className={`w-full font-black py-5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale shadow-[0_0_30px_rgba(34,197,94,0.2)] ${
                state === 'idle' ? 'bg-[var(--color-accent)] text-black hover:bg-green-400' :
                state === 'wallet_open' ? 'bg-blue-500 text-white' :
                state === 'pending' ? 'bg-orange-500 text-white animate-pulse' :
                'bg-green-500 text-white'
              }`}
            >
              {state === 'idle' && (
                <>
                  Confirm Name
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
              {state === 'wallet_open' && (
                <>
                  <WalletIcon className="h-5 w-5 animate-bounce" />
                  Confirm in Wallet
                </>
              )}
              {state === 'pending' && (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Registering On-Chain...
                </>
              )}
              {state === 'success' && (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Name Registered!
                </>
              )}
            </button>
            
            {/* Task 6: Transaction Hash & Explorer Link */}
            {txId && (
              <a 
                href={getExplorerLink(txId)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-mono font-bold text-gray-500 hover:text-[var(--color-accent)] transition-colors flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-2"
              >
                TX: {txId.substring(0, 10)}... <ArrowRight className="h-3 w-3" />
              </a>
            )}
            
            {state === 'idle' && (
              <button 
                type="button"
                onClick={onClose}
                className="w-full text-gray-600 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Ask me later
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
