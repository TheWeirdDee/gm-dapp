'use client';

import { UserPlus, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const ACTIVITY_DATA = [
  { id: 1, user: 'Deraa', action: 'Started following you', time: '5m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deraa' },
  { id: 2, user: 'Ediwp', action: 'liked your photo', time: '30m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ediwp', preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop' },
  { id: 3, user: 'Praha_', action: 'liked your photo', time: '1D', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=praha', preview: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=100&h=100&fit=crop' },
];

const SUGGESTED_DATA = [
  { id: 1, name: 'Najid', subtext: 'Followed by Dims', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=najid', followed: true },
  { id: 2, name: 'Sheila Dara', subtext: 'Suggested for you', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sheila', followed: true },
  { id: 3, name: 'Divaaurey', subtext: 'Suggested for you', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diva', followed: false },
  { id: 4, name: 'Jhonson', subtext: 'Followed by Andrea', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johnson', followed: false },
];

export default function FeedSidebar() {
  return (
    <div className="flex flex-col gap-8">
      {/* Activity Section */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-white px-2">Activity</h3>
          <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">See all</button>
        </div>
        
        <div className="space-y-6">
          {ACTIVITY_DATA.map((item) => (
            <div key={item.id} className="flex items-center gap-3 group cursor-pointer">
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                <img src={item.avatar} alt={item.user} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {item.user} <span className="font-medium text-gray-500">{item.action}.</span> <span className="text-gray-600 font-mono text-[10px]">{item.time}</span>
                </p>
              </div>
              {item.preview ? (
                <div className="h-10 w-10 rounded-lg overflow-hidden border border-white/5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                  <img src={item.preview} alt="preview" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
              ) : (
                <button className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors shrink-0">
                  Follow
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.03]">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-6">Yesterday</h4>
          {/* Reusing same items for demo consistency with image */}
          <div className="space-y-6 opacity-60">
             {ACTIVITY_DATA.slice(2).map((item) => (
                <div key={`y-${item.id}`} className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/5 border border-white/5">
                      <img src={item.avatar} alt={item.user} className="h-full w-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {item.user} <span className="font-medium text-gray-500">liked your photo.</span> <span className="text-gray-600 font-mono text-[10px]">1D</span>
                      </p>
                   </div>
                   <div className="h-10 w-10 rounded-lg overflow-hidden border border-white/5 shrink-0">
                      <img src={item.preview} alt="preview" className="h-full w-full object-cover grayscale" />
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Suggested Section */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-white px-2">Suggested For you</h3>
          <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">See all</button>
        </div>

        <div className="space-y-6">
          {SUGGESTED_DATA.map((user) => (
            <div key={user.id} className="flex items-center gap-3 group cursor-pointer">
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] font-medium text-gray-600 truncate">{user.subtext}</p>
              </div>
              <button 
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
                  user.followed 
                    ? 'text-gray-600 font-bold opacity-40 hover:opacity-70' 
                    : 'bg-white/[0.03] text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {user.followed ? 'Followed' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
