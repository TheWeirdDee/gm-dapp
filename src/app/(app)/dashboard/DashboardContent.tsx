'use client';

import GMButton from '@/components/GMButton';
import PostCard from '@/components/PostCard';
import AnalyticsGraph from '@/components/AnalyticsGraph';
import StatCardVertical from '@/components/StatCardVertical';
import SetUsernameModal from '@/components/SetUsernameModal';
import ProPlanModal from '@/components/ProPlanModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  TrendingUp, 
  History,
  CheckCircle2,
  Lock,
  ArrowRight,
  Zap,
  LayoutDashboard,
  Award,
  Crown,
  Heart
} from 'lucide-react';

import { callContract, getUserOnChainData } from '@/lib/stacks';
import { useDispatch } from 'react-redux';
import { updateStats } from '@/lib/features/userSlice';
import toast from 'react-hot-toast';

export default function DashboardContent() {
  const dispatch = useDispatch();
  const [isHealing, setIsHealing] = useState(false);
  const { address, isConnected, mockData, isLoading, followers, following, isPro, healCount, isOptimisticPro } = useSelector((state: RootState) => state.user);
  const activePro = isPro || isOptimisticPro;
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const dismissed = useRef(false);
  
  useEffect(() => {
    // Only show modal if: connected, no username set on-chain, and user hasn't dismissed it
    // Wait until loading is finished to decide whether to show onboarding
    if (!isLoading && isConnected && !mockData?.username && !dismissed.current) {
      setShowOnboarding(true);
    } else if (mockData?.username) {
      setShowOnboarding(false);
    }
  }, [isConnected, mockData?.username, isLoading]);

  const handleCloseOnboarding = () => {
    dismissed.current = true;
    setShowOnboarding(false);
  };

  const handleHealStreak = async () => {
    if (isHealing) return;
    setIsHealing(true);
    
    try {
      await callContract({
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
        contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME || '',
        functionName: 'heal-streak',
        functionArgs: [],
        onFinish: (data: any) => {
          toast.success("Streak Healed!");
          // Trigger refresh
          setTimeout(async () => {
            const freshData = await getUserOnChainData(address!);
            if (freshData) {
              dispatch(updateStats(freshData));
            }
          }, 5000);
        }
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to heal streak");
    } finally {
      setIsHealing(false);
    }
  };

  const addressShort = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'GM User';
  const greeting = isLoading && !mockData?.username 
    ? "Loading profile..." 
    : (mockData?.username || addressShort);

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
      
      <SetUsernameModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      <ProPlanModal isOpen={showProModal} onClose={() => setShowProModal(false)} />

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
        
        {/* Main Content Area (Column 1-8) */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* 1. Hero Greeting */}
          <section className="bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden group order-1">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] transition-transform group-hover:scale-110 duration-1000">
               <Zap className="h-48 w-48 text-[var(--color-accent)]" />
            </div>
            
            <div className="relative z-10 max-w-xl">
               <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight truncate">
                    Hi, {greeting}.
                  </h1>
                  {activePro && (
                    <div className="flex items-center justify-center p-1.5 bg-yellow-500/10 rounded-lg border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500/20 animate-pulse" />
                    </div>
                  )}
               </div>
               <p className="text-gray-400 text-lg md:text-xl font-medium mb-8 leading-relaxed">
                  Welcome back! Your streak is active and your reputation is growing. Inspire the network today.
               </p>
               <button onClick={() => setShowOnboarding(true)} className="bg-white text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-gray-200 transition-all active:scale-95 shadow-2xl">
                  {(!mockData?.username || mockData.username.length > 25) ? 'Set Username' : 'View Details'}
                  <ArrowRight className="h-5 w-5" />
               </button>
            </div>
          </section>

          {/* 2. GM Button (Mobile) */}
          <div className="lg:hidden order-2">
            <div className="bg-[#0A0A0A] border border-[var(--color-accent)]/20 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 relative overflow-hidden group shadow-[0_0_50px_rgba(34,197,94,0.05)]">
               <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)]/50"></div>
               <div className="scale-90">
                  <GMButton />
               </div>
               <p className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] text-center">Maintain your status</p>
            </div>
          </div>

          {/* 3. Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 order-3">
             <div className="relative group">
               <StatCardVertical 
                  label="Days Streak" 
                  value={mockData?.streak || 0} 
                  icon={History} 
                  subtext={activePro ? "Streak protection active" : "Keep it up for bonuses!"}
                  isLoading={isLoading}
               />
               {activePro && (mockData?.streak === 0) && (
                 <button 
                  onClick={handleHealStreak}
                  disabled={isHealing || healCount === 0}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-4 border-[#0a0a0a] hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95 transition-all"
                 >
                    <Heart className={`w-3 h-3 fill-white ${isHealing ? 'animate-ping' : ''}`} />
                    {isHealing ? 'Restoring...' : healCount > 0 ? `Heal Streak (${healCount} left)` : 'No heals left'}
                 </button>
               )}
             </div>
             <StatCardVertical 
                label="Social Reputation" 
                value={((mockData?.points || 0) / 10).toFixed(1)} 
                icon={Award} 
                subtext={
                  activePro 
                    ? "2x Rep Multiplier active" 
                    : (mockData?.points || 0) > 100 ? "Top 5% of all users" :
                      (mockData?.points || 0) > 50 ? "Top 15% of all users" :
                      (mockData?.points || 0) > 10 ? "Top 30% of all users" : "New Network Member"
                }
                accentColor="#818cf8"
                isLoading={isLoading}
             />
             <StatCardVertical 
                label="Total Followers" 
                value={followers || 0} 
                icon={Users} 
                subtext={`${following} following`}
                accentColor="#f472b6"
                isLoading={isLoading}
             />
          </section>

          {/* 4. Analytics Graph */}
          <div className="order-5">
            <AnalyticsGraph />
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-4 flex flex-col gap-8 order-2 lg:order-none">
          
          {/* GM Button (Desktop) */}
          <div className="hidden lg:flex bg-[#0A0A0A] border border-[var(--color-accent)]/20 p-8 rounded-[2.5rem] flex-col items-center justify-center gap-6 relative overflow-hidden group shadow-[0_0_50px_rgba(34,197,94,0.05)]">
             <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)]/50"></div>
             <div className="scale-90">
                <GMButton />
             </div>
             <p className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] text-center">Maintain your status</p>
          </div>

          {/* Followers Preview */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 order-4">
             <div className="flex items-center justify-between mb-5">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Followers</h4>
                <Link href="/followers" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors">View All</Link>
             </div>
             {followers === 0 ? (
               <div className="flex flex-col items-center gap-3 py-4 text-center">
                 <div className="flex -space-x-3">
                   <div className="h-10 w-10 rounded-full border-2 border-[#0a0a0a] bg-white/[0.03] overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/builder/svg?seed=${address}`} alt="You" />
                   </div>
                   {[1,2].map(i => (
                     <div key={i} className="h-10 w-10 rounded-full border-2 border-[#0a0a0a] bg-white/[0.03] flex items-center justify-center">
                       <Users className="h-4 w-4 text-gray-700" />
                     </div>
                   ))}
                 </div>
                 <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">No followers yet</p>
                 <Link href="/feed" className="text-[10px] font-black text-[var(--color-accent)] hover:underline uppercase tracking-widest">Explore Feed</Link>
               </div>
             ) : (
               <div className="flex -space-x-3">
                 {Array.from({ length: Math.min(followers, 5) }).map((_, i) => (
                   <img
                     key={i}
                     src={`https://api.dicebear.com/7.x/builder/svg?seed=follower${address}${i}`}
                     className="h-10 w-10 rounded-full border-2 border-[#0a0a0a] bg-[#111]"
                     alt="Follower"
                   />
                 ))}
                 {followers > 5 && (
                   <Link href="/followers" className="h-10 w-10 rounded-full border-2 border-[#0a0a0a] bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 hover:bg-white/20 transition-colors">
                     +{followers - 5}
                   </Link>
                 )}
               </div>
             )}
          </div>

          {/* Pro Account CTA */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl order-6">
             <Zap className="absolute top-[-20px] right-[-20px] h-32 w-32 opacity-20 rotate-12 transition-transform group-hover:scale-110" />
             <h4 className="text-xl font-black text-white mb-2 relative z-10">{activePro ? "Welcome Pro" : "Go Pro."}</h4>
             <p className="text-indigo-100 text-sm mb-6 relative z-10 opacity-80">
                {activePro ? "You are enjoying double reputation points and streak protection." : "Unlock custom avatars, higher streak multipliers, and exclusive badges."}
             </p>
             <button 
                onClick={() => setShowProModal(true)}
                className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl relative z-10 transition-transform active:scale-95 shadow-xl"
             >
                {activePro ? "View Membership" : "Purchase Now"}
             </button>
          </div>

        </div>

      </div>
    </div>
  );
}
