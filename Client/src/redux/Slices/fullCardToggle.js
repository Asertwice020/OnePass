import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toggle: false,
  cardId: null,
};

const fullCardToggleSlice = createSlice({
  name: "fullCardToggle",
  initialState,
  reducers: {
    handleToggle: (state, action) => {
      state.toggle = action.payload;
    },

    handleCardId: (state, action) => {
      state.cardId = action.payload;
    },
    
    logout: (state) => {
      return initialState;
    },
  },
});

export const { handleToggle, handleCardId, logout } = fullCardToggleSlice.actions;
export const fullCardToggleReducer = fullCardToggleSlice.reducer;
