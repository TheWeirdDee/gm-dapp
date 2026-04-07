import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_USERS, CURRENT_USER_ADDRESS, User } from '../mock-data';

interface UserState {
  currentUser: User;
  allUsers: Record<string, User>;
  isConnected: boolean;
}

const initialState: UserState = {
  currentUser: MOCK_USERS[CURRENT_USER_ADDRESS],
  allUsers: MOCK_USERS,
  isConnected: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    sayGM(state) {
      if (!state.isConnected) return;
      state.currentUser.streak += 1;
      state.currentUser.points += 50;
      state.allUsers[state.currentUser.address] = state.currentUser;
    },
    followUser(state, action: PayloadAction<string>) {
      if (!state.isConnected) return;
      const addressToFollow = action.payload;
      state.currentUser.following += 1;
      if (state.allUsers[addressToFollow]) {
        state.allUsers[addressToFollow].followers += 1;
      }
    },
    connectWallet(state) {
      state.isConnected = true;
    },
    disconnectWallet(state) {
      state.isConnected = false;
    }
  },
});

export const { sayGM, followUser, connectWallet, disconnectWallet } = userSlice.actions;
export default userSlice.reducer;
