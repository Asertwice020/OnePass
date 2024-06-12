import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

const isAppLoadingSlice = createSlice({
  name: "isAppLoading",
  initialState,
  reducers: {
    setLoadingState: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setLoadingState } = isAppLoadingSlice.actions;
export const isAppLoadingReducer = isAppLoadingSlice.reducer;