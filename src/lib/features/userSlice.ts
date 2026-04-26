import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { getUserSession, getUserOnChainData, getOnChainBlockHeight } from '../stacks';
import { supabase } from '../supabase';
import type { RootState } from '../store';

interface UserState {
  address: string | null;
  profile: any | null;
  isConnected: boolean;
  isLoading: boolean;
  gmBalance: number;
  username: string | null;
  bio: string | null;
  streak: number;
  points: number;
  lastGm: number;
  isPro: boolean;
  proExpiry: number;
  healCount: number;
  followers: number;
  following: number;
  totalTipped: number;
  totalReceived: number;
  currentBlockHeight: number;
  isSimulationMode: boolean;
  isOptimisticPro: boolean;
  sessionToken: string | null;
  avatar: string | null;
  website: string | null;
  isStreakBroken: boolean;
}

const getInitialOptimisticState = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gm_is_optimistic_pro') === 'true';
  }
  return false;
};

const getInitialAddress = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gm_user_address');
};

const getInitialUsername = (address: string | null) => {
  if (typeof window === 'undefined' || !address) return null;
  return localStorage.getItem(`username_${address}`);
};

const getInitialSessionToken = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('gm_session_token');
  if (token && token.split('.').length !== 3) {
    localStorage.removeItem('gm_session_token');
    return null;
  }
  return token;
};

const getInitialNum = (key: string) => {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(key) || 0);
};

const getInitialBool = (key: string) => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(key) === 'true';
};

const initialAddress = getInitialAddress();
const initialToken = getInitialSessionToken();

const initialState: UserState = {
  address: initialAddress,
  profile: null,
  isConnected: !!initialToken, 
  isLoading: !!initialToken,
  gmBalance: getInitialNum('gm_token_balance'),
  username: getInitialUsername(initialAddress),
  bio: null,
  streak: getInitialNum('gm_streak'),
  points: getInitialNum('gm_points'),
  lastGm: getInitialNum('gm_last_gm'),
  isPro: getInitialBool('gm_is_pro'),
  proExpiry: getInitialNum('gm_pro_expiry'),
  healCount: getInitialNum('gm_heals'),
  followers: getInitialNum('gm_followers'),
  following: getInitialNum('gm_following'),
  totalTipped: getInitialNum('gm_total_tipped'),
  totalReceived: getInitialNum('gm_total_received'),
  currentBlockHeight: 0,
  isSimulationMode: false,
  isOptimisticPro: getInitialOptimisticState(),
  sessionToken: initialToken,
  avatar: typeof window !== 'undefined' ? localStorage.getItem('gm_avatar') : null,
  website: null,
  isStreakBroken: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setBlockHeight(state, action: PayloadAction<number>) {
      state.currentBlockHeight = action.payload;
    },
    setUserData(state, action: PayloadAction<{ address: string; profile: any }>) {
      const stxAddressObj = action.payload.profile.stxAddress;
      const fallbackName = typeof stxAddressObj === 'string' 
        ? stxAddressObj 
        : (stxAddressObj?.mainnet || stxAddressObj?.testnet || action.payload.address);

      state.address = action.payload.address;
      state.profile = action.payload.profile;
      state.isConnected = true;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('gm_user_address', action.payload.address);
      }
      
      // Only set username if we don't already have a valid on-chain one
      if (!state.username || state.username.startsWith('ST')) {
        state.username = fallbackName;
      }
    },
    setAddress(state, action: PayloadAction<string>) {
      state.address = action.payload;
      state.isConnected = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gm_user_address', action.payload);
      }
    },
    logout(state) {
      state.address = null;
      state.profile = null;
      state.isConnected = false;
      state.isLoading = false;
      state.gmBalance = 0;
      state.username = null;
      state.bio = null;
      state.streak = 0;
      state.points = 0;
      state.lastGm = 0;
      state.isPro = false;
      state.proExpiry = 0;
      state.healCount = 0;
      state.followers = 0;
      state.following = 0;
      state.totalTipped = 0;
      state.totalReceived = 0;
      state.avatar = null;
      state.sessionToken = null;
      state.isStreakBroken = false;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gm_user_address');
        localStorage.removeItem('gm_session_token');
        localStorage.removeItem('gm_is_optimistic_pro');
        
        // Clear the cookie via API
        fetch('/api/auth/logout', { method: 'POST' }).catch(err => console.error('Logout error:', err));
        
        // Clear Stacks session
        getUserSession()?.signUserOut();
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    updateStats(state, action: PayloadAction<{ 
      streak?: number; 
      points?: number; 
      lastGm?: number;
      username?: string | null;
      bio?: string | null;
      avatar?: string | null;
      gmBalance?: number;
      isPro?: boolean;
      proExpiry?: number;
      followers?: number;
      following?: number;
      healCount?: number;
      totalTipped?: number;
      totalReceived?: number;
      website?: string | null;
      isStreakBroken?: boolean;
    }>) {
      if (typeof window !== 'undefined' && action.payload) {
        // Protect monotonic stats: Only update localStorage if the incoming value is actually greater
        if (action.payload.streak !== undefined) {
          localStorage.setItem('gm_streak', action.payload.streak.toString());
        }
        if (action.payload.points !== undefined) {
          const currentPoints = Number(localStorage.getItem('gm_points') || 0);
          if (action.payload.points >= currentPoints) {
            localStorage.setItem('gm_points', action.payload.points.toString());
          }
        }
        
        if (action.payload.lastGm !== undefined) localStorage.setItem('gm_last_gm', action.payload.lastGm.toString());
        if (action.payload.gmBalance !== undefined) localStorage.setItem('gm_token_balance', action.payload.gmBalance.toString());
        if (action.payload.isPro !== undefined) localStorage.setItem('gm_is_pro', action.payload.isPro.toString());
        if (action.payload.proExpiry !== undefined) localStorage.setItem('gm_pro_expiry', action.payload.proExpiry.toString());
        if (action.payload.followers !== undefined) localStorage.setItem('gm_followers', action.payload.followers.toString());
        if (action.payload.following !== undefined) localStorage.setItem('gm_following', action.payload.following.toString());
        if (action.payload.healCount !== undefined) localStorage.setItem('gm_heals', action.payload.healCount.toString());
        if (action.payload.avatar !== undefined && action.payload.avatar) localStorage.setItem('gm_avatar', action.payload.avatar);
        if (action.payload.totalTipped !== undefined) localStorage.setItem('gm_total_tipped', action.payload.totalTipped.toString());
        if (action.payload.totalReceived !== undefined) localStorage.setItem('gm_total_received', action.payload.totalReceived.toString());
      }

      if (action.payload.isPro !== undefined) state.isPro = action.payload.isPro;
      if (action.payload.proExpiry !== undefined) state.proExpiry = action.payload.proExpiry;
      if (action.payload.followers !== undefined) state.followers = action.payload.followers;
      if (action.payload.following !== undefined) state.following = action.payload.following;
      if (action.payload.bio !== undefined) state.bio = action.payload.bio;
      if (action.payload.avatar !== undefined) state.avatar = action.payload.avatar;
      if (action.payload.website !== undefined) state.website = action.payload.website;
      if (action.payload.healCount !== undefined) state.healCount = action.payload.healCount;
      if (action.payload.gmBalance !== undefined) state.gmBalance = action.payload.gmBalance;
      if (action.payload.totalTipped !== undefined) state.totalTipped = action.payload.totalTipped;
      if (action.payload.totalReceived !== undefined) state.totalReceived = action.payload.totalReceived;
      if (action.payload.isStreakBroken !== undefined) state.isStreakBroken = action.payload.isStreakBroken;
      
      if (action.payload.streak !== undefined) {
        state.streak = action.payload.streak;
      }
      if (action.payload.points !== undefined) {
        state.points = Math.max(state.points, action.payload.points);
      }
      if (action.payload.lastGm !== undefined) {
        state.lastGm = Math.max(state.lastGm, action.payload.lastGm);
      }
      
      // Strict Persistence Logic: Supabase > localStorage > Address
      let incomingName = action.payload.username;
      
      // 1. If we have a real username (not ST...), set it and cache it
      if (incomingName && !incomingName.startsWith('ST')) {
        state.username = incomingName;
        if (typeof window !== 'undefined' && state.address) {
          localStorage.setItem(`username_${state.address}`, incomingName);
        }
      } 
      // 2. If incoming is null/address and we are already set to a real name, keep it
      else if (state.username && !state.username.startsWith('ST')) {
        // preserve current name
      } 
      // 3. Fallback to localStorage
      else if (typeof window !== 'undefined' && state.address) {
        const cached = localStorage.getItem(`username_${state.address}`);
        if (cached) {
          state.username = cached;
        } else {
          state.username = state.address;
        }
      }
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
      if (typeof window !== 'undefined' && state.address) {
        localStorage.setItem(`username_${state.address}`, action.payload);
      }
    },
    setOptimisticPro(state, action: PayloadAction<boolean>) {
      state.isOptimisticPro = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gm_is_optimistic_pro', action.payload.toString());
      }
    },
    setSessionToken(state, action: PayloadAction<string | null>) {
      if (typeof window !== 'undefined') {
        const token = action.payload;
        if (token && token.split('.').length === 3) {
          state.sessionToken = token;
          localStorage.setItem('gm_session_token', token);
        } else {
          state.sessionToken = null;
          localStorage.removeItem('gm_session_token');
        }
      }
    }
  },
});

export const fetchOnChainStats = (address: string) => async (dispatch: any, getState: any) => {
  dispatch(userSlice.actions.setLoading(true));
  try {
    const heightPromise = getOnChainBlockHeight();
    const dataPromise = getUserOnChainData(address);
    const { getGmTokenBalance } = require('../stacks');
    const gmBalancePromise = getGmTokenBalance(address);

    const [height, data, gmBalance] = await Promise.all([
      heightPromise,
      dataPromise,
      gmBalancePromise
    ]);

    if (height > 0) {
      dispatch(userSlice.actions.setBlockHeight(height));
    }
    const userState = (getState() as RootState).user;

    // --- HYBRID SYNC: Calculate effective stats using Block Heights ---
    const lastGmBlock = data?.lastGm || 0;
    const blocksSinceLastGm = height > 0 && lastGmBlock > 0 ? (height - lastGmBlock) : 0;
    
    // Streak Decay Logic: If > 288 blocks (~48 hours), the streak is technically broken
    // The contract resets it on the NEXT 'say-gm', but UI should show 0 now for accuracy.
    const GRACE_PERIOD_BLOCKS = 288;
    const isStreakBroken = blocksSinceLastGm > GRACE_PERIOD_BLOCKS;

    let finalStreak = data?.streak !== undefined ? data.streak : userState.streak;
    
    if (isStreakBroken) {
      console.log('--- HYBRID SYNC: Streak has decayed due to inactivity (missing > 48h) ---');
      // We keep the streak number in state but mark it broken so UI can show "Restore"
    }

    const today = new Date().toISOString().split('T')[0];
    const hasLocalGmToday = localStorage.getItem(`gm_date_${address}`) === today;
    
    // Lag Detection: If we said GM today locally, but the on-chain lastGm is still old
    const isChainLagging = hasLocalGmToday && (
      lastGmBlock === 0 || 
      (blocksSinceLastGm > 144) // Chain's last GM was from a previous cycle (> 24h ago)
    );

    let finalPoints = data?.points !== undefined ? data.points : userState.points;
    const finalIsPro = data?.isPro !== undefined ? data.isPro : userState.isPro;
    
    const isProUser = finalIsPro || userState.isOptimisticPro;
    const pointsPerGm = isProUser ? 10 : 5;

    if (isChainLagging) {
      console.log('--- HYBRID SYNC: Blockchain is lagging. Using optimistic increment ---');
      
      finalStreak = Math.max(finalStreak, (data?.streak || 0) + 1);
      finalPoints = Math.max(finalPoints, (data?.points || 0) + pointsPerGm);
    }
    
    
    console.log('--- SYNC COMPLETE: FINAL STREAK:', finalStreak, 'FINAL POINTS:', finalPoints, 'IS_PRO:', isProUser);

    // Always update with the best available data
    dispatch(userSlice.actions.updateStats({
      streak: finalStreak,
      points: finalPoints,
      username: data?.username || userState.username,
      isPro: finalIsPro,
      proExpiry: data?.proExpiry || userState.proExpiry,
      followers: data?.followers || userState.followers,
      following: data?.following || userState.following,
      healCount: data?.healCount || userState.healCount,
      totalTipped: data?.totalTipped || userState.totalTipped,
      totalReceived: data?.totalReceived || userState.totalReceived,
      isStreakBroken: isStreakBroken,
      gmBalance: gmBalance !== undefined ? gmBalance : userState.gmBalance
    }));

    if (data) {
      console.log('--- FETCH SUCCESS: Chain data received ---', data);
    } else {
      console.warn('--- FETCH WARNING: No data returned from chain, using local sync ---');
    }

    // --- FETCH SUPABASE PROFILE (Bio & Avatar) ---
    const { data: profile, error: supabaseError } = await supabase
      .from('profiles')
      .select('bio, username, avatar_url')
      .eq('address', address)
      .maybeSingle(); // Better for handling "no profile" without throwing 406

    if (profile) {
      const p = profile as any;
      dispatch(userSlice.actions.updateStats({
        bio: p.bio || '',
        username: p.username || null,
        avatar: p.avatar_url || null,
        website: p.website || null
      }));
    } else {
      // Fallback to localStorage if no profile found in Supabase
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(`username_${address}`);
        if (cached) {
          dispatch(userSlice.actions.updateStats({ username: cached }));
        }
      }
    }
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    dispatch(userSlice.actions.setLoading(false));
  }
};

export const { 
  setUserData, 
  setAddress,
  logout, 
  updateStats, 
  setUsername, 
  setLoading, 
  setBlockHeight, 
  setOptimisticPro,
  setSessionToken 
} = userSlice.actions;
export default userSlice.reducer;
