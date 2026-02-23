'use client';
import { useEffect } from 'react';
import { selectCartTotal, selectCartCount, initCart, addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } from '../lib/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../lib/store';
import { Product } from '../types';



/**
 * useCart — shopping cart state and actions.
 *
 * Cart hydration from localStorage runs ONCE in ReduxProvider (via initCart).
 * This hook intentionally does NOT call initCart — calling it from multiple
 * component instances (Navbar, CartSidebar, ProductCard, CheckoutModal) causes
 * redundant dispatches on every mount that can race with toggle state.
 */
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




/**
 * useCart — shopping cart state and actions.
 *
 * Returns:
 *  - items      Array of { product, quantity }
 *  - isOpen     Whether the cart sidebar is visible
 *  - total      Subtotal (£) across all items
 *  - count      Total item count (sum of all quantities)
 *  - addItem(product, quantity?)   Add or increment product
 *  - removeItem(productId)         Remove product entirely
 *  - updateItem(productId, qty)    Set exact quantity (0 = remove)
 *  - clear()                       Empty the entire cart
 *  - toggle()                      Open/close cart sidebar
 *  - open() / close()              Explicit sidebar open/close
 */
// export function useCart() {
//   const dispatch = useAppDispatch();
//   const { items, isOpen } = useAppSelector((s) => s.cart);
//   const total = useAppSelector(selectCartTotal);
//   const count = useAppSelector(selectCartCount);

//   // Hydrate cart from localStorage on first mount
//   useEffect(() => {
//     dispatch(initCart());
//   }, [dispatch]);

//   return {
//     items,
//     isOpen,
//     total,
//     count,
//     addItem: (product: Product, quantity = 1) =>
//       dispatch(addToCart({ product, quantity })),
//     removeItem: (productId: string) => dispatch(removeFromCart(productId)),
//     updateItem: (productId: string, quantity: number) =>
//       dispatch(updateQuantity({ productId, quantity })),
//     clear: () => dispatch(clearCart()),
//     toggle: () => dispatch(toggleCart()),
//     open: () => dispatch(openCart()),
//     close: () => dispatch(closeCart()),
//   };
// }