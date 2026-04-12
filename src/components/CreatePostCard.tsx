'use client';

import { useState } from 'react';
import { Image as ImageIcon, Video, BarChart2, Smile, Globe, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { createPost } from '@/lib/features/postsSlice';

export default function CreatePostCard() {
  const [content, setContent] = useState('');
  const { address, isConnected } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !address) return;
    
    dispatch(createPost({
      authorAddress: address,
      content: content.trim()
    }));
    setContent('');
  };

  if (!isConnected) return null;

  const displayAvatar = `https://api.dicebear.com/7.x/builder/svg?seed=${address}`;

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl transition-all hover:border-white/10 group">
      <div className="flex gap-5">
        <div className="h-12 w-12 rounded-2xl overflow-hidden bg-white/5 border border-white/5 shrink-0 transition-transform group-hover:scale-105">
           <img src={displayAvatar} alt="user" className="h-full w-full object-cover" />
        </div>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something..."
            className="w-full bg-transparent border-none text-white resize-none outline-none text-lg min-h-[60px] placeholder-gray-600 font-medium py-2"
          />
          
          <div className="flex items-center justify-between mt-4 pt-6 border-t border-white/[0.03]">
            <div className="flex items-center gap-6">
               <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group/btn">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.02] flex items-center justify-center group-hover/btn:bg-white/5">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest hidden sm:inline">Image</span>
               </button>
               <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group/btn">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.02] flex items-center justify-center group-hover/btn:bg-white/5">
                    <Video className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest hidden sm:inline">Video</span>
               </button>
               <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group/btn">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.02] flex items-center justify-center group-hover/btn:bg-white/5">
                    <BarChart2 className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest hidden sm:inline">Poll</span>
               </button>
            </div>

            <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                  <Globe className="h-3.5 w-3.5" />
                  Public
                  <ChevronDown className="h-3 w-3 opacity-40 ml-1" />
               </button>

               <button
                 onClick={handleSubmit}
                 disabled={!content.trim()}
                 className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-20 disabled:grayscale hover:bg-gray-200 active:scale-95 whitespace-nowrap"
               >
                 Post
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
