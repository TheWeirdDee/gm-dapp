'use client';

import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import PostCard from '@/components/PostCard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PostDetailPage() {
  const { id } = useParams();
  const post = useSelector((state: RootState) => 
    state.posts.feed.find(p => p.id === id)
  );

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 space-y-6">
        <Link 
          href="/feed" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 group"
        >
          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold">Back to Feed</span>
        </Link>

        {post ? (
          <div className="space-y-6">
            <PostCard post={post} />
            
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-center space-y-4">
              <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <div className="h-2 w-2 bg-[var(--color-accent)] rounded-full animate-ping" />
              </div>
              <h2 className="text-xl font-black text-white">Discussion Opening Soon</h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Threaded comments are currently being verified on-chain. Check back shortly to join the conversation.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h1 className="text-2xl font-black text-white mb-2">Post Not Found</h1>
            <p className="text-gray-500 mb-6">This post may have been archived or moved.</p>
            <Link href="/feed" className="bg-white text-black font-black px-8 py-3 rounded-2xl">
              Return to Feed
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
