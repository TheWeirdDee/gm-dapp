'use client';

import { useState } from 'react';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  PieChart, 
  ArrowUpRight,
  Strikethrough,
  Waves
} from 'lucide-react';

export default function AnalyticsPulse() {
  const [stats] = useState({
    totalMinted: 154000,
    totalBurned: 12540,
    totalTipped: 8400,
    activeUsers: 342,
    protocolVigor: 88
  });

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                 <Waves className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/60">Real-Time Protocol Health</span>
           </div>
           <h1 className="text-6xl font-black text-white tracking-tighter">GM <span className="text-gray-600">Pulse</span></h1>
        </div>
        
        <div className="flex gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-2xl">
           {['24h', '7d', '30d', 'All'].map(time => (
             <button 
               key={time}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 time === '24h' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
               }`}
             >
               {time}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
         {/* Main Metric Cards */}
         <div className="lg:col-span-1 p-8 rounded-[3rem] bg-[#0A0A0A] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <Activity className="h-6 w-6 text-cyan-500 mb-6" />
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Social Vigor</h3>
            <div className="flex items-baseline gap-2 mb-2">
               <span className="text-5xl font-black text-white tracking-tighter">{stats.protocolVigor}%</span>
            </div>
            <div className="text-[10px] font-bold text-green-500 flex items-center gap-1">
               <ArrowUpRight className="h-3 w-3" />
               +12.4% vs last week
            </div>
         </div>

         <div className="lg:col-span-1 p-8 rounded-[3rem] bg-[#0A0A0A] border border-white/5 shadow-2xl relative overflow-hidden group">
            <Zap className="h-6 w-6 text-yellow-500 mb-6" />
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">STX Circulated</h3>
            <div className="flex items-baseline gap-2 mb-2">
               <span className="text-5xl font-black text-white tracking-tighter">{stats.totalTipped.toLocaleString()}</span>
               <span className="text-xs font-black text-gray-600">STX</span>
            </div>
            <div className="text-[10px] font-bold text-gray-600 flex items-center gap-1 uppercase tracking-widest">
               Community Tipping Volume
            </div>
         </div>

         <div className="lg:col-span-2 p-8 rounded-[3rem] bg-[#0A0A0A] border border-white/5 shadow-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Economy Heatmap</h3>
                  <p className="text-sm font-medium text-gray-600">Global transaction density over 24h</p>
               </div>
               <BarChart3 className="h-6 w-6 text-gray-700" />
            </div>
            
            <div className="flex items-end gap-1.5 h-24 mb-2 pt-8">
               {[40, 70, 45, 90, 65, 30, 80, 50, 95, 40, 60, 85, 30, 55, 75, 40, 80, 60, 45, 90].map((h, i) => (
                 <div 
                   key={i} 
                   className="flex-1 bg-white/5 rounded-t-sm hover:bg-[var(--color-accent)] transition-all relative group/bar"
                   style={{ height: `${h}%` }}
                 >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      {h}%
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Tokenomics Deep-Dive */}
         <div className="card p-10 bg-[#0A0A0A] border border-white/5 rounded-[4rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
               <TrendingUp className="h-12 w-12 text-white/5 group-hover:text-white/10 transition-colors" />
            </div>
            
            <h2 className="text-2xl font-black text-white tracking-tighter mb-10 flex items-center gap-3">
               <BarChart3 className="h-5 w-5 text-[var(--color-accent)]" />
               Token Dynamics
            </h2>
            
            <div className="space-y-12">
               <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500 mb-4">
                     <span>Minted ($GM Reward)</span>
                     <span className="text-white">{stats.totalMinted.toLocaleString()} GM</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full w-[85%] bg-[var(--color-accent)] shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.5)]"></div>
                  </div>
               </div>

               <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500 mb-4">
                     <span>Burned (Post Boosts)</span>
                     <span className="text-orange-500">{stats.totalBurned.toLocaleString()} GM</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full w-[15%] bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]"></div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                  <div>
                     <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Net Inflation</span>
                     <span className="text-2xl font-black text-white tracking-tighter">8.2%</span>
                  </div>
                  <div>
                     <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Social Sink Rate</span>
                     <span className="text-2xl font-black text-orange-500 tracking-tighter">1.5k / day</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Protocol Vitals */}
         <div className="card p-10 bg-[#0A0A0A] border border-white/5 rounded-[4rem]">
            <h2 className="text-2xl font-black text-white tracking-tighter mb-10 flex items-center gap-3">
               <Globe className="h-5 w-5 text-blue-500" />
               Network Vitals
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { label: "Nodes Indexed", value: "24", icon: Activity, color: "text-blue-500" },
                 { label: "Tx Success Rate", value: "99.2%", icon: ShieldCheck, color: "text-green-500" },
                 { label: "Avg Block Time", value: "10.4m", icon: BarChart3, color: "text-yellow-500" },
                 { label: "Global Reach", value: "142 Cities", icon: Globe, color: "text-purple-500" }
               ].map((vital, i) => (
                 <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4">
                    <vital.icon className={`h-5 w-5 ${vital.color}`} />
                    <div>
                       <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">{vital.label}</span>
                       <span className="text-3xl font-black text-white tracking-tighter">{vital.value}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
