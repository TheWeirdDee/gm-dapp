import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_USERS, CURRENT_USER_ADDRESS, User } from '../mock-data';

interface UserState {
  currentUser: User;
  allUsers: Record<string, User>;
}

const initialState: UserState = {
  currentUser: MOCK_USERS[CURRENT_USER_ADDRESS],
  allUsers: MOCK_USERS,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    sayGM(state) {
      // Simulate GM action: increase streak and points
      state.currentUser.streak += 1;
      state.currentUser.points += 50;
      state.allUsers[state.currentUser.address] = state.currentUser;
    },
    followUser(state, action: PayloadAction<string>) {
      const addressToFollow = action.payload;
      state.currentUser.following += 1;
      if (state.allUsers[addressToFollow]) {
        state.allUsers[addressToFollow].followers += 1;
      }
    },
  },
});

export const { sayGM, followUser } = userSlice.actions;
export default userSlice.reducer;
