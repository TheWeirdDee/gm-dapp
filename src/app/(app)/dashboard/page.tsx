'use client';

import GMButton from '@/components/GMButton';
import StreakCard from '@/components/StreakCard';
import PointsCard from '@/components/PointsCard';
import PostCard from '@/components/PostCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';
import { 
  Users, 
  TrendingUp, 
  History,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function DashboardPage() {
  const { address, isConnected, mockData } = useSelector((state: RootState) => state.user);
  const feed = useSelector((state: RootState) => state.posts.feed);
  
  // Show only 2 most recent posts on dashboard
  const miniFeed = feed.slice(0, 2);

  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex flex-row items-center justify-center p-6 text-center">
        <div className="card p-12 bg-[#0A0A0A] border-[var(--color-border)] max-w-2xl">
          <Lock className="h-16 w-16 text-gray-700 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-white mb-4">Dashboard Locked</h1>
          <p className="text-gray-400 mb-8">Connect your Stacks wallet to access your profile, streaks, and reputation dashboard.</p>
          <Link href="/" className="inline-block bg-[var(--color-accent)] text-black font-black py-4 px-10 rounded-2xl hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            Explore Landing Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Identity Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0A0A0A] p-8 rounded-3xl border border-[var(--color-border)]">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full border-4 border-[var(--color-accent)]/30 p-1 relative">
            <img 
              src={mockData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`} 
              alt="Avatar" 
              className="rounded-full bg-black w-full h-full"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 h-5 w-5 rounded-full border-4 border-[#0A0A0A]" title="Online" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black tracking-tight text-white">{mockData?.username || 'GM User'}</h1>
            <p className="text-gray-500 font-mono text-sm">{address?.substring(0, 6)}...{address?.substring(address.length - 6)}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-6 py-2 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Followers</div>
            <div className="text-xl font-bold text-white">{mockData?.followers || 0}</div>
          </div>
          <div className="text-center px-6 py-2 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Following</div>
            <div className="text-xl font-bold text-white">{mockData?.following || 0}</div>
          </div>
        </div>
      </section>

      {/* Main Grid: GM Button + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: GM Action (Centerpiece) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="card p-12 flex flex-col items-center justify-center min-h-[500px] border-[var(--color-accent)]/20 shadow-[0_0_80px_rgba(34,197,94,0.08)] bg-[#0A0A0A]/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50"></div>
            
            <h2 className="text-3xl font-black text-white mb-2 text-center">Daily Engagement</h2>
            <p className="text-gray-500 text-center mb-10 max-w-sm">
              Say GM to maintain your streak and earn reputation points on the decentralized ledger.
            </p>
            
            <GMButton />

            <p className="mt-8 text-gray-600 text-xs flex items-center gap-2 font-bold uppercase tracking-widest">
              <History className="h-4 w-4" />
              Last Check-in: Today, 09:12 AM
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Recent Activity</h2>
              <Link href="/feed" className="text-xs font-black text-[var(--color-accent)] hover:opacity-80 transition-opacity uppercase tracking-widest px-4 py-2 bg-[var(--color-accent)]/10 rounded-full">
                Full Feed &rarr;
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {miniFeed.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              {miniFeed.length === 0 && (
                <p className="text-gray-600 py-4 font-medium italic">No recent activity on your dashboard.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Detailed Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <StreakCard />
          <PointsCard />
          
          {/* Quick Stats Summary */}
          <div className="card p-6 bg-white/[0.02] border-white/5 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Network Overview</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-sm font-bold text-gray-400">Activity Rank</span>
              </div>
              <span className="text-sm font-black text-white">Top 10%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
                <span className="text-sm font-bold text-gray-400">Social Graph</span>
              </div>
              <span className="text-sm font-black text-white">Healthy</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-sm font-bold text-gray-400">Status</span>
              </div>
              <span className="text-sm font-black text-green-500">Connected</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
