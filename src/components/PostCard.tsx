'use client';

import { MessageSquare, Repeat2, Share2, MoreHorizontal } from 'lucide-react';
import ReactionBar from './ReactionBar';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import Link from 'next/link';

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
  };
}

export default function PostCard({ post }: PostCardProps) {
  const { address: currentAddress } = useSelector((state: RootState) => state.user);
  
  const displayAddress = `${post.authorAddress.substring(0, 5)}...${post.authorAddress.substring(post.authorAddress.length - 4)}`;
  // For the demo, we use the address as the username if no profile is found
  const displayUsername = post.authorAddress === currentAddress ? "You" : `user_${post.authorAddress.substring(post.authorAddress.length - 4)}`;
  const displayAvatar = `https://api.dicebear.com/7.x/builder/svg?seed=${post.authorAddress}`;

  // Formatting timestamp
  const timeAgo = new Date().getTime() - new Date(post.timestamp).getTime();
  const minutesAgo = Math.floor(timeAgo / (1000 * 60));
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  
  const displayTime = daysAgo > 0 ? `${daysAgo}d` : hoursAgo > 0 ? `${hoursAgo}h` : `${minutesAgo}m`;

  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl hover:bg-[#0f0f0f] transition-all duration-300 group">
      <div className="flex gap-4">
        {/* Avatar Section */}
        <Link href={`/profile/${post.authorAddress}`} className="relative shrink-0">
          <div className="h-12 w-12 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 group-hover:border-[var(--color-accent)]/50 transition-colors">
            <img src={displayAvatar} alt={displayUsername} className="h-full w-full object-cover" />
          </div>
        </Link>
        
        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Header Info */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.authorAddress}`} className="font-bold text-white hover:text-[var(--color-accent)] transition-colors">
                {displayUsername}
              </Link>
              <span className="text-xs text-gray-600 font-mono tracking-tighter">{displayAddress}</span>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-600 font-medium">{displayTime}</span>
            </div>
            <button className="text-gray-700 hover:text-white transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          
          {/* Post Content */}
          <p className="text-[15px] leading-relaxed text-gray-300 mb-6 font-medium">
            {post.content}
          </p>

          {/* Social Feedback Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
            <div className="basis-1/2">
              <ReactionBar postId={post.id} reactions={post.reactions} />
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 text-gray-400 text-sm">
              <button className="flex items-center gap-1.5 transition-colors hover:text-blue-400">
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentsCount}</span>
              </button>
              <button className="flex items-center gap-1.5 transition-colors hover:text-[var(--color-accent)]">
                <Repeat2 className="h-4 w-4" />
                <span>{post.repostsCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
