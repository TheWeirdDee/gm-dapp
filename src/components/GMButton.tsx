'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { Sun, CheckCircle2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStats } from '../lib/features/userSlice';
import { RootState } from '../lib/store';

export default function GMButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'pending' | 'success'>('idle');
  const dispatch = useDispatch();
  const { mockData } = useSelector((state: RootState) => state.user);

  const handleGM = () => {
    if (state !== 'idle') return;

    setState('pending');

    // Simulate Blockchain Transaction Logic
    // In Phase 3, this will call the Clarity contract say-gm function
    setTimeout(() => {
      setState('success');
      dispatch(updateStats({ 
        streak: (mockData?.streak || 0) + 1, 
        points: (mockData?.points || 0) + 50 
      }));

      // Animation
      const tl = gsap.timeline();
      tl.to(buttonRef.current, { scale: 1.1, duration: 0.2, ease: 'back.out' })
        .to(buttonRef.current, { scale: 1, duration: 0.2 });

      // Reset to idle after 5 seconds allowing for another GM later if needed (though usually 24h)
      setTimeout(() => setState('idle'), 5000);
    }, 2000);
  };

  return (
    <div ref={containerRef} className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <button
        ref={buttonRef}
        onClick={handleGM}
        disabled={state !== 'idle'}
        className={`relative flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-full border-4 transition-all duration-500 shadow-2xl ${
          state === 'success' ? 'border-green-500 bg-green-500/10 text-green-500' :
          state === 'pending' ? 'border-orange-500 bg-orange-500/10 text-orange-500 animate-pulse' :
          'border-[var(--color-accent)] bg-black hover:border-white text-[var(--color-accent)]'
        }`}
      >
        {state === 'idle' && (
          <>
            <span className="text-6xl font-black transition-transform group-hover:scale-110">GM</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Say GM</span>
          </>
        )}
        {state === 'pending' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin mb-2" />
            <span className="text-xs font-black uppercase tracking-widest">Confirming...</span>
          </>
        )}
        {state === 'success' && (
          <>
            <CheckCircle2 className="h-16 w-16 mb-2" />
            <span className="text-xl font-black uppercase tracking-widest">GM Sent!</span>
          </>
        )}
      </button>
      
      {/* Decorative Glow */}
      <div className={`absolute -inset-4 rounded-full blur-2xl opacity-10 transition-colors duration-1000 ${
        state === 'success' ? 'bg-green-500' : state === 'pending' ? 'bg-orange-500' : 'bg-[var(--color-accent)]'
      }`}></div>
    </div>
  );
}
