'use client';

import { X } from 'lucide-react';
import CreatePostCard from './CreatePostCard';
import { useEffect } from 'react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Broadcast to Network</h2>
          <button 
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-2 max-h-[80vh] overflow-y-auto custom-scrollbar">
           <CreatePostCard />
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Stacks Mainnet Ready</p>
           <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Protocol Sync: Active</p>
        </div>
      </div>
    </div>
  );
}
