'use client';

import Link from 'next/link';
import { Wallet, ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Home() {
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(headlineRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4');
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-[var(--color-accent)] opacity-20 blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-[var(--color-secondary)] opacity-20 blur-[120px]"></div>
      
      {/* Hero Content */}
      <div className="z-10 text-center max-w-4xl mx-auto space-y-8">
        <h1 ref={headlineRef} className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-white mb-6">
          <span className="block">Say GM. Build streaks.</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)]">
            Own your social graph.
          </span>
        </h1>
        
        <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The decentralized social app built on Stacks. Every interaction builds your on-chain reputation.
        </p>

        <div ref={ctaRef} className="pt-8">
          <Link href="/dashboard" className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-black font-extrabold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <Wallet className="h-6 w-6" />
            <span>Connect Wallet</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <div className="mt-4 text-sm text-gray-500 font-mono italic">
            * Currently running on mocked testnet data for Phase 1
          </div>
        </div>
      </div>
    </div>
  );
}
