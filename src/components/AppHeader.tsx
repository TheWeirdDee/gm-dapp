'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import BrandLogo from './BrandLogo';
import { Bell, Settings, LogOut, User, Menu, Search, ChevronDown, Home, Wallet } from 'lucide-react';
import Link from 'next/link';
import IdentityAvatar from './IdentityAvatar';
import { logout } from '@/lib/features/userSlice';
import { authenticate } from '@/lib/stacks';
import { usePathname } from 'next/navigation';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { address, isConnected, username, avatar } = useSelector((state: RootState) => state.user);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isGuestPath = pathname === '/feed' || pathname === '/leaderboard';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="max-w-[1800px] mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        
        {/* Left: Logo & Burger */}
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="p-2 text-gray-400 hover:text-white transition-colors lg:hidden mr-4"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Link href="/" className="transition-transform hover:scale-105 hidden lg:block lg:pl-8 shrink-0">
            <BrandLogo size={24} />
          </Link>
          
          <Link href="/" className="transition-transform hover:scale-105 lg:hidden">
            <BrandLogo size={24} />
          </Link>

          {/* Guest Home Shortcut */}
          {!isConnected && isGuestPath && (
            <Link 
              href="/" 
              className="ml-4 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center group"
              title="Back to Home"
            >
              <Home className="h-5 w-5 transition-transform group-hover:scale-110" />
            </Link>
          )}
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-2 md:mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[var(--color-accent)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs md:text-sm focus:outline-none focus:border-[var(--color-accent)]/50 focus:bg-white/[0.08] transition-all"
            />
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-[var(--color-accent)] transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-[var(--color-accent)] rounded-full border-2 border-black"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            {isConnected ? (
              <>
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 p-1 pr-3 transition-all hover:bg-white/10"
                >
                  <IdentityAvatar address={address} src={avatar} size="xs" className="h-7 w-7 !rounded-full" />
                  <span className="text-xs font-bold text-gray-300 hidden sm:inline">
                    {username || (address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : 'Guest')}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Connected Wallet</p>
                      <p className="text-xs font-mono text-gray-300 truncate">{address}</p>
                    </div>
                    <Link href={`/profile/${address}`} className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">Your Profile</Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">Settings</Link>
                    <button 
                      onClick={() => {
                        dispatch(logout());
                        router.push('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-2 pt-2"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button 
                onClick={authenticate}
                className="flex items-center gap-2 rounded-full bg-[var(--color-secondary)] pl-2 pr-5 py-2 text-sm font-black text-white transition-all hover:bg-opacity-90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95"
              >
                <Wallet className="h-4 w-4 ml-3" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
