'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { 
  Zap, 
  Check, 
  ShieldCheck, 
  Coins, 
  Flame, 
  ArrowRight, 
  Wallet as WalletIcon, 
  Loader2, 
  CheckCircle2, 
  X,
  Sparkles,
  Trophy
} from 'lucide-react';
import gsap from 'gsap';
import { callContract, getUserData } from '../lib/stacks';
import { APP_CONFIG, getExplorerLink } from '../lib/config';
import { 
  AnchorMode, 
  PostConditionMode, 
  Pc
} from '@stacks/transactions';
import { fetchOnChainStats, setOptimisticPro } from '../lib/features/userSlice';

interface ProPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProPlanModal({ isOpen, onClose }: ProPlanModalProps) {
  const [state, setState] = useState<'idle' | 'wallet_open' | 'pending' | 'success'>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { address, isPro, proExpiry, isOptimisticPro } = useSelector((state: RootState) => state.user);
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

  const handlePurchase = async () => {
    if (state !== 'idle') return;
    
    setError(null);
    setState('wallet_open');

    try {
      // Get the ABSOLUTE LATEST address from the session, not just Redux
      const userData = getUserData();
      const currentAddress = userData?.profile?.stxAddress?.testnet || 
                            userData?.profile?.stxAddress?.mainnet || 
                            userData?.profile?.stxAddress || 
                            address;

      console.log('--- PRO PURCHASE DEBUG INFO ---', {
        reduxAddress: address,
        latestSessionAddress: currentAddress,
        network: APP_CONFIG.network.isMainnet ? 'Mainnet' : 'Testnet'
      });

      // Network Prefix Validation (Safety check to prevent 'invalid contract' errors)
      const expectedPrefix = APP_CONFIG.network.isMainnet ? 'SP' : 'ST';
      if (currentAddress && !currentAddress.startsWith(expectedPrefix)) {
        setError(`Please switch your wallet to ${APP_CONFIG.network.isMainnet ? 'Mainnet' : 'Testnet'}. (Current: ${currentAddress.substring(0,2)})`);
        setState('idle');
        return;
      }

      // 10 STX exactly (micro-STX)
      const amount = BigInt(10000000); 
      
      const postConditions = currentAddress ? [
        Pc.principal(currentAddress).willSendEq(amount).ustx()
      ] : [];

      console.log('Initiating Pro Purchase Transaction...', { 
        amount: amount.toString(), 
        principal: currentAddress,
        contract: `${APP_CONFIG.contractAddress}.${APP_CONFIG.contractName}`
      });

      await callContract({
        anchorMode: AnchorMode.Any,
        contractAddress: APP_CONFIG.contractAddress,
        contractName: APP_CONFIG.contractName,
        functionName: 'subscribe-pro',
        functionArgs: [],
        postConditionMode: PostConditionMode.Allow,
        postConditions: [], // Robust mode: Allow contract to handle transfer internally
        onFinish: (data: any) => {
          console.log('Pro Subscription Success - TXID:', data.txId);
          setTxId(data.txId);
          setState('pending');
          
          if (address) {
            // background fetch to prepare UI
            dispatch(fetchOnChainStats(address) as any);
            // Optimistic Update
            dispatch(setOptimisticPro(true));
          }
          
          setTimeout(() => {
            setState('success');
            setTimeout(() => {
              onClose();
              setTxId(null);
              setState('idle');
            }, 6000);
          }, 3000);
        },
        onCancel: () => {
          console.warn('Pro Subscription Cancelled by User');
          setState('idle');
        },
      });
    } catch (err: any) {
      console.error('Pro Purchase Crash:', err);
      setError(err.message || 'Transaction failed to initialize');
      setState('idle');
    }
  };

  const benefits = [
    {
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      title: "Streak Restoration",
      desc: "Never lose your streak again. Pro members can heal broken streaks twice a month."
    },
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: "2x Rep Multiplier",
      desc: "Earn 100 points instead of 50 for every GM you say."
    },
    {
      icon: <Coins className="h-5 w-5 text-[var(--color-accent)]" />,
      title: "STX Rewards",
      desc: "Exclusive access to monthly STX distributions for active Pro members."
    },
    {
      icon: <Trophy className="h-5 w-5 text-indigo-500" />,
      title: "Elite Badges",
      desc: "Special 'Pro' flair on the leaderboard and global feed."
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Overlay */}
      <div 
        ref={overlayRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-[#050505] border border-white/10 rounded-[2rem] sm:rounded-[3rem] w-full max-w-lg sm:max-w-2xl shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row my-auto"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Benefits */}
        <div className="p-6 sm:p-8 md:p-10 md:w-3/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-indigo-500" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-500">Premium Tier</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">Level Up to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Pro.</span></h2>

          <div className="space-y-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="mt-1 h-10 w-10 min-w-[2.5rem] bg-white/[0.03] rounded-xl flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                  {b.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{b.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: CTA */}
        <div className="bg-white/[0.03] p-6 sm:p-8 md:p-10 md:w-2/5 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5">
          <div className="text-center mb-6">
            <div className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Price</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white">10</span>
              <span className="text-xl sm:text-2xl font-black text-gray-600 uppercase">stx</span>
            </div>
            <div className="text-gray-600 text-xs mt-2">Per 30 days</div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
              <X className="h-4 w-4 text-red-500 mt-0.5" onClick={() => setError(null)} />
              <p className="text-[10px] text-red-200 font-medium leading-tight">{error}</p>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={state !== 'idle' || isPro || isOptimisticPro}
            className={`w-full font-black py-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale shadow-2xl ${
              state === 'idle' ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20' :
              state === 'wallet_open' ? 'bg-blue-600 text-white' :
              state === 'pending' ? 'bg-orange-500 text-white animate-pulse' :
              'bg-green-500 text-white'
            }`}
          >
            {state === 'idle' && (
              <>
                <span className="text-lg">{(isPro || isOptimisticPro) ? 'Active Subscription' : 'Upgrade Now'}</span>
                <span className="text-[10px] opacity-60 uppercase tracking-widest">
                  {(isPro || isOptimisticPro) ? 'You are an elite member' : 'Instant Activation'}
                </span>
              </>
            )}
            {state === 'wallet_open' && (
              <>
                <WalletIcon className="h-6 w-6 animate-bounce" />
                <span>Confirm Purchase</span>
              </>
            )}
            {state === 'pending' && (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Broadcasting...</span>
              </>
            )}
            {state === 'success' && (
              <>
                <CheckCircle2 className="h-6 w-6" />
                <span>Welcome Pro!</span>
              </>
            )}
          </button>

          {txId && (
            <a 
              href={getExplorerLink(txId)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 text-[10px] font-mono font-bold text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              VIEW ON EXPLORER <ArrowRight className="h-3 w-3" />
            </a>
          )}

          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-gray-700" />
              <p className="text-[10px] text-gray-600 font-medium leading-relaxed">
                Transactions are secure and handled via the Stacks protocol. Membership starts immediately after confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
