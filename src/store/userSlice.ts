import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username?: string;
  role?: string;
}

const initialState: UserState = {
  username: undefined,
  role: undefined,
};

const userSlice = createSlice({
  name: "userLogged",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ username: string; role: string }>) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
  },
});

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer;
