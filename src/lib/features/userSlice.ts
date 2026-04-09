import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { User } from '../mock-data';
import { getUserSession, getUserOnChainData } from '../stacks';

interface UserState {
  address: string | null;
  profile: any | null;
  isConnected: boolean;
  mockData: User | null; // Keep for UI placeholders
}

const initialState: UserState = {
  address: null,
  profile: null,
  isConnected: false,
  mockData: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<{ address: string; profile: any }>) {
      const stxAddressObj = action.payload.profile.stxAddress;
      const fallbackName = typeof stxAddressObj === 'string' 
        ? stxAddressObj 
        : (stxAddressObj?.mainnet || stxAddressObj?.testnet || action.payload.address);

      state.address = action.payload.address;
      state.profile = action.payload.profile;
      state.isConnected = true;
      
      // Only set mockData if it doesn't exist, or preserve the username if it's already custom
      if (!state.mockData) {
        state.mockData = {
          address: action.payload.address,
          username: fallbackName,
          avatar: action.payload.profile.image?.[0]?.contentUrl || '',
          streak: 0,
          points: 0,
          followers: 0,
          following: 0,
          bio: 'Stacks GM Enthusiast',
        };
      } else if (state.mockData.username.length > 30) {
        // If current name is an address, update it with the new fallback if needed
        state.mockData.username = fallbackName;
      }
    },
    logout(state) {
      state.address = null;
      state.profile = null;
      state.isConnected = false;
      state.mockData = null;
      getUserSession()?.signUserOut();
    },
    // Keep internal UI actions for now
    updateStats(state, action: PayloadAction<{ streak?: number; points?: number; username?: string | null }>) {
      if (state.mockData) {
        if (action.payload.streak !== undefined) state.mockData.streak = action.payload.streak;
        if (action.payload.points !== undefined) state.mockData.points = action.payload.points;
        // Only set username if it's a real decoded string, not null/undefined
        if (action.payload.username) state.mockData.username = action.payload.username;
      }
    },
    setUsername(state, action: PayloadAction<string>) {
      if (state.mockData) {
        state.mockData.username = action.payload;
        // No more localStorage overrides - trust the blockchain or memory
      }
    }
  },
});

export const fetchOnChainStats = (address: string) => async (dispatch: any) => {
  const data: any = await getUserOnChainData(address);
  if (data) {
    dispatch(updateStats({
      streak: data.streak,
      points: data.points,
      username: data.username // Decoded string or null
    }));
  }
};

export const { setUserData, logout, updateStats, setUsername } = userSlice.actions;
export default userSlice.reducer;
