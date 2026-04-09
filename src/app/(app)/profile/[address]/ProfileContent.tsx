'use client';

import { use } from 'react';
import ProfileHeader from '@/components/ProfileHeader';
import PostCard from '@/components/PostCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';
import { MOCK_USERS } from '@/lib/mock-data';
import { ArrowLeft, Clock } from 'lucide-react';

export default function ProfileContent({ params }: { params: Promise<{ address: string }> }) {
  const unwrappedParams = use(params);
  const targetAddress = unwrappedParams.address;
  
  const feed = useSelector((state: RootState) => state.posts.feed);
  const { address: currentAddress, isConnected } = useSelector((state: RootState) => state.user);
  
  // Filter posts to only show this user's posts
  const userPosts = feed.filter(post => post.authorAddress === targetAddress);
  
  // Check if user exists in mock or is self
  const exists = MOCK_USERS[targetAddress] || (currentAddress === targetAddress);

  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
        <div className="card p-12 bg-[#0A0A0A] border border-white/5 max-w-2xl rounded-[3rem]">
          <h1 className="text-3xl font-black text-white mb-4 tracking-tighter">Connection Required</h1>
          <p className="text-gray-500 mb-8 font-medium">Please connect your Stacks wallet to view on-chain social profiles and interactions.</p>
          <Link href="/" className="inline-block bg-[var(--color-accent)] text-black font-black py-4 px-10 rounded-2xl hover:bg-opacity-90 transition-all shadow-xl">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!exists) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 bg-white/[0.02] rounded-full flex items-center justify-center mb-6 border border-white/5">
           <ArrowLeft className="h-8 w-8 text-gray-700" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Identity Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm font-medium">This principal hasn't been indexed by the Gm protocol yet.</p>
        <Link href="/dashboard" className="text-[var(--color-accent)] font-black uppercase tracking-widest text-xs hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Back Navigation for Desktop */}
      <div className="hidden lg:block">
         <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Hall</span>
         </Link>
      </div>

      <div className="relative z-10">
        <ProfileHeader targetAddress={targetAddress} />
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-black text-white uppercase tracking-wider">On-Chain Activity</h2>
           <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Live Feed</span>
           </div>
        </div>

        <div className="flex flex-col gap-6">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <div key={post.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <PostCard post={post} />
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-[#0A0A0A] border border-dashed border-white/5 rounded-[2.5rem]">
              <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No transactions recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
