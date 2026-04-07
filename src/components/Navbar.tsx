'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, LayoutDashboard, Rss, Trophy, User as UserIcon, Sun } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Feed', href: '/feed', icon: Rss },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Profile', href: `/profile/${currentUser.address}`, icon: UserIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <Sun className="h-8 w-8 text-[var(--color-accent)]" />
          <span className="text-xl font-bold tracking-tight">GM dApp</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
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

        {/* Connect Wallet Mock */}
        <button className="flex items-center gap-2 rounded-full bg-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-opacity-90 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentUser.address.substring(0, 4)}...{currentUser.address.substring(currentUser.address.length - 4)}
          </span>
        </button>
      </div>
      
      {/* Mobile Nav Tabs */}
      <div className="md:hidden flex items-center justify-around border-t border-[var(--color-border)] bg-[#0a0a0a] p-3 fixed bottom-0 w-full z-50">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                isActive ? 'text-[var(--color-accent)]' : 'text-gray-400'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
