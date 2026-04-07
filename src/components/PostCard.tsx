'use client';

import { MessageSquare, Repeat2 } from 'lucide-react';
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
  const allUsers = useSelector((state: RootState) => state.user.allUsers);
  const author = allUsers[post.authorAddress];
  
  const displayAddress = `${post.authorAddress.substring(0, 5)}...${post.authorAddress.substring(post.authorAddress.length - 4)}`;
  const displayUsername = author ? author.username : 'Unknown';
  const displayAvatar = author ? author.avatar : `https://api.dicebear.com/7.x/identicon/svg?seed=${post.authorAddress}`;

  // Formatting timestamp mock
  const timeAgo = new Date().getTime() - new Date(post.timestamp).getTime();
  const minutesAgo = Math.floor(timeAgo / (1000 * 60));
  const hoursAgo = Math.floor(minutesAgo / 60);
  const displayTime = hoursAgo > 0 ? `${hoursAgo}h` : `${minutesAgo}m`;

  return (
    <div className="card p-5 mb-4 hover:border-gray-700 transition-colors">
      <div className="flex gap-4">
        {/* Avatar */}
        <Link href={`/profile/${post.authorAddress}`}>
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-800 ring-2 ring-[var(--color-border)] hover:ring-[var(--color-secondary)] transition-all">
            <img src={displayAvatar} alt={displayUsername} className="h-full w-full object-cover" />
          </div>
        </Link>
        
        {/* Content Box */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Link href={`/profile/${post.authorAddress}`} className="font-bold text-white hover:underline">
              {displayUsername}
            </Link>
            <span className="text-sm text-gray-500 font-mono">{displayAddress}</span>
            <span className="text-sm text-gray-500">· {displayTime}</span>
          </div>
          
          {/* Body */}
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-gray-200">
            {post.content}
          </p>

          {/* Social Actions + Reactions */}
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <ReactionBar postId={post.id} reactions={post.reactions} />
            </div>
            {/* Standard social actions */}
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
