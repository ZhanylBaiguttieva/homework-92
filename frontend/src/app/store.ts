import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { usersReducer } from '../features/users/usersSlice.ts';
import {persistReducer, FLUSH, PAUSE, PERSIST, REHYDRATE, PURGE, REGISTER, persistStore } from "redux-persist";
import { messagesReducer } from '../features/posts/messagesSlice.ts';

const usersPersistConfig = {
  key:'chatRoom:users',
  storage: storage,
  whiteList: ['user'],
};

const rootReducer = combineReducers({
  users: persistReducer (usersPersistConfig, usersReducer),
  messages: messagesReducer,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, PAUSE, PERSIST, REHYDRATE, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;