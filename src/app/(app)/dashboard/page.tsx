'use client';

import GMButton from '@/components/GMButton';
import PostCard from '@/components/PostCard';
import AnalyticsGraph from '@/components/AnalyticsGraph';
import StatCardVertical from '@/components/StatCardVertical';
import SetUsernameModal from '@/components/SetUsernameModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  History,
  CheckCircle2,
  Lock,
  ArrowRight,
  Zap,
  LayoutDashboard,
  Award
} from 'lucide-react';

export default function DashboardPage() {
  const { address, isConnected, mockData } = useSelector((state: RootState) => state.user);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Trigger onboarding if username looks like a wallet address (long string with no vowels/common patterns)
  // Simple heuristic: if length > 30, it's likely a raw address
  useEffect(() => {
    if (isConnected && mockData?.username && mockData.username.length > 25) {
      setShowOnboarding(true);
    }
  }, [isConnected, mockData?.username]);

  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="card p-6 md:p-12 bg-[#0A0A0A] border-[var(--color-border)] max-w-2xl w-full">
          <Lock className="h-12 w-12 md:h-16 md:w-16 text-gray-700 mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-black text-white mb-4">Dashboard Locked</h1>
          <p className="text-gray-400 mb-8 text-sm md:text-base">Connect your Stacks wallet to access your profile, streaks, and reputation dashboard.</p>
          <Link href="/" className="inline-block w-full sm:w-auto bg-[var(--color-accent)] text-black font-black py-4 px-10 rounded-2xl hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            Explore Landing Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1600px] mx-auto">
      
      <SetUsernameModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
        
        {/* Main Content Area (Column 1-8) */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* 1. Hero Greeting (Desktop Row 1 | Mobile Row 1) */}
          <section className="bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden group order-1">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] transition-transform group-hover:scale-110 duration-1000">
               <Zap className="h-48 w-48 text-[var(--color-accent)]" />
            </div>
            
            <div className="relative z-10 max-w-xl">
               <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight truncate">
                  Hi, {mockData?.username && mockData.username.length > 20 ? `${mockData.username.substring(0, 6)}...${mockData.username.substring(mockData.username.length - 4)}` : mockData?.username || 'GM User'}.
               </h1>
               <p className="text-gray-400 text-lg md:text-xl font-medium mb-8 leading-relaxed">
                  Welcome back! Your streak is active and your reputation is growing. Inspire the network today.
               </p>
               <button onClick={() => setShowOnboarding(true)} className="bg-white text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-gray-200 transition-all active:scale-95 shadow-2xl">
                  {mockData?.username && mockData.username.length > 20 ? 'Set Username' : 'View Details'}
                  <ArrowRight className="h-5 w-5" />
               </button>
            </div>
          </section>

          {/* 2. GM Button (DESKTOP: RIGHT SIDE | MOBILE: SECTION 2) */}
          {/* We use class ordering to force it after Hero on mobile */}
          <div className="lg:hidden order-2">
            <div className="bg-[#0A0A0A] border border-[var(--color-accent)]/20 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 relative overflow-hidden group shadow-[0_0_50px_rgba(34,197,94,0.05)]">
               <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)]/50"></div>
               <div className="scale-90">
                  <GMButton />
               </div>
               <p className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] text-center">Maintain your status</p>
            </div>
          </div>

          {/* 3. Stats Section (Desktop Row 2 | Mobile Row 3) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 order-3">
             <StatCardVertical 
                label="Days Streak" 
                value={mockData?.streak || 0} 
                icon={History} 
                subtext="Keep it up to multiply points!"
             />
             <StatCardVertical 
                label="Social Reputation" 
                value={mockData?.points || 0} 
                icon={Award} 
                subtext="Top 15% of all users"
                accentColor="#818cf8"
             />
             <StatCardVertical 
                label="Total Followers" 
                value={mockData?.followers || 0} 
                icon={Users} 
                subtext="+12 new this week"
                accentColor="#f472b6"
             />
          </section>

          {/* 4. Analytics Graph (Desktop Row 3 | Mobile Row 5) */}
          <div className="order-5">
            <AnalyticsGraph />
          </div>
        </div>

        {/* Side Panel (Column 9-12) */}
        <div className="lg:col-span-4 flex flex-col gap-8 order-2 lg:order-none">
          
          {/* GM Button (Desktop only here, Mobile it is order-2 above) */}
          <div className="hidden lg:flex bg-[#0A0A0A] border border-[var(--color-accent)]/20 p-8 rounded-[2.5rem] flex-col items-center justify-center gap-6 relative overflow-hidden group shadow-[0_0_50px_rgba(34,197,94,0.05)]">
             <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)]/50"></div>
             <div className="scale-90">
                <GMButton />
             </div>
             <p className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] text-center">Maintain your status</p>
          </div>

          {/* Followers Preview Section (order-4 on mobile) */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 order-4">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Followers</h4>
                <Link href="/profile" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors">View All</Link>
             </div>
             <div className="flex -space-x-4">
                {[1,2,3,4,5].map(i => (
                  <img 
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} 
                    className="h-10 w-10 rounded-full border-4 border-black bg-[#111]"
                    alt="Follower"
                  />
                ))}
                <div className="h-10 w-10 rounded-full border-4 border-black bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">
                  +24
                </div>
             </div>
          </div>

          {/* Pro Account CTA (order-6 on mobile) */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl order-6">
             <Zap className="absolute top-[-20px] right-[-20px] h-32 w-32 opacity-20 rotate-12 transition-transform group-hover:scale-110" />
             <h4 className="text-xl font-black text-white mb-2 relative z-10">Go Pro.</h4>
             <p className="text-indigo-100 text-sm mb-6 relative z-10 opacity-80">Unlock custom avatars, higher streak multipliers, and exclusive badges.</p>
             <button className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl relative z-10 transition-transform active:scale-95 shadow-xl">
                Purchase Now
             </button>
          </div>

        </div>

      </div>
    </div>
  );
}
