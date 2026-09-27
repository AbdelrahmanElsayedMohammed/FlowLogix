import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '../api';
import { getApiErrorMessage } from '@/lib/api-client';
import type { LoginRequest, RegisterTenantRequest } from '@/lib/api-types';

export function useLogin() {
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      const dest = response.user.role === 'DELIVERY_AGENT' ? '/my-deliveries' : '/dashboard';
      navigate(dest, { replace: true });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RegisterTenantRequest) => authApi.register(data),
    onSuccess: () => navigate('/login', { replace: true }),
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout();
      navigate('/login', { replace: true });
    },
  });
}

export { getApiErrorMessage };
