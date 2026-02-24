/**
 * useToast — zero-dependency toast system.
 *
 * Usage anywhere in the app:
 *   import { useToast } from '../hooks/useToast';
 *   const toast = useToast();
 *   toast.success('Product saved!');
 *   toast.error('Something went wrong');
 *   toast.info('3 items in your cart');
 *
 * The <Toaster /> component must be rendered once at the root (in layout.tsx).
 */
'use client';
import { useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

// Global event bus — avoids needing a Context provider for simple toast triggers
const TOAST_EVENT = 'farhama:toast';

function emit(type: ToastType, message: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { type, message } }));
}

export function useToast() {
  const success = useCallback((message: string) => emit('success', message), []);
  const error   = useCallback((message: string) => emit('error',   message), []);
  const info    = useCallback((message: string) => emit('info',    message), []);
  const warning = useCallback((message: string) => emit('warning', message), []);
  return { success, error, info, warning };
}

export { TOAST_EVENT };