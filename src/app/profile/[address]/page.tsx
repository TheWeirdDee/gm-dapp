'use client';

import { use } from 'react';
import ProfileHeader from '@/components/ProfileHeader';
import PostCard from '@/components/PostCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';

export default function ProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const unwrappedParams = use(params);
  const address = unwrappedParams.address;
  const feed = useSelector((state: RootState) => state.posts.feed);
  const allUsers = useSelector((state: RootState) => state.user.allUsers);
  
  // Filter posts to only show this user's posts
  const userPosts = feed.filter(post => post.authorAddress === address);

  if (!allUsers[address]) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-white mb-4">User Not Found</h1>
        <p className="text-gray-400 mb-8">The address requested does not exist on our mock testnet.</p>
        <Link href="/dashboard" className="text-[var(--color-accent)] hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8 relative z-10">
        <ProfileHeader targetAddress={address} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-6 px-2">Activity</h2>
        <div className="flex flex-col gap-2">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-12 card bg-white/5 border-dashed">
              <p className="text-gray-500">No on-chain activity yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
