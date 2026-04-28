'use client';

import { Shield, ExternalLink, Key, Smartphone, Globe } from 'lucide-react';
import { APP_CONFIG, getExplorerLink } from '@/lib/config';

export default function SecuritySection({ address }: { address: string }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Security Overview</h3>
           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Secure Session</span>
           </div>
        </div>

        <div className="space-y-8">
           <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Globe className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">Wallet Connection</p>
                    <p className="text-xs text-gray-500">Stacks {APP_CONFIG.isMainnet ? 'Mainnet' : 'Testnet'} via Leather/Xverse</p>
                 </div>
              </div>
              <a 
                href={getExplorerLink(address)} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
              >
                 View on Explorer
                 <ExternalLink className="h-3 w-3" />
              </a>
           </div>

           <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Key className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">Session Keys</p>
                    <p className="text-xs text-gray-500">Authenticated via Gm Protocol v1.0</p>
                 </div>
              </div>
              <div className="text-[10px] font-bold text-gray-600 italic">Expires in 24h</div>
           </div>

           <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Smartphone className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">Device Status</p>
                    <p className="text-xs text-gray-500">Current browser authorized for GM broadcasts</p>
                 </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
           </div>
        </div>
      </div>

      {/* Protocol Admin (Only visible for deployer) */}
      {(address === 'SP1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSRKP54QX' || address === 'ST1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSRKP54QX') && (
        <div className="bg-[#0A0A0A] border border-red-500/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Protocol Admin</h3>
              <p className="text-xs text-gray-500">Authorized deployer controls</p>
            </div>
          </div>

          <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="max-w-md">
                <p className="text-sm font-bold text-white mb-2">Initialize Protocol Permissions</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Set the token contract governor to the social protocol. This is required for the protocol to mint rewards for tipping and GM streaks.
                </p>
                <button 
                  onClick={async () => {
                    const { initializeProtocol } = await import('@/lib/stacks');
                    await initializeProtocol();
                  }}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98]"
                >
                  Link Contracts & Set Governor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
