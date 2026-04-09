'use client';

import PostCard from '@/components/PostCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { createPost } from '@/lib/features/postsSlice';
import { useState } from 'react';
import { PenSquare, Sparkles, Clock, Flame, Globe } from 'lucide-react';

export default function FeedContent() {
  const feed = useSelector((state: RootState) => state.posts.feed);
  const { address, isConnected } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    { name: 'All', icon: Globe },
    { name: 'Trending', icon: Flame },
    { name: 'Top', icon: Sparkles },
    { name: 'Recent', icon: Clock },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !address) return;
    
    dispatch(createPost({
      authorAddress: address,
      content: content.trim()
    }));
    setContent('');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tighter">Global Feed</h1>
        <p className="text-gray-500 font-medium">Discover what's happening across the Gm network.</p>
      </div>
      
      {/* Create Post Area */}
      {isConnected && (
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] transition-transform group-hover:scale-110 duration-700">
             <PenSquare className="h-24 w-24 text-[var(--color-accent)]" />
          </div>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening on Stacks?"
              className="w-full bg-transparent border-none text-white resize-none outline-none text-xl min-h-[140px] placeholder-gray-700 font-medium"
              maxLength={280}
            />
            <div className="flex items-center justify-between mt-4 pt-6 border-t border-white/[0.03]">
              <div className="flex gap-4">
                 <span className="text-xs font-black text-gray-700 uppercase tracking-widest self-center">{content.length} / 280</span>
              </div>
              
              <button
                type="submit"
                disabled={!content.trim()}
                className="flex items-center gap-2 bg-[var(--color-accent)] text-black px-8 py-3 rounded-2xl font-black transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95"
              >
                <PenSquare className="h-4 w-4" />
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-white text-black shadow-xl scale-105' 
                  : 'bg-white/[0.03] text-gray-500 border border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-6">
        {feed.map(post => (
          <div key={post.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <PostCard post={post} />
          </div>
        ))}
        {feed.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="h-20 w-20 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto border border-white/5">
                <Globe className="h-8 w-8 text-gray-700" />
             </div>
             <p className="text-gray-500 font-medium">The feed is currently empty. Be the first to say GM!</p>
          </div>
        )}
      </div>
      
      <div className="py-20 text-center">
         <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.02] border border-white/5">
            <div className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse"></div>
            <span className="text-xs font-black text-gray-600 uppercase tracking-widest">End of Global Feed</span>
         </div>
      </div>
    </div>
  );
}
