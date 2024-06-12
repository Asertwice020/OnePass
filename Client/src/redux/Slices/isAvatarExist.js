import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const isAvatarExistSlice = createSlice({
  name: "isAvatarExist",
  initialState,
  reducers: {
    setIsAvatarExist: (state, action) => {
      state = action.payload;
      console.log("its all coming from isAvatarExist reducer \n",{actionPayload: action.payload, state})
      return state;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { setIsAvatarExist, logout } = isAvatarExistSlice.actions;
export const isAvatarExistReducer = isAvatarExistSlice.reducer;