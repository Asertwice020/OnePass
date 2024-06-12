import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userData = action.payload.user;
    },

    updateAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.userData = null;
    },
  },
});

export const { login, logout, updateAccessToken } = userSlice.actions;
export const userReducer = userSlice.reducer

// Thunk action to handle logout process
export const performLogout = () => (dispatch) => {
  dispatch({ type: "generatePassword/logout" });
  dispatch({ type: "storedPasswords/logout" });
  dispatch({ type: "isAvatarExist/logout" });
};