import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../mock-data';
import { userSession } from '../stacks';

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
      const usernameString = typeof stxAddressObj === 'string' 
        ? stxAddressObj 
        : (stxAddressObj?.mainnet || stxAddressObj?.testnet || 'User');

      state.address = action.payload.address;
      state.profile = action.payload.profile;
      state.isConnected = true;
      // Initialize mock data structure for the real address
      state.mockData = {
        address: action.payload.address,
        username: usernameString,
        avatar: action.payload.profile.image?.[0]?.contentUrl || '',
        streak: 0,
        points: 0,
        followers: 0,
        following: 0,
        bio: 'Stacks GM Enthusiast',
      };
    },
    logout(state) {
      state.address = null;
      state.profile = null;
      state.isConnected = false;
      state.mockData = null;
      userSession.signUserOut();
    },
    // Keep internal UI actions for now
    updateStats(state, action: PayloadAction<{ streak?: number; points?: number }>) {
      if (state.mockData) {
        if (action.payload.streak !== undefined) state.mockData.streak = action.payload.streak;
        if (action.payload.points !== undefined) state.mockData.points = action.payload.points;
      }
    }
  },
});

export const { setUserData, logout, updateStats } = userSlice.actions;
export default userSlice.reducer;
