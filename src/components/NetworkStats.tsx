'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Fuel, Activity } from 'lucide-react';

interface Stats {
  transactions: string;
  dau: string;
  gasFees: string;
  growth: string;
}

export default function NetworkStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/protocol/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const items = [
    { label: 'Transactions', value: stats?.transactions || '19K', icon: Activity, growth: '+262%' },
    { label: 'DAU', value: stats?.dau || '3K', icon: Users, growth: '+289%' },
    { label: 'Gas Fees', value: `${stats?.gasFees || '36.24'} STX`, icon: Fuel, growth: '+61%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {items.map((item, i) => (
        <div key={i} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <item.icon className="h-12 w-12" />
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
            <div className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-bold">
              {item.growth}
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-white">{isLoading ? '...' : item.value}</h3>
          </div>
          
          <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-accent)] w-2/3 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
