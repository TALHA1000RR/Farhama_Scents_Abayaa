'use client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../api/services/api.service';
import { loginUser, registerUser, logoutUser, clearError } from '../lib/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../lib/store';
import { LoginInput, RegisterInput } from '../types';
// import { useAppDispatch, useAppSelector } from '@/store';
// import {
//   loginUser,
//   registerUser,
//   logoutUser,
//   clearError,
//   updateUser,
// } from '@/store/slices/authSlice';
// import { authService } from '@/store/services/api.services';
// import type { LoginInput, RegisterInput } from '@/types';

/**
 * useAuth — centralised auth hook.
 *
 * Returns:
 *  - user            Current authenticated user (or null)
 *  - isLoading       True while login / register is in flight
 *  - error           Last auth error string (or null)
 *  - isInitialized   True once localStorage has been checked on mount
 *  - isAdmin         Shorthand: user.role === 'admin'
 *  - login(data)     → { success, error? }
 *  - register(data)  → { success, error? }
 *  - logout()        Clears tokens + redirects to /
 *  - clearError()    Reset error state
 *  - forgotPassword(email) → { success, error? }
 *  - resetPassword(token, password) → { success, error? }
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isLoading, error, isInitialized } = useAppSelector((s) => s.auth);

  const login = useCallback(
    async (data: LoginInput): Promise<{ success: boolean; error?: string }> => {
      const result = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(result)) {
        if (result.payload.user.role === 'admin') {
          router.push('/admin/dashboard');
        }
        return { success: true };
      }
      return { success: false, error: result.payload as string };
    },
    [dispatch, router],
  );

  const register = useCallback(
    async (data: RegisterInput): Promise<{ success: boolean; error?: string }> => {
      const result = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(result)) {
        if (result.payload.user.role === 'admin') {
          router.push('/admin/dashboard');
        }
        return { success: true };
      }
      return { success: false, error: result.payload as string };
    },
    [dispatch, router],
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
    router.push('/');
  }, [dispatch, router]);

  const forgotPassword = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      try {
        await authService.forgotPassword(email);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.response?.data?.message || 'Failed to send reset email' };
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async (token: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        await authService.resetPassword(token, password);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.response?.data?.message || 'Failed to reset password' };
      }
    },
    [],
  );

  return {
    user,
    isLoading,
    error,
    isInitialized,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError: () => dispatch(clearError()),
  };
}