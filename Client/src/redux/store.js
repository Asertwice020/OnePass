import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { userReducer } from "./Slices/userSlice";
import { generatePasswordReducer } from "./Slices/generatePasswordSlice";
import { storedPasswordsReducer } from "./Slices/storedPasswordsSlice";
import { isAvatarExistReducer } from "./Slices/isAvatarExist"
import { fullCardToggleReducer } from './Slices/fullCardToggle'
import { isAppLoadingReducer } from "./Slices/isAppLoading";
// import storage from 'redux-persist/lib/storage' // LOCAL STORAGE

// Persist configuration
const persistConfig = {
  key: "root",
  storage: storageSession,
  // transforms: [encryptTransform],
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  generatePassword: generatePasswordReducer,
  storedPasswords: storedPasswordsReducer,
  isAvatarExist: isAvatarExistReducer,
  fullCardToggle: fullCardToggleReducer,
  isAppLoading: isAppLoadingReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create persistor
export const persistor = persistStore(store);
