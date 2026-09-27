/**
 * auth.store.ts
 * Zustand store for JWT tokens and current user identity.
 * Tokens are persisted to localStorage for refresh across page loads.
 * Server user data (profile etc.) lives in TanStack Query, not here.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/lib/api-types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tenantId: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      tenantId: null,
      user: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),

      setUser: (user) =>
        set({ user, tenantId: user.tenantId, isAuthenticated: true }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          tenantId: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'flowlogix-auth',
      // Only persist these fields — never persist sensitive UI state
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tenantId: state.tenantId,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
