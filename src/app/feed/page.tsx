'use client';

import PostCard from '@/components/PostCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { createPost } from '@/lib/features/postsSlice';
import { useState } from 'react';
import { PenSquare } from 'lucide-react';

export default function FeedPage() {
  const feed = useSelector((state: RootState) => state.posts.feed);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    dispatch(createPost({
      authorAddress: currentUser.address,
      content: content.trim()
    }));
    setContent('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-black text-white mb-6">Global Feed</h1>
      
      {/* Create Post Area */}
      <div className="card p-5 mb-8">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening on Stacks?"
            className="w-full bg-transparent border-none text-white resize-none outline-none text-lg min-h-[100px] placeholder-gray-600"
            maxLength={280}
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
            <span className="text-sm text-gray-500">{content.length}/280</span>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center gap-2 bg-[var(--color-accent)] text-black px-6 py-2 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400"
            >
              <PenSquare className="h-4 w-4" />
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-2">
        {feed.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      <div className="mt-8 text-center text-gray-500">
        <p>End of feed. Say GM to see more!</p>
      </div>
    </div>
  );
}
