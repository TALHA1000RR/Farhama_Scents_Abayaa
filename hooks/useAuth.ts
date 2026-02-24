'use client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../api/services/api.service';
import { loginUser, registerUser, logoutUser, clearError } from '../lib/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../lib/store';
import { LoginInput, RegisterInput } from '../types';
import { useToast } from './useToast';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const toast    = useToast();
  const { user, isLoading, error, isInitialized } = useAppSelector((s) => s.auth);

  const login = useCallback(
    async (data: LoginInput): Promise<{ success: boolean; error?: string }> => {
      const result = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(result)) {
        toast.success(`Welcome back, ${result.payload.user.name}!`);
        if (result.payload.user.role === 'admin') {
          router.push('/admin/dashboard');
        }
        return { success: true };
      }
      const msg = result.payload as string;
      toast.error(msg || 'Sign in failed');
      return { success: false, error: msg };
    },
    [dispatch, router, toast],
  );

  const register = useCallback(
    async (data: RegisterInput): Promise<{ success: boolean; error?: string }> => {
      const result = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(result)) {
        toast.success(`Welcome to Farhama, ${result.payload.user.name}!`);
        if (result.payload.user.role === 'admin') {
          router.push('/admin/dashboard');
        }
        return { success: true };
      }
      const msg = result.payload as string;
      toast.error(msg || 'Registration failed');
      return { success: false, error: msg };
    },
    [dispatch, router, toast],
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
    toast.info('You have been signed out');
    router.push('/');
  }, [dispatch, router, toast]);

  const forgotPassword = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      try {
        await authService.forgotPassword(email);
        toast.success('Password reset email sent — check your inbox');
        return { success: true };
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Failed to send reset email';
        toast.error(msg);
        return { success: false, error: msg };
      }
    },
    [toast],
  );

  const resetPassword = useCallback(
    async (token: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        await authService.resetPassword(token, password);
        toast.success('Password reset successfully — please sign in');
        return { success: true };
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Failed to reset password';
        toast.error(msg);
        return { success: false, error: msg };
      }
    },
    [toast],
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