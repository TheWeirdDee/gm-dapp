'use client';

import { UserPlus, UserCheck, Flame, Star, Activity } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser } from '../lib/features/userSlice';
import { RootState } from '../lib/store';

export default function ProfileHeader({ targetAddress }: { targetAddress: string }) {
  const dispatch = useDispatch();
  const allUsers = useSelector((state: RootState) => state.user.allUsers);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  
  const user = allUsers[targetAddress];
  const isSelf = currentUser.address === targetAddress;
  
  if (!user) {
    return <div className="card p-8 text-center text-gray-500">User not found</div>;
  }

  // To simulate follow state visually quickly without complex lists.
  const isFollowing = currentUser.following > 45 && !isSelf; // Mock trick

  const handleFollow = () => {
    dispatch(followUser(targetAddress));
  };

  return (
    <div className="card overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] opacity-20"></div>
      <div className="px-6 pb-6 relative">
        <div className="flex justify-between items-end -mt-12 mb-4">
          <div className="h-24 w-24 rounded-full bg-gray-900 border-4 border-black overflow-hidden flex-shrink-0">
            <img src={user.avatar} alt="avatar" className="h-full w-full object-cover" />
          </div>
          
          {!isSelf && (
            <button 
              onClick={handleFollow}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg ${
                isFollowing 
                  ? 'bg-transparent border border-gray-600 text-white hover:bg-white/5 hover:text-red-400 hover:border-red-400 group' 
                  : 'bg-[var(--color-foreground)] text-black hover:bg-gray-200'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4 group-hover:hidden" />
                  <span className="group-hover:hidden">Following</span>
                  <span className="hidden group-hover:inline">Unfollow</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Follow
                </>
              )}
            </button>
          )}
          {isSelf && (
            <button className="px-5 py-2 rounded-full font-bold text-sm bg-white/10 hover:bg-white/20 transition-colors border border-white/10">
              Edit Profile
            </button>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-black text-white">{user.username}</h1>
          <p className="text-gray-400 font-mono text-sm mt-1">{user.address}</p>
        </div>
        
        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-white">{user.following}</span> 
            <span className="text-gray-500">Following</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-white">{user.followers}</span> 
            <span className="text-gray-500">Followers</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
            <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <div className="font-bold text-white text-lg">{user.streak}</div>
            <div className="text-xs text-gray-500">Streak</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
            <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <div className="font-bold text-white text-lg">{user.points}</div>
            <div className="text-xs text-gray-500">Points</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
            <Activity className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="font-bold text-white text-lg">Daily</div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
