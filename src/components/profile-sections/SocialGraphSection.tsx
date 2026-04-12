'use client';

import { Users, Search, MoreVertical, UserPlus, Globe } from 'lucide-react';

const CONNECTIONS = [
  { id: 1, name: 'Satoshi.btc', address: 'ST123...4567', avatar: 'https://api.dicebear.com/7.x/builder/svg?seed=satoshi', isFollowing: true },
  { id: 2, name: 'Gordon.stx', address: 'ST888...9999', avatar: 'https://api.dicebear.com/7.x/builder/svg?seed=gordon', isFollowing: true },
  { id: 3, name: 'Muneeb.btc', address: 'ST111...2222', avatar: 'https://api.dicebear.com/7.x/builder/svg?seed=muneeb', isFollowing: false },
];

export default function SocialGraphSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">On-Chain Social Graph</h3>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700" />
               <input 
                 type="text" 
                 placeholder="Search nodes..." 
                 className="bg-white/[0.02] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-white/20 transition-all w-48"
               />
            </div>
         </div>

         <div className="grid grid-cols-1 gap-4">
            {CONNECTIONS.map((node) => (
              <div key={node.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/5 bg-black">
                      <img src={node.avatar} alt={node.name} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">{node.name}</p>
                      <p className="text-[10px] font-mono text-gray-600">{node.address}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     node.isFollowing 
                       ? 'bg-white/[0.05] text-gray-500 hover:text-white' 
                       : 'bg-white text-black hover:opacity-90'
                   }`}>
                      {node.isFollowing ? 'Connected' : 'Connect'}
                   </button>
                   <button className="h-8 w-8 flex items-center justify-center text-gray-700 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                   </button>
                </div>
              </div>
            ))}
         </div>

         <div className="mt-8 pt-6 border-t border-white/[0.03] text-center">
            <button className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
               Load More Network Data
            </button>
         </div>
      </div>
    </div>
  );
}
