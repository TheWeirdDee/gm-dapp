import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { getUserSession, getUserOnChainData, getOnChainBlockHeight } from '../stacks';
import { supabase } from '../supabase';

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
}

const getInitialOptimisticState = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gm_is_optimistic_pro') === 'true';
  }
  return false;
};

const initialState: UserState = {
  address: null,
  profile: null,
  isConnected: false, 
  isLoading: false,
  username: null,
  bio: null,
  streak: 0,
  points: 0,
  lastGm: 0,
  isPro: false,
  proExpiry: 0,
  healCount: 0,
  followers: 0,
  following: 0,
  currentBlockHeight: 0,
  isSimulationMode: false,
  isOptimisticPro: getInitialOptimisticState(),
  sessionToken: typeof window !== 'undefined' ? localStorage.getItem('gm_session_token') : null,
  avatar: null,
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
      getUserSession()?.signUserOut();
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
    }>) {
      if (action.payload.isPro !== undefined) state.isPro = action.payload.isPro;
      if (action.payload.proExpiry !== undefined) state.proExpiry = action.payload.proExpiry;
      if (action.payload.followers !== undefined) state.followers = action.payload.followers;
      if (action.payload.following !== undefined) state.following = action.payload.following;
      if (action.payload.bio !== undefined) state.bio = action.payload.bio;
      if (action.payload.avatar !== undefined) state.avatar = action.payload.avatar;
      
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
      state.sessionToken = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('gm_session_token', action.payload);
        } else {
          localStorage.removeItem('gm_session_token');
        }
      }
    }
  },
});

export const fetchOnChainStats = (address: string) => async (dispatch: any) => {
  dispatch(userSlice.actions.setLoading(true));
  try {
    const height = await getOnChainBlockHeight();
    if (height > 0) {
      dispatch(userSlice.actions.setBlockHeight(height));
    }

    const data: any = await getUserOnChainData(address);
    if (data) {
      dispatch(userSlice.actions.updateStats({
        streak: data.streak,
        points: data.points,
        username: data.username,
        isPro: data.isPro,
        proExpiry: data.proExpiry,
        followers: data.followers,
        following: data.following
      }));
    }

    // --- FETCH SUPABASE PROFILE (Bio & Avatar) ---
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('address', address)
      .single();

    if (profile) {
      dispatch(userSlice.actions.updateStats({
        bio: profile.bio,
        username: profile.username, // From Supabase (Highest Priority)
        avatar: profile.avatar_url
      } as any));
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
