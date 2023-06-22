import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username?: string;
  role?: string;
  token?: string;
}

const initialState: UserState = {
  username: undefined,
  role: undefined,
  token: undefined,
};

const userSlice = createSlice({
  name: "userLogged",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ username: string; role: string; token?: string }>) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
  },
});

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer;
