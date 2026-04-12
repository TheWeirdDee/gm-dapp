'use client';

import PostCard from '@/components/PostCard';
import CreatePostCard from '@/components/CreatePostCard';
import FeedSidebar from '@/components/FeedSidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useState } from 'react';
import { Sparkles, Clock, Flame, Globe, ChevronDown } from 'lucide-react';

export default function FeedContent() {
  const feed = useSelector((state: RootState) => state.posts.feed);
  const [activeTab, setActiveTab] = useState('Recent');

  const tabs = [
    { name: 'Recent', icon: Clock },
    { name: 'Trending', icon: Flame },
    { name: 'Top', icon: Sparkles },
    { name: 'Global', icon: Globe },
  ];

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Feed Content (Cols 1-8) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Create Post Area */}
          <CreatePostCard />

          {/* Feed Header & Sort */}
          <div className="flex items-center justify-between pt-4">
             <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-white text-black shadow-xl ring-4 ring-white/5' 
                        : 'bg-white/[0.02] text-gray-500 border border-white/5 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-gray-600 font-bold text-xs uppercase tracking-widest">
               <span>Sort by : </span>
               <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                  {activeTab} <ChevronDown className="h-3.5 w-3.5" />
               </button>
            </div>
          </div>

          {/* Feed List */}
          <div className="flex flex-col gap-8">
            {feed.map(post => (
              <div key={post.id} className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <PostCard post={post} />
              </div>
            ))}
            
            {feed.length === 0 && (
              <div className="py-20 text-center space-y-6 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem]">
                 <div className="h-20 w-20 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto border border-white/5">
                    <Globe className="h-8 w-8 text-gray-800" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-white font-black text-xl tracking-tight">Quiet on the network...</h3>
                    <p className="text-gray-500 font-medium">Be the first player to say GM and start the pulse!</p>
                 </div>
              </div>
            )}

            <div className="py-20 text-center">
               <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.01] border border-white/5 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Synched with Stacks Network</span>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Cols 9-12) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-10 h-fit">
          <FeedSidebar />
        </div>

      </div>
    </div>
  );
}
