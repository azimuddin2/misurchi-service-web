import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import languageReducer from './features/language/languageSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { baseApi } from './api/baseApi';

const persistConfig = {
  key: 'auth',
  storage,
};

const persistConfigLanguage = {
  key: 'language',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedLanguageReducer = persistReducer(
  persistConfigLanguage,
  languageReducer,
);

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer, // ✅ Add baseApi.reducer
      auth: persistedAuthReducer,
      language: persistedLanguageReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware), // ✅ Add baseApi.middleware
  });

  return {
    store,
    persistor: persistStore(store),
  };
};

// ✅ Type exports
export type AppStore = ReturnType<typeof makeStore>['store'];
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
