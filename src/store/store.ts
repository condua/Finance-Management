// src/store/store.ts (hoặc file store của bạn)

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '@/src/features/auth/auth.service';
import storage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import authReducer from '@/src/features/auth/authSlice';
import walletReducer from '@/src/features/wallet/walletSlice';
import categoryReducer from '@/src/features/category/categorySlice';
import transactionReducer from '@/src/features/transaction/transactionSlice';
import userReducer from '@/src/features/user/UserSlice';
import messageReducer from '@/src/features/message/messageSlice'; // Thêm dòng này
import { userApi } from '@/src/features/user/user.service';
import { appApi } from '@/src/features/api.service';
import { rtkQueryErrorLogger } from '@/src/services/errorHandling.service';

const authPersistConfig = {
  key: 'auth',
  version: 1,
  storage,
  // blacklist: [authApi.reducerPath]
};

const rootReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
  auth: persistReducer(authPersistConfig, authReducer),
  [authApi.reducerPath]: authApi.reducer,
  wallets: walletReducer,
  category: categoryReducer,
  transaction: transactionReducer,
  user: userReducer,
  messages: messageReducer, // Thêm dòng này
  [userApi.reducerPath]: userApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // Add the authApi middleware to the store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(appApi.middleware, authApi.middleware, userApi.middleware, rtkQueryErrorLogger),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
