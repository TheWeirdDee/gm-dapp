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
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import { Post } from '../lib/types';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import IdentityAvatar from './IdentityAvatar';

interface PostCardProps {
  post: Post;
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

  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(post.currentUserReaction === 'gm');
  const totalLikes = (post.reactions.gm || 0) + (post.reactions.fire || 0) + (post.reactions.laugh || 0);

  // Sync isLiked if post data changes (e.g., after a fresh fetch)
  useEffect(() => {
    setIsLiked(post.currentUserReaction === 'gm');
  }, [post.currentUserReaction]);

  const handleReaction = async () => {
    if (!currentAddress) {
      toast.error("Connect wallet to react");
      return;
    }
    
    // Optimistic Update
    const { reactToPost } = require('../lib/features/postsSlice');
    dispatch(reactToPost({ 
      postId: post.id, 
      reactionType: 'gm',
      decrement: isLiked 
    }));
    
    // Toggle state
    setIsLiked(!isLiked);

    try {
      const token = localStorage.getItem('gm_session_token');
      await fetch(`/api/posts/${post.id}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reactionType: 'gm' })
      });
    } catch (err) {
      console.error("Reaction failed:", err);
      // Rollback on failure
      dispatch(reactToPost({ 
        postId: post.id, 
        reactionType: 'gm',
        decrement: !isLiked 
      }));
      setIsLiked(isLiked);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'GM DApp Post',
          text: post.content,
          url: window.location.origin + `/post/${post.id}`,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleComment = () => {
    window.location.href = `/post/${post.id}`;
  };

  const { avatar: currentUserAvatar } = useSelector((state: RootState) => state.user);
  const postAvatar = post.avatar || (post.authorAddress === currentAddress ? currentUserAvatar : null);
  const handleBookmark = () => {
    toast.success("Post archived to your collection");
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all duration-500 shadow-2xl">
      {/* Header */}
      <div className="p-6 flex items-start justify-between">
        <div className="flex gap-4">
          <Link href={`/profile/${post.authorAddress}`} className="shrink-0 group/avatar">
            <IdentityAvatar address={post.authorAddress} src={postAvatar} size="md" />
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
      {post.content && post.content.trim() && (
        <div className="px-6 pb-4">
          <p className="text-[14px] leading-relaxed text-gray-200 font-medium whitespace-pre-wrap">
            {processContent(post.content)}
          </p>
        </div>
      )}

      {/* Media Area */}
      {post.mediaUrl && (
        <div className="px-6 pb-6 mt-2">
           <div className="max-h-[350px] bg-white/[0.02] rounded-[1.5rem] overflow-hidden border border-white/5 group-hover:border-white/10 transition-all flex items-center justify-center">
              {post.mediaUrl.match(/\.(mp4|webm|ogg)$/) ? (
                <video 
                  src={post.mediaUrl} 
                  controls 
                  className="max-h-[350px] w-auto max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
                />
              ) : (
                <img 
                  src={post.mediaUrl} 
                  alt="post-media" 
                  className="max-h-[350px] w-auto max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
                />
              )}
           </div>
        </div>
      )}

      {/* Poll Area */}
      {post.pollData && post.pollData.options && (
        <div className="px-6 pb-6 mt-2">
          <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Poll</span>
            </div>
            {post.pollData.options.map((option, i) => {
              const totalVotes = post.pollData?.votes.reduce((a, b) => a + b, 0) || 1;
              const percentage = Math.round(((post.pollData?.votes[i] || 0) / totalVotes) * 100);
              return (
                <button key={i} className="w-full relative h-10 bg-black border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all group/poll">
                  <div 
                    className="absolute inset-y-0 left-0 bg-[var(--color-accent)] opacity-10 transition-all duration-1000" 
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative px-4 h-full flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-300 group-hover/poll:text-white transition-colors">{option}</span>
                    <span className="text-gray-500">{percentage}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Interactions */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-white/[0.03]">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleReaction}
            className="flex items-center gap-2 group/btn"
          >
            <div className={`h-9 w-9 flex items-center justify-center rounded-xl transition-all ${
              isLiked 
                ? 'bg-pink-500/20 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                : 'bg-pink-500/5 text-gray-600 group-hover/btn:bg-pink-500/10 group-hover/btn:text-pink-500'
            }`}>
               <Heart className={`h-4 w-4 ${isLiked ? 'fill-pink-500' : ''}`} />
            </div>
            <span className={`text-xs font-bold transition-colors ${isLiked ? 'text-pink-500/80' : 'text-gray-600 group-hover/btn:text-gray-400'}`}>
              {totalLikes}
            </span>
          </button>
          
          <button 
            onClick={handleComment}
            className="flex items-center gap-2 group/btn"
          >
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-blue-500/5 text-gray-600 group-hover/btn:bg-blue-500/10 group-hover/btn:text-blue-500 transition-all">
               <MessageCircle className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover/btn:text-gray-400">{post.commentsCount}</span>
          </button>

          <button 
            onClick={handleBookmark}
            className="flex items-center gap-2 group/btn"
          >
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-amber-500/5 text-gray-600 group-hover/btn:bg-amber-500/10 group-hover/btn:text-amber-500 transition-all">
               <Bookmark className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover/btn:text-gray-400">{post.repostsCount}</span>
          </button>
        </div>

        <button 
          onClick={handleShare}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/[0.02] text-gray-700 hover:text-white transition-all hover:bg-white/5"
        >
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
