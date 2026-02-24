'use client';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { initializeAuth } from './features/auth/authSlice';
import { initCart } from './features/cart/cartSlice';
import { store } from './store';




function AppInit({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      store.dispatch(initializeAuth());
      store.dispatch(initCart());
    }
  }, []);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInit>{children}</AppInit>
    </Provider>
  );
}