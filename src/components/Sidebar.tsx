'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Rss, 
  User as UserIcon, 
  Trophy, 
  Settings, 
  PlusCircle,
  Home
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

export default function Sidebar() {
  const pathname = usePathname();
  const { address, isConnected } = useSelector((state: RootState) => state.user);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Feed', href: '/feed', icon: Rss },
    { name: 'Profile', href: `/profile/${address}`, icon: UserIcon },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  ];

  if (!isConnected) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-64px)] sticky top-16 border-r border-[var(--color-border)] bg-[var(--color-background)] p-6 gap-8">
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && !link.href.includes('#'));
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-6">
        <button className="w-full bg-[var(--color-accent)] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          <PlusCircle className="h-5 w-5" />
          Create Post
        </button>

        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            pathname === '/settings' 
              ? 'bg-white/10 text-white font-bold' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
