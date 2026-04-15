'use client';

import { Sun, Flame, Laugh } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { reactToPost } from '../lib/features/postsSlice';
import gsap from 'gsap';
import { useRef } from 'react';
import { showSignMessage } from '@stacks/connect';
import { appDetails } from '@/lib/stacks';

interface ReactionBarProps {
  postId: string;
  reactions: {
    gm: number;
    fire: number;
    laugh: number;
  };
}

export default function ReactionBar({ postId, reactions }: ReactionBarProps) {
  const dispatch = useDispatch();
  
  const gmRef = useRef<HTMLButtonElement>(null);
  const fireRef = useRef<HTMLButtonElement>(null);
  const laughRef = useRef<HTMLButtonElement>(null);

  const handleReact = async (type: 'gm' | 'fire' | 'laugh', ref: React.RefObject<HTMLButtonElement | null>) => {
    if (typeof window === 'undefined') return;

    const currentAddress = localStorage.getItem('gm_address');
    const token = localStorage.getItem('gm_session_token');

    if (!currentAddress || !token) {
      alert('Please sign in to react!');
      return;
    }

    const message = `React to Post: ${postId}\nReaction: ${type}\nAddress: ${currentAddress}`;

    showSignMessage({
      message,
      appDetails,
      onFinish: async (data: any) => {
        // Optimistic UI Update
        dispatch(reactToPost({ postId, reactionType: type }));
        
        if (ref.current) {
          gsap.fromTo(ref.current, 
            { scale: 0.9, y: 2 }, 
            { scale: 1, y: 0, duration: 0.3, ease: 'back.out(2)' }
          );
        }

        try {
          const response = await fetch(`/api/posts/${postId}/react`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              address: currentAddress,
              reactionType: type,
              signature: data.signature,
              publicKey: data.publicKey
            })
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to react');
          }

          // Force refresh state or add to local count if needed
          // For now, we'll rely on the next fetch or a global refresh
        } catch (err: any) {
          console.error('Reaction failed:', err);
          alert(err.message);
        }
      }
    });
  };

  return (
    <div className="flex items-center gap-2 text-xs font-bold">
      <button 
        ref={gmRef}
        onClick={() => handleReact('gm', gmRef)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-gray-500 transition-all hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)]"
      >
        <Sun className="h-3.5 w-3.5" />
        <span>{reactions.gm}</span>
      </button>
      
      <button 
        ref={fireRef}
        onClick={() => handleReact('fire', fireRef)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-gray-500 transition-all hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-500"
      >
        <Flame className="h-3.5 w-3.5" />
        <span>{reactions.fire}</span>
      </button>
      
      <button 
        ref={laughRef}
        onClick={() => handleReact('laugh', laughRef)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-gray-500 transition-all hover:bg-yellow-500/10 hover:border-yellow-500/30 hover:text-yellow-500"
      >
        <Laugh className="h-3.5 w-3.5" />
        <span>{reactions.laugh}</span>
      </button>
    </div>
  );
}
