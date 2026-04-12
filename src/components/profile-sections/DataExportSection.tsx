'use client';

import { Download, FileDown, History, Info, ExternalLink } from 'lucide-react';

export default function DataExportSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Data Portability</h3>
            <History className="h-4 w-4 text-gray-700" />
         </div>

         <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                     <Download className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-white">Export Social Graph</p>
                     <p className="text-xs text-gray-500">Download your connections and connectors list (JSON)</p>
                  </div>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] text-[10px] font-black uppercase tracking-widest text-white hover:bg-white transition-all hover:text-black">
                  Request JSON
               </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                     <FileDown className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-white">Broadcast History</p>
                     <p className="text-xs text-gray-500">Export your previous GM events and timestamps (CSV)</p>
                  </div>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] text-[10px] font-black uppercase tracking-widest text-white hover:bg-white transition-all hover:text-black">
                  Request CSV
               </button>
            </div>
         </div>

         <div className="mt-10 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4">
            <Info className="h-5 w-5 text-blue-500 shrink-0" />
            <div>
               <p className="text-[11px] font-bold text-blue-300 mb-1 leading-tight">Decentralized Storage Alert</p>
               <p className="text-[10px] text-blue-400/60 leading-relaxed font-medium">Your data is stored permanently on the Stacks blockchain. These exports are local snapshots for your own record keeping. You can also view raw data on the <span className="underline italic cursor-pointer">Stacks API Explorer.</span></p>
            </div>
         </div>
      </div>
    </div>
  );
}
