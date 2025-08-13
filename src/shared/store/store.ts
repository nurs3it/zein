import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@/features/auth/model/auth-slice';
import { notificationsSlice } from '@/features/notifications/model/notifications-slice';
import { termPlanSlice } from '@/features/term-plan/model/term-plan-slice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    notifications: notificationsSlice.reducer,
    termPlan: termPlanSlice.reducer,
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
