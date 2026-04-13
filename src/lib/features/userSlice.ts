import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { getUserSession, getUserOnChainData, getOnChainBlockHeight } from '../stacks';

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
      state.username = fallbackName;
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
      
      // Always use Math.max for streaks and points to prevent stale chain data from overwriting optimistic UI
      if (action.payload.streak !== undefined) {
        state.streak = Math.max(state.streak, action.payload.streak);
      }
      if (action.payload.points !== undefined) {
        state.points = Math.max(state.points, action.payload.points);
      }
      if (action.payload.lastGm !== undefined) {
        state.lastGm = Math.max(state.lastGm, action.payload.lastGm);
      }
      if (action.payload.username) {
        state.username = action.payload.username;
      }
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setOptimisticPro(state, action: PayloadAction<boolean>) {
      state.isOptimisticPro = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gm_is_optimistic_pro', action.payload.toString());
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
        // Future: Fetch bio from Supabase or contract if added
      }));
    }
  } finally {
    dispatch(userSlice.actions.setLoading(false));
  }
};

export const { setUserData, logout, updateStats, setUsername, setLoading, setBlockHeight, setOptimisticPro } = userSlice.actions;
export default userSlice.reducer;
