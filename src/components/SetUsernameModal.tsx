'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUsername } from '../lib/features/userSlice';
import { UserCheck, Sparkles, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

interface SetUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetUsernameModal({ isOpen, onClose }: SetUsernameModalProps) {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 3) {
      dispatch(setUsername(name.trim()));
      onClose();
    }
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div ref={modalRef} className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
          <Sparkles className="h-48 w-48 text-[var(--color-accent)]" />
        </div>

        <div className="relative z-10">
          <div className="h-16 w-16 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center mb-6">
            <UserCheck className="h-8 w-8 text-[var(--color-accent)]" />
          </div>

          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Set Your Name</h2>
          <p className="text-gray-500 mb-8 font-medium">Use a personalized name instead of your long wallet address.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-600 font-black ml-1">New Username</label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Satoshi"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[var(--color-accent)]/50 transition-all font-bold placeholder:text-gray-800"
                minLength={3}
                maxLength={20}
              />
            </div>

            <button
              type="submit"
              disabled={name.trim().length < 3}
              className="w-full bg-[var(--color-accent)] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-400 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale shadow-[0_0_30px_rgba(34,197,94,0.2)]"
            >
              Confirm Name
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <button 
              type="button"
              onClick={onClose}
              className="w-full text-gray-600 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Ask me later
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
