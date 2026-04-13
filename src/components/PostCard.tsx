'use client';

import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MoreHorizontal,
  Smile,
  Crown
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import Link from 'next/link';

import IdentityAvatar from './IdentityAvatar';

interface PostCardProps {
  post: {
    id: string;
    authorAddress: string;
    content: string;
    timestamp: string;
    reactions: {
      gm: number;
      fire: number;
      laugh: number;
    };
    commentsCount: number;
    repostsCount: number;
    isPro?: boolean;
    avatar?: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const { address: currentAddress } = useSelector((state: RootState) => state.user);
  
  const displayAddress = `${post.authorAddress.substring(0, 5)}...${post.authorAddress.substring(post.authorAddress.length - 4)}`;
  const displayUsername = post.authorAddress === currentAddress ? "You" : `user_${post.authorAddress.substring(post.authorAddress.length - 4)}`;

  // Formatting timestamp
  const timeAgo = new Date().getTime() - new Date(post.timestamp).getTime();
  const minutesAgo = Math.floor(timeAgo / (1000 * 60));
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  const displayTime = daysAgo > 0 ? `${daysAgo} days ago` : hoursAgo > 0 ? `${hoursAgo} hours ago` : `${minutesAgo} minutes ago`;

  // Content processing for hashtags
  const processContent = (text: string) => {
    return text.split(' ').map((word, i) => {
      if (word.startsWith('#')) {
        return <span key={i} className="text-blue-400 hover:underline cursor-pointer transition-all">{word} </span>;
      }
      return word + ' ';
    });
  };

  const totalLikes = (post.reactions.gm || 0) + (post.reactions.fire || 0) + (post.reactions.laugh || 0); 

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all duration-500 shadow-2xl">
      {/* Header */}
      <div className="p-6 flex items-start justify-between">
        <div className="flex gap-4">
          <Link href={`/profile/${post.authorAddress}`} className="shrink-0 group/avatar">
            <IdentityAvatar address={post.authorAddress} src={post.avatar} size="md" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Link href={`/profile/${post.authorAddress}`} className="text-sm font-black text-white hover:text-white/80 transition-colors tracking-tight">
                {displayUsername}
              </Link>
              {post.isPro && (
                <Crown className="w-3 h-3 text-white fill-white/10" />
              )}
            </div>
            <span className="text-[11px] font-medium text-gray-500 tracking-tight">{displayTime}</span>
          </div>
        </div>
        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.02] text-gray-700 hover:text-white transition-all hover:bg-white/5">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-4">
        <p className="text-[14px] leading-relaxed text-gray-200 font-medium whitespace-pre-wrap">
          {processContent(post.content)}
        </p>
      </div>

      {/* Media Area (Conditional based on hash or specific ID) */}
      {(post.content.includes('#') || post.id.includes('1')) && (
        <div className="px-6 pb-6 mt-2">
           <div className="aspect-[16/9] bg-white/[0.02] rounded-[1.5rem] overflow-hidden border border-white/5 group-hover:border-white/10 transition-all">
              <img 
                src={`https://images.unsplash.com/photo-${post.id.length % 2 === 0 ? '1618005182384-a83a8bd57fbe' : '1574169208507-84376144848b'}?w=800&fit=crop`} 
                alt="post-media" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
              />
           </div>
        </div>
      )}

      {/* Footer Interactions */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-white/[0.03]">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 group/btn">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-pink-500/5 text-gray-600 group-hover/btn:bg-pink-500/10 group-hover/btn:text-pink-500 transition-all">
               <Heart className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover/btn:text-gray-400">{totalLikes}</span>
          </button>
          
          <button className="flex items-center gap-2 group/btn">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-blue-500/5 text-gray-600 group-hover/btn:bg-blue-500/10 group-hover/btn:text-blue-500 transition-all">
               <MessageCircle className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover/btn:text-gray-400">{post.commentsCount}</span>
          </button>

          <button className="flex items-center gap-2 group/btn">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-amber-500/5 text-gray-600 group-hover/btn:bg-amber-500/10 group-hover/btn:text-amber-500 transition-all">
               <Bookmark className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover/btn:text-gray-400">{post.repostsCount}</span>
          </button>
        </div>

        <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/[0.02] text-gray-700 hover:text-white transition-all hover:bg-white/5">
           <Share className="h-4 w-4" />
        </button>
      </div>

      {/* Inline Comment Input */}
      <div className="px-6 py-5 bg-white/[0.01] flex items-center gap-3">
        <IdentityAvatar address={currentAddress || ''} size="sm" />

        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2 text-xs font-medium text-gray-600 flex items-center justify-between">
           <span>Write your comment</span>
           <Smile className="h-4 w-4 opacity-30" />
        </div>
      </div>
    </div>
  );
}
