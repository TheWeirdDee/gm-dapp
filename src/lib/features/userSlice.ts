import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { User } from '../mock-data';
import { getUserSession, getUserOnChainData, getOnChainBlockHeight } from '../stacks';

interface UserState {
  address: string | null;
  profile: any | null;
  isConnected: boolean;
  isLoading: boolean;
  mockData: User | null;
  isPro: boolean;
  proExpiry: number;
  healCount: number;
  followers: number;
  following: number;
  currentBlockHeight: number;
  isSimulationMode: boolean;
}

const initialState: UserState = {
  address: null,
  profile: null,
  isConnected: false, 
  isLoading: false,
  mockData: null,
  isPro: false,
  proExpiry: 0,
  healCount: 0,
  followers: 0,
  following: 0,
  currentBlockHeight: 0,
  isSimulationMode: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setBlockHeight(state, action: PayloadAction<number>) {
      state.currentBlockHeight = action.payload;
    },
    setUserData(state, action: PayloadAction<{ address: string; profile: any; cachedData?: User | null }>) {
      const stxAddressObj = action.payload.profile.stxAddress;
      const fallbackName = typeof stxAddressObj === 'string' 
        ? stxAddressObj 
        : (stxAddressObj?.mainnet || stxAddressObj?.testnet || action.payload.address);

      state.address = action.payload.address;
      state.profile = action.payload.profile;
      state.isConnected = true;
      
      // Use cached data if available, otherwise initialize defaults
      if (action.payload.cachedData) {
        state.mockData = action.payload.cachedData;
      } else if (!state.mockData) {
        state.mockData = {
          address: action.payload.address,
          username: fallbackName,
          avatar: action.payload.profile.image?.[0]?.contentUrl || '',
          streak: 0,
          points: 0,
          lastGm: 0,
          followers: 0,
          following: 0,
          bio: 'Stacks GM Enthusiast',
        };
      } else if (state.mockData.username.length > 30) {
        state.mockData.username = fallbackName;
      }
    },
    logout(state) {
      state.address = null;
      state.profile = null;
      state.isConnected = false;
      state.isLoading = false;
      state.mockData = null;
      getUserSession()?.signUserOut();
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    // Keep internal UI actions for now
    updateStats(state, action: PayloadAction<{ 
      streak?: number; 
      points?: number; 
      lastGm?: number;
      username?: string | null;
      isPro?: boolean;
      proExpiry?: number;
      healCount?: number;
      followers?: number;
      following?: number;
    }>) {
      if (action.payload.isPro !== undefined) state.isPro = action.payload.isPro;
      if (action.payload.proExpiry !== undefined) state.proExpiry = action.payload.proExpiry;
      if (action.payload.healCount !== undefined) state.healCount = action.payload.healCount;
      if (action.payload.followers !== undefined) state.followers = action.payload.followers;
      if (action.payload.following !== undefined) state.following = action.payload.following;

      // Ensure mockData exists before updating, or initialize it
      if (!state.mockData && state.address) {
        state.mockData = {
          address: state.address,
          username: state.address.substring(0, 8),
          avatar: '',
          streak: 0,
          points: 0,
          lastGm: 0,
          followers: 0,
          following: 0,
          bio: ''
        };
      }

      if (state.mockData) {
        // If in simulation mode, only allow updates from the UI (which we'll handle), or block on-chain overwrites
        // A 'Chain Update' typically has streak/points but not lastGm (or lastGm as 0)
        const isFromChain = action.payload.lastGm === undefined && action.payload.streak !== undefined;
        
        if (state.isSimulationMode && isFromChain) {
           return;
        }

        // Use Math.max if NOT in simulation mode. If in simulation mode, we allow setting to 0.
        if (action.payload.streak !== undefined) {
          state.mockData.streak = state.isSimulationMode 
            ? action.payload.streak 
            : Math.max(state.mockData.streak || 0, action.payload.streak);
        }
        if (action.payload.points !== undefined) {
          state.mockData.points = state.isSimulationMode 
            ? action.payload.points 
            : Math.max(state.mockData.points || 0, action.payload.points);
        }
        if (action.payload.lastGm !== undefined) {
          state.mockData.lastGm = Math.max(state.mockData.lastGm || 0, action.payload.lastGm);
        }
        if (action.payload.followers !== undefined) {
          state.mockData.followers = action.payload.followers;
        }
        
        if (action.payload.username) {
          state.mockData.username = action.payload.username;
        }
      }
    },
    setUsername(state, action: PayloadAction<string>) {
      if (state.mockData) {
        state.mockData.username = action.payload;
      }
    },
    resetStats(state) {
      state.isSimulationMode = true;
      if (state.mockData) {
        state.mockData.streak = 0;
        state.mockData.points = 0;
        state.mockData.lastGm = 0;
      }
    }
  },
});

export const fetchOnChainStats = (address: string) => async (dispatch: any) => {
  dispatch(userSlice.actions.setLoading(true));
  try {
    // 1. Fetch Latest Burn Block Height from Contract for perfect synchronization
    const height = await getOnChainBlockHeight();
    if (height > 0) {
      dispatch(userSlice.actions.setBlockHeight(height));
    }

    // 2. Fetch User Stats
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
  } finally {
    dispatch(userSlice.actions.setLoading(false));
  }
};

export const { setUserData, logout, updateStats, setUsername, setLoading, setBlockHeight, resetStats } = userSlice.actions;
export default userSlice.reducer;
