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
  currentBlockHeight: number;
  isSimulationMode: boolean;
  isOptimisticPro: boolean;
  sessionToken: string | null;
  avatar: string | null;
  website: string | null;
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
  currentBlockHeight: 0,
  isSimulationMode: false,
  isOptimisticPro: getInitialOptimisticState(),
  sessionToken: initialToken,
  avatar: typeof window !== 'undefined' ? localStorage.getItem('gm_avatar') : null,
  website: null,
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
    logout(state) {
      state.address = null;
      state.profile = null;
      state.isConnected = false;
      state.isLoading = false;
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
      state.avatar = null;
      state.sessionToken = null;
      
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
      isPro?: boolean;
      proExpiry?: number;
      followers?: number;
      following?: number;
      healCount?: number;
      website?: string | null;
    }>) {
      if (typeof window !== 'undefined') {
        if (action.payload.streak !== undefined) localStorage.setItem('gm_streak', action.payload.streak.toString());
        if (action.payload.points !== undefined) localStorage.setItem('gm_points', action.payload.points.toString());
        if (action.payload.lastGm !== undefined) localStorage.setItem('gm_last_gm', action.payload.lastGm.toString());
        if (action.payload.isPro !== undefined) localStorage.setItem('gm_is_pro', action.payload.isPro.toString());
        if (action.payload.proExpiry !== undefined) localStorage.setItem('gm_pro_expiry', action.payload.proExpiry.toString());
        if (action.payload.followers !== undefined) localStorage.setItem('gm_followers', action.payload.followers.toString());
        if (action.payload.following !== undefined) localStorage.setItem('gm_following', action.payload.following.toString());
        if (action.payload.healCount !== undefined) localStorage.setItem('gm_heals', action.payload.healCount.toString());
        if (action.payload.avatar !== undefined && action.payload.avatar) localStorage.setItem('gm_avatar', action.payload.avatar);
      }

      if (action.payload.isPro !== undefined) state.isPro = action.payload.isPro;
      if (action.payload.proExpiry !== undefined) state.proExpiry = action.payload.proExpiry;
      if (action.payload.followers !== undefined) state.followers = action.payload.followers;
      if (action.payload.following !== undefined) state.following = action.payload.following;
      if (action.payload.bio !== undefined) state.bio = action.payload.bio;
      if (action.payload.avatar !== undefined) state.avatar = action.payload.avatar;
      if (action.payload.website !== undefined) state.website = action.payload.website;
      if (action.payload.healCount !== undefined) state.healCount = action.payload.healCount;
      
      if (action.payload.streak !== undefined) {
        state.streak = Math.max(state.streak, action.payload.streak);
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
    const height = await getOnChainBlockHeight();
    if (height > 0) {
      dispatch(userSlice.actions.setBlockHeight(height));
    }

    const data: any = await getUserOnChainData(address);
    if (data) {
      console.log('--- FETCH SUCCESS: Updating Redux Stats ---', data);
      
      // HYBRID SYNC: If chain says 0 but Supabase has current GM, bridge it
      let finalStreak = data.streak;
      let finalPoints = data.points;
      
      const today = new Date().toISOString().split('T')[0];
      const hasLocalGm = localStorage.getItem(`gm_date_${address}`) === today;

      if (finalStreak === 0 && hasLocalGm) {
        console.log('--- HYBRID SYNC: Chain is lagging, using immediate activity data ---');
        finalStreak = 1;
        
        // Multiplier fix: 1.0 RP for Pro (10), 0.5 RP for Standard (5)
        const userState = (getState() as RootState).user;
        const isProUser = data.isPro || userState.isOptimisticPro;
        const lagPoints = isProUser ? 10 : 5;
        finalPoints = Math.max(finalPoints, lagPoints);
      }

      dispatch(userSlice.actions.updateStats({
        streak: finalStreak,
        points: finalPoints,
        username: data.username,
        isPro: data.isPro,
        proExpiry: data.proExpiry,
        followers: data.followers,
        following: data.following
      }));
    } else {
      console.warn('--- FETCH WARNING: No data returned from chain ---');
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
  logout, 
  updateStats, 
  setUsername, 
  setLoading, 
  setBlockHeight, 
  setOptimisticPro,
  setSessionToken 
} = userSlice.actions;
export default userSlice.reducer;
