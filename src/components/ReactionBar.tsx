'use client';

import { Sun, Flame, SmilePlus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { reactToPost } from '../lib/features/postsSlice';
import gsap from 'gsap';
import { useRef } from 'react';

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
  
  // Store refs for each button to animate them individually
  const gmRef = useRef<HTMLButtonElement>(null);
  const fireRef = useRef<HTMLButtonElement>(null);
  const laughRef = useRef<HTMLButtonElement>(null);

  const handleReact = (type: 'gm' | 'fire' | 'laugh', ref: React.RefObject<HTMLButtonElement | null>) => {
    dispatch(reactToPost({ postId, reactionType: type }));
    
    if (ref.current) {
      gsap.fromTo(ref.current, 
        { scale: 0.8, y: 5 }, 
        { scale: 1, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
      );
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--color-border)] text-sm">
      <button 
        ref={gmRef}
        onClick={() => handleReact('gm', gmRef)}
        className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-[var(--color-accent)]"
      >
        <Sun className="h-4 w-4" />
        <span>{reactions.gm}</span>
      </button>
      
      <button 
        ref={fireRef}
        onClick={() => handleReact('fire', fireRef)}
        className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-orange-500"
      >
        <Flame className="h-4 w-4" />
        <span>{reactions.fire}</span>
      </button>
      
      <button 
        ref={laughRef}
        onClick={() => handleReact('laugh', laughRef)}
        className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-yellow-400"
      >
        <SmilePlus className="h-4 w-4" />
        <span>{reactions.laugh}</span>
      </button>
    </div>
  );
}
