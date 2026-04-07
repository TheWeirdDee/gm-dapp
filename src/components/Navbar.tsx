'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, LayoutDashboard, Rss, Trophy, User as UserIcon, Star, Info, ChevronDown, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import { connectWallet, disconnectWallet } from '../lib/features/userSlice';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { currentUser, isConnected } = useSelector((state: RootState) => state.user);
  
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWalletDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const publicLinks = [
    { name: 'Features', href: '/#features', icon: Star },
    { name: 'How it works', href: '/#how-it-works', icon: Info },
    { name: 'Feed', href: '/feed', icon: Rss },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  ];

  const authLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: `/profile/${currentUser.address}`, icon: UserIcon },
  ];

  const displayLinks = isConnected ? [...publicLinks, ...authLinks] : publicLinks;

  const handleWalletSelect = () => {
    dispatch(connectWallet());
    setShowWalletDropdown(false);
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet());
    setShowWalletDropdown(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 mt-1">
          <img src="/logo.png" alt="Gm Logo" className="h-9 w-9 rounded-full object-cover shadow-[0_0_10px_var(--color-accent)]" />
          <span className="text-2xl font-black tracking-tight" style={{fontFamily: 'sans-serif'}}>Gm</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {displayLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && !link.href.includes('#'));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${
                  isActive ? 'text-[var(--color-accent)]' : 'text-gray-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Wallet Connection */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowWalletDropdown(!showWalletDropdown)}
            className="flex items-center gap-2 rounded-full bg-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isConnected ? (
                <>
                  {currentUser.address.substring(0, 4)}...{currentUser.address.substring(currentUser.address.length - 4)}
                  <ChevronDown className="inline h-4 w-4 ml-1" />
                </>
              ) : (
                'Connect Wallet'
              )}
            </span>
          </button>

          {/* Wallet Dropdown Menu */}
          {showWalletDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl py-2 overflow-hidden z-50">
              {!isConnected ? (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Wallet</div>
                  <button 
                    onClick={handleWalletSelect}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-white"
                  >
                    <div className="h-8 w-8 bg-[#321B00] rounded-lg flex items-center justify-center border border-orange-500/30">
                      <span className="text-orange-500 font-bold text-xs">LW</span>
                    </div>
                    <span className="font-medium">Leather Wallet</span>
                  </button>
                  <button 
                    onClick={handleWalletSelect}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-white"
                  >
                    <div className="h-8 w-8 bg-blue-900/30 rounded-lg flex items-center justify-center border border-blue-500/30">
                      <span className="text-blue-400 font-bold text-xs">XV</span>
                    </div>
                    <span className="font-medium">Xverse</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href={`/profile/${currentUser.address}`}
                    onClick={() => setShowWalletDropdown(false)}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-white/5 transition-colors text-white md:hidden"
                  >
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    My Profile
                  </Link>
                  <button 
                    onClick={handleDisconnect}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-red-500/10 transition-colors text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Disconnect</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Nav Tabs */}
      <div className="md:hidden flex flex-wrap items-center justify-around border-t border-[var(--color-border)] bg-[#0a0a0a] p-2 fixed bottom-0 w-full z-50 gap-y-2">
        {displayLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && !link.href.includes('#'));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-[10px] sm:text-xs transition-colors px-2 py-1 ${
                isActive ? 'text-[var(--color-accent)]' : 'text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-center">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
