import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@/features/auth/model/auth-slice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
