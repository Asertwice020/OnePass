import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allStoredPasswords: [],
  allCompromisedPasswords: [],
  passwordCount: 0,
  storedPasswordCount: 0,
  compromisedPasswordCount: 0,
  userId: null,
};

const storedPasswordsSlice = createSlice({
  name: "storedPasswords",
  initialState,
  reducers: {
    setAllStoredPasswords: (state, action) => {
      state.allStoredPasswords = action.payload.storedPasswords;
      state.allCompromisedPasswords = action.payload.compromisedPasswords;
      state.passwordCount = action.payload.passwordCount;
      state.storedPasswordCount = action.payload.storedPasswordCount;
      state.compromisedPasswordCount = action.payload.compromisedPasswordCount;
      state.userId = action.payload._id;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { setAllStoredPasswords, logout } = storedPasswordsSlice.actions;
export const storedPasswordsReducer = storedPasswordsSlice.reducer;
