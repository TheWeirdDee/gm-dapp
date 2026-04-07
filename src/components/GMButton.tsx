'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { Sun } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { sayGM } from '../lib/features/userSlice';

export default function GMButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();

  const handleGM = () => {
    if (clicked) return;

    // Dispatch the GM action to Redux store
    dispatch(sayGM());
    setClicked(true);

    // GSAP Animation Sequence
    const tl = gsap.timeline();
    
    // Quick shrink
    tl.to(buttonRef.current, { scale: 0.9, duration: 0.1, ease: 'power2.in' })
      // Pop out 
      .to(buttonRef.current, { scale: 1.15, duration: 0.3, ease: 'back.out(1.7)' })
      // Background glow pulse logic
      .to(containerRef.current, {
        boxShadow: '0 0 40px rgba(34, 197, 94, 0.8)',
        duration: 0.4,
        yoyo: true,
        repeat: 1
      }, '<')
      // Settle back to normal
      .to(buttonRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });
  };

  return (
    <div ref={containerRef} className="rounded-full transition-all duration-500">
      <button
        ref={buttonRef}
        onClick={handleGM}
        disabled={clicked}
        className={`flex h-48 w-48 flex-col items-center justify-center gap-4 rounded-full border-4 shadow-2xl transition-colors duration-500 ${
          clicked
            ? 'border-[var(--color-accent)] bg-[#0d1f14] text-[var(--color-accent)] opacity-80 cursor-default'
            : 'border-[var(--color-secondary)] bg-[#1a1c3b] hover:bg-[#232650] text-indigo-200'
        }`}
      >
        <Sun className={`h-16 w-16 ${clicked ? 'animate-spin-slow' : 'animate-bounce'}`} />
        <span className="text-4xl font-bold tracking-widest">{clicked ? 'GM!' : 'GM'}</span>
      </button>
    </div>
  );
}
