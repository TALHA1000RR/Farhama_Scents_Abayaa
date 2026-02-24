'use client';
import { useEffect } from 'react';
import { selectCartTotal, selectCartCount, initCart, addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } from '../lib/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../lib/store';
import { Product } from '../types';




export function useCart() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((s) => s.cart);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);

  return {
    items,
    isOpen,
    total,
    count,
    addItem: (product: Product, quantity = 1) =>
      dispatch(addToCart({ product, quantity })),
    removeItem: (productId: string) => dispatch(removeFromCart(productId)),
    updateItem: (productId: string, quantity: number) =>
      dispatch(updateQuantity({ productId, quantity })),
    clear: () => dispatch(clearCart()),
    toggle: () => dispatch(toggleCart()),
    open: () => dispatch(openCart()),
    close: () => dispatch(closeCart()),
  };
}