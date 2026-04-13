import IdentityAvatar from './IdentityAvatar';
import { UserPlus, Heart, MessageSquare, ExternalLink, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function FeedSidebar() {
  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-120px)] sticky top-24 overflow-y-auto scrollbar-hide pr-2 pb-10">
      {/* Activity Section */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-white px-2">Activity</h3>
          <Link href="/followers" className="text-xs font-bold text-gray-500 hover:text-white transition-colors">See all</Link>
        </div>
        
        <div className="py-10 text-center space-y-3">
          <div className="h-12 w-12 bg-white/[0.02] rounded-2xl flex items-center justify-center mx-auto border border-white/5 opacity-40">
            <Heart className="h-5 w-5 text-gray-600" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">No recent activity</p>
        </div>
      </div>

      {/* Suggested Section */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-white px-2">Suggested For you</h3>
          <Link href="/followers?tab=suggestions" className="text-xs font-bold text-gray-500 hover:text-white transition-colors">See all</Link>
        </div>

        <div className="py-10 text-center space-y-3">
          <div className="h-12 w-12 bg-white/[0.02] rounded-2xl flex items-center justify-center mx-auto border border-white/5 opacity-40">
            <UserPlus className="h-5 w-5 text-gray-600" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">No nodes to suggest</p>
        </div>
      </div>
    </div>
  );
}
