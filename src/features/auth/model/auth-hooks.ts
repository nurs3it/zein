import { useMutation, useQuery } from '@tanstack/react-query';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../api/auth-api';
import { useAppDispatch } from '@/shared/store/hooks';
import { setUser, clearUser, setError, setLoading } from './auth-slice';
import { LoginCredentials, RegisterCredentials } from '@/shared/types';
import { toast } from 'sonner';

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: data => {
      if (data.success && data.data) {
        dispatch(setUser(data.data));
        toast.success(data.message || 'Вход выполнен успешно');
      } else {
        dispatch(setError(data.error || 'Ошибка входа'));
        toast.error(data.error || 'Ошибка входа');
      }
    },
    onError: () => {
      dispatch(setError('Произошла ошибка при входе'));
      toast.error('Произошла ошибка при входе');
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

export const useRegister = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => registerUser(credentials),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: data => {
      if (data.success && data.data) {
        dispatch(setUser(data.data));
        toast.success(data.message || 'Регистрация выполнена успешно');
      } else {
        dispatch(setError(data.error || 'Ошибка регистрации'));
        toast.error(data.error || 'Ошибка регистрации');
      }
    },
    onError: () => {
      dispatch(setError('Произошла ошибка при регистрации'));
      toast.error('Произошла ошибка при регистрации');
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 минут
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: data => {
      dispatch(clearUser());
      toast.success(data.message || 'Выход выполнен успешно');
    },
    onError: () => {
      toast.error('Произошла ошибка при выходе');
    },
  });
};
