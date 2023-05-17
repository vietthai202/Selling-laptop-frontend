import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./projectSlice";

const store = configureStore({
  reducer: projectReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
