'use client';

import { Edit2, MapPin, Mail, Phone, Globe, Shield, Calendar, Award, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mock-data';

interface ProfileSettingsCardsProps {
  targetAddress: string;
}

export default function ProfileSettingsCards({ targetAddress }: ProfileSettingsCardsProps) {
  const { address: currentAddress } = useSelector((state: RootState) => state.user);
  const user = MOCK_USERS[targetAddress] || (currentAddress === targetAddress ? useSelector((state: RootState) => state.user.mockData) : null);
  const isSelf = currentAddress === targetAddress;

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
      
      {/* SECTION 1: USER SUMMARY */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative group hover:border-white/10 transition-all shadow-2xl">
        <div className="flex items-center gap-8">
           <div className="h-24 w-24 rounded-[2rem] overflow-hidden border-2 border-white/5 bg-black shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-500">
              <img src={`https://api.dicebear.com/7.x/builder/svg?seed=${targetAddress}`} alt="avatar" />
           </div>
           <div className="flex-1">
              <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-1">{user.username}</h2>
              <p className="text-sm font-medium text-gray-500 mb-2">Protocol Participant</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono tracking-tighter">
                 <MapPin className="h-3 w-3" />
                 Stacks Mainnet, {targetAddress.substring(0, 8)}...
              </div>
           </div>
           {isSelf && (
             <button className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all">
               <Edit2 className="h-3.5 w-3.5" />
               Edit
             </button>
           )}
        </div>
      </div>

      {/* SECTION 2: PROTOCOL INFORMATION */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative group hover:border-white/10 transition-all shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Protocol Metrics</h3>
            {isSelf && (
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
                 <Edit2 className="h-3 w-3" />
                 Customize
               </button>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">Current Streak</p>
               <p className="text-lg font-bold text-white">{user.streak} <span className="text-xs text-gray-600">Active Days</span></p>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">Social Reputation</p>
               <p className="text-lg font-bold text-white">{user.points.toLocaleString()} <span className="text-xs text-gray-600">RP</span></p>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">Network Level</p>
               <p className="text-lg font-bold text-white">Member <span className="text-xs text-gray-600">Rank #402</span></p>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">Verification Status</p>
               <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                  <Shield className="h-4 w-4" />
                  On-Chain Verified
               </div>
            </div>
         </div>

         <div className="mt-8 pt-6 border-t border-white/[0.03]">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-3">Biography</p>
            <p className="text-sm font-medium text-gray-500 leading-relaxed">
              {user.bio || "No on-chain biography detected for this principal. Maintaining status in the global network."}
            </p>
         </div>
      </div>

      {/* SECTION 3: SOCIAL GRAPH */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative group hover:border-white/10 transition-all shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Social Graph</h3>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
               <Edit2 className="h-3 w-3" />
               View All
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">Connections (Following)</p>
               <div className="flex items-center gap-2 text-lg font-bold text-white">
                  <Globe className="h-4 w-4 text-blue-500/40" />
                  {user.following} <span className="text-xs text-gray-600 font-medium">Nodes</span>
               </div>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">Connectors (Followers)</p>
               <div className="flex items-center gap-2 text-lg font-bold text-white">
                  <Users className={`h-4 w-4 ${user.followers > 10 ? 'text-green-500/40' : 'text-gray-700'}`} />
                  {user.followers} <span className="text-xs text-gray-600 font-medium">Nodes</span>
               </div>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">Joined Network</p>
               <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                  <Calendar className="h-4 w-4 opacity-30" />
                  March 2024
               </div>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">Protocol Rewards</p>
               <div className="flex items-center gap-2 text-sm font-bold text-amber-500/60">
                  <Award className="h-4 w-4" />
                  Early Adopter Badge
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
