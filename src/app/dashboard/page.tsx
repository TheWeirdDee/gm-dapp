'use client';

import GMButton from '@/components/GMButton';
import StreakCard from '@/components/StreakCard';
import PointsCard from '@/components/PointsCard';
import PostCard from '@/components/PostCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';

export default function DashboardPage() {
  const feed = useSelector((state: RootState) => state.posts.feed);
  
  // Show only 2 most recent posts on dashboard
  const miniFeed = feed.slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column - GM Area (Most Important) */}
        <div className="md:col-span-8 flex flex-col gap-8">
          <div className="card p-12 flex flex-col items-center justify-center min-h-[400px] border-[var(--color-accent)]/20 shadow-[0_0_50px_rgba(34,197,94,0.05)] bg-[#0A0A0A]/80">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Daily Check-in</h2>
            <p className="text-gray-400 text-center mb-8 max-w-sm">
              Say GM to maintain your streak and earn points on-chain. Resets every 24 hours.
            </p>
            <GMButton />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <Link href="/feed" className="text-sm font-semibold text-[var(--color-accent)] hover:underline">
                View full feed &rarr;
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {miniFeed.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              {miniFeed.length === 0 && (
                <p className="text-gray-500 py-4">No recent activity found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <StreakCard />
          <PointsCard />
        </div>

      </div>
    </div>
  );
}
