import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  projectString: string;
  loading: boolean;
}

const initialState: ProjectState = {
  projectString: "1",
  loading: false,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectString: (state, action: PayloadAction<string>) => {
      state.projectString = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProjectString, setLoading } = projectSlice.actions;

export default projectSlice.reducer;
