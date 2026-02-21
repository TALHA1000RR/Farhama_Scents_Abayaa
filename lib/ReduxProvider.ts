'use client';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { initializeAuth } from './features/auth/authSlice';
import { initCart } from './features/cart/cartSlice';
import { store } from './store';
// import { store } from '../store';
// import { initializeAuth } from '../store/slices/authSlice';
// import { initCart } from '../store/slices/cartSlice';

function AppInit({ children }: { children: React.ReactNode }) {
  const done = useRef(false);
  useEffect(() => {
    if (!done.current) {
      done.current = true;
      store.dispatch(initializeAuth());
      store.dispatch(initCart());
    }
  }, []);
  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInit>{children}</AppInit>
    </Provider>
  );
}


