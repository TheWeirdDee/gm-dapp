'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import BrandLogo from './BrandLogo';
import { Bell, Settings, LogOut, User, Menu, Search, ChevronDown, Home, Wallet } from 'lucide-react';
import Link from 'next/link';
import IdentityAvatar from './IdentityAvatar';
import { logout, setSessionToken, setAddress } from '@/lib/features/userSlice';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { address, isConnected, username, avatar, gmBalance, streak, points } = useSelector((state: RootState) => state.user);
  const { login } = useWalletAuth();
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

  const handleConnectWallet = async () => {
    await login();
  };

  return (
    <>
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="max-w-[1800px] mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        
        {/* Left: Logo & Burger */}
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className={`p-2 text-gray-400 hover:text-white transition-colors lg:hidden mr-4 ${!isConnected ? 'hidden' : ''}`}
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
          {hasMounted && !isConnected && isGuestPath && (
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
        <div className={`flex-1 max-w-2xl mx-2 md:mx-8 ${!isConnected ? 'hidden md:block' : ''}`}>
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
        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3">
          {isConnected && (
            <div className="hidden md:flex items-center gap-3 mr-2">
              {/* GM Tokens */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors cursor-default group">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-black italic">
                  $
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-500 leading-none uppercase tracking-tighter">GM Tokens</span>
                  <span className="text-xs font-black text-white leading-tight">{(gmBalance / 1000000).toLocaleString(undefined, { minimumFractionDigits: 1 })}</span>
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors cursor-default">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 text-orange-500">
                  <Home className="w-3 h-3 fill-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-500 leading-none uppercase tracking-tighter">Streak</span>
                  <span className="text-xs font-black text-white leading-tight">{streak}d</span>
                </div>
              </div>

              {/* Reputation */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors cursor-default">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-500">
                  <User className="w-3 h-3" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-500 leading-none uppercase tracking-tighter">Reputation</span>
                  <span className="text-xs font-black text-white leading-tight">{(points / 10).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <button className={`p-2 text-gray-400 hover:text-[var(--color-accent)] transition-colors relative ${!isConnected ? 'hidden md:block' : ''}`}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-[var(--color-accent)] rounded-full border-2 border-black"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            {hasMounted && (
              isConnected ? (
                <>
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 p-1 pr-3 transition-all hover:bg-white/10 active:scale-95"
                  >
                    <IdentityAvatar address={address} src={avatar} size="xs" className="h-7 w-7 !rounded-full bg-white/10" />
                    <span className="text-xs font-bold text-gray-300 hidden sm:inline">
                      {username || (address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : 'Guest')}
                    </span>
                    <ChevronDown 
                      className={`h-3 w-3 text-gray-500 transition-transform duration-300 ${showUserDropdown ? 'rotate-180' : 'rotate-0'}`}
                    />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-3 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="px-5 py-3 border-b border-white/[0.03] mb-2 bg-white/[0.01]">
                        <p className="text-[9px] uppercase tracking-widest text-gray-500 font-black mb-1">Wallet Connected</p>
                        <p className="text-[11px] font-mono text-gray-400 truncate">{address}</p>
                      </div>
                      
                      <Link href={`/profile/${address}`} onClick={() => setShowUserDropdown(false)} className="mx-2 flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[var(--color-accent)]/10 transition-colors">
                          <User className="h-4 w-4 group-hover:text-[var(--color-accent)]" />
                        </div>
                        <span className="font-bold">Your Profile</span>
                      </Link>

                      <Link href="/settings" onClick={() => setShowUserDropdown(false)} className="mx-2 flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <Settings className="h-4 w-4" />
                        </div>
                        <span className="font-bold">Settings</span>
                      </Link>

                      <div className="mt-2 pt-2 border-t border-white/[0.03]">
                        <button 
                          onClick={() => {
                            dispatch(logout());
                            router.push('/');
                          }}
                          className="mx-2 w-[calc(100%-1rem)] flex items-center gap-3 px-3 py-2.5 text-sm text-red-500/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                            <LogOut className="h-4 w-4" />
                          </div>
                          <span className="font-bold">Disconnect</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button 
                  onClick={() => void handleConnectWallet()}
                  className="flex items-center gap-2 rounded-full bg-[var(--color-secondary)] pl-2 pr-5 py-2 text-sm font-black text-white transition-all hover:bg-opacity-90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95"
                >
                  <Wallet className="h-4 w-4 ml-3" />
                  <span>Connect Wallet</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
    
    {/* Mobile Protocol HUD - Sticky below header */}
    {hasMounted && isConnected && (
      <div className="md:hidden sticky top-16 z-30 w-full bg-black/80 backdrop-blur-md border-b border-white/5 px-4 py-3 animate-in slide-in-from-top-4 duration-700">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
           {/* $GM HUD */}
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 shrink-0">
              <div className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-500 text-[9px] font-black italic flex items-center justify-center">$</div>
              <span className="text-[10px] font-black text-white">{(gmBalance / 1000000).toLocaleString(undefined, { minimumFractionDigits: 1 })}</span>
           </div>
           
           {/* Streak HUD */}
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/5 border border-orange-500/10 shrink-0">
              <Home className="w-3 h-3 text-orange-500 fill-orange-500/20" />
              <span className="text-[10px] font-black text-white">{streak}d</span>
           </div>

           {/* Rep HUD */}
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10 shrink-0">
              <User className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-black text-white">{(points / 10).toLocaleString()}</span>
           </div>
        </div>
      </div>
    )}
    </>
  );
}
