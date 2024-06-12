import { createSlice } from "@reduxjs/toolkit";

const generatePasswordSlice = createSlice({
  name: "generatePassword",
  initialState: "",
  reducers: {
    usePassword: (state, action) => {
      return action.payload;
    },
    logout: (state) => {
      return "";
    },
  },
});

export const { usePassword, logout } = generatePasswordSlice.actions;
export const generatePasswordReducer = generatePasswordSlice.reducer;
