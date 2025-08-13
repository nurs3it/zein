import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Типизированные хуки для конкретных частей store
export const useTermPlanSelector = () => useAppSelector(state => state.termPlan);
export const useAuthSelector = () => useAppSelector(state => state.auth);
export const useNotificationsSelector = () => useAppSelector(state => state.notifications);
