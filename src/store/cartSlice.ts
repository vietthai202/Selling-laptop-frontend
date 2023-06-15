import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  totalCartItem: number;
}

const initialState: CartState = {
  totalCartItem: 0,
};

const cartItemSlice = createSlice({
  name: "cartItem",
  initialState,
  reducers: {
    setTotalCartItem: (state, action: PayloadAction<number>) => {
      state.totalCartItem = action.payload;
    },
  },
});

export const { setTotalCartItem } = cartItemSlice.actions;

export default cartItemSlice.reducer;
