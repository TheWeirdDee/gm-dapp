import { useState } from 'react';
import { 
  UserPlus, 
  UserCheck, 
  Flame, 
  Star, 
  Activity, 
  Settings, 
  Link as LinkIcon, 
  Calendar,
  Loader2,
  Crown
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { callContract } from '../lib/stacks';
import { fetchOnChainStats } from '../lib/features/userSlice';
import { APP_CONFIG } from '../lib/config';
import { 
  AnchorMode, 
  PostConditionMode, 
  principalCV 
} from '@stacks/transactions';

import IdentityAvatar from './IdentityAvatar';
import EditProfileModal from './EditProfileModal';

export default function ProfileHeader({ targetAddress }: { targetAddress: string }) {
  const dispatch = useDispatch();
  const { 
    address: currentAddress, 
    isConnected, 
    username, 
    points, 
    streak, 
    bio,
    followers, 
    following, 
    isPro, 
    isOptimisticPro 
  } = useSelector((state: RootState) => state.user);
  
  const isSelf = currentAddress === targetAddress;
  const activePro = isPro || isOptimisticPro;

  // For Phase 1, we only show data for the connected user. 
  // Phase 2 (Supabase) will allow viewing of other indexed users.
  const user = isSelf ? {
    username: username,
    bio: bio,
    streak: streak,
    points: points,
    followers: followers,
    following: following,
    isPro: activePro,
    avatar: undefined
  } : null;

  const [isFollowPending, setIsFollowPending] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isFollowing = false; // Will be real once indexing is active

  const handleFollow = async () => {
    if (!isConnected || !currentAddress || isSelf || isFollowPending) return;
    
    setIsFollowPending(true);
    try {
      console.log('Initiating Follow Transaction:', { from: currentAddress, to: targetAddress });

      await callContract({
        anchorMode: AnchorMode.Any,
        contractAddress: APP_CONFIG.contractAddress,
        contractName: APP_CONFIG.contractName,
        functionName: 'follow',
        functionArgs: [principalCV(targetAddress)],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        onFinish: (data: any) => {
          console.log('Follow Success - TXID:', data.txId);
          dispatch(fetchOnChainStats(targetAddress) as any);
          dispatch(fetchOnChainStats(currentAddress) as any);

          setTimeout(() => {
            setIsFollowPending(false);
          }, 4000);
        },
        onCancel: () => setIsFollowPending(false),
      });
    } catch (e: any) {
      console.error('Follow Error:', e);
      setIsFollowPending(false);
    }
  };

  const finalUser = user || {
    username: targetAddress.substring(0, 10),
    bio: "Metadata restricted while indexing.",
    streak: 0,
    points: 0,
    followers: 0,
    following: 0,
    isPro: false,
    avatar: undefined
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in duration-700">
      {/* Dynamic Banner */}
      <div className="h-32 bg-gradient-to-r from-[var(--color-accent)]/20 via-[var(--color-secondary)]/10 to-transparent relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>
      
      <div className="px-8 pb-10 relative">
        <div className="flex justify-between items-end -mt-12 mb-6">
          <IdentityAvatar address={targetAddress} src={finalUser.avatar} size="lg" className="h-28 w-28 border-4 border-[#0A0A0A] !shadow-2xl" />
          
          <div className="flex gap-3">
            {isSelf ? (
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs bg-white text-black hover:opacity-90 transition-all uppercase tracking-widest shadow-xl"
              >
                <Settings className="h-4 w-4" />
                Customize
              </button>
            ) : (
              <button 
                onClick={handleFollow}
                disabled={isFollowPending}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs transition-all uppercase tracking-widest shadow-xl ${
                  isFollowing 
                    ? 'bg-transparent border border-white/10 text-white hover:bg-white/5 hover:text-red-400 hover:border-red-400 group' 
                    : 'bg-[var(--color-accent)] text-black hover:bg-green-400'
                } ${isFollowPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isFollowPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Pending...
                  </>
                ) : isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4 group-hover:hidden" />
                    <span className="group-hover:hidden">Connected</span>
                    <span className="hidden group-hover:inline">Revoke</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Connect
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white tracking-tighter">{finalUser.username || 'Anonymous'}</h1>
              {finalUser.isPro && (
                <div className="flex items-center justify-center p-1.5 transition-all">
                  <Crown className="w-5 h-5 text-white fill-white/10" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1">
               <p className="text-gray-500 font-mono text-xs opacity-60 tracking-tighter">{targetAddress}</p>
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Verified</span>
               </div>
            </div>
          </div>
          
          <p className="text-gray-400 font-medium text-sm max-w-xl leading-relaxed">
             {finalUser.bio}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
               <Calendar className="h-4 w-4" />
               Joined {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
               <LinkIcon className="h-4 w-4" />
               <a href="#" className="hover:text-[var(--color-accent)] transition-colors">gm.social/{finalUser.username}</a>
            </div>
          </div>
          
          <div className="flex items-center gap-8 pt-4 border-t border-white/[0.03]">
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-xl">{finalUser.following}</span> 
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Connections</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-xl">{finalUser.followers}</span> 
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Connectors</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] transition-transform group-hover:scale-110">
               <Flame className="h-20 w-20 text-orange-500" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2">Max Streak</div>
            <div className="text-3xl font-black text-orange-500">{finalUser.streak} <span className="text-sm">Days</span></div>
          </div>
          
          <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] transition-transform group-hover:scale-110">
               <Star className="h-20 w-20 text-yellow-500" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2">Reputation</div>
            <div className="text-3xl font-black text-yellow-500">{(finalUser.points / 10).toFixed(1)} <span className="text-sm">RP</span></div>
          </div>

          <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] transition-transform group-hover:scale-110">
               <Activity className="h-20 w-20 text-blue-500" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2">Protocol Status</div>
            <div className="text-3xl font-black text-blue-500 uppercase tracking-tighter">Active</div>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
}
