'use client';

import dynamic from 'next/dynamic';
import { Providers } from "@/components/Providers";

const LandingContent = dynamic(() => import('./LandingContent'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#050505] min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
    </div>
  )
});

export default function Home() {
  return (
    <Providers>
      <LandingContent />
    </Providers>
  );
}
