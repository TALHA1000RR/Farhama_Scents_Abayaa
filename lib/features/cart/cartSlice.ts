import { CartItem, Product } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import type { CartItem, Product } from '../../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('farhama_cart') || '[]'); }
  catch { return []; }
};

const saveCart = (items: CartItem[]) => {
  if (typeof window !== 'undefined')
    localStorage.setItem('farhama_cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[], isOpen: false } as CartState,
  reducers: {
    initCart(state) {
      state.items = loadCart();
    },
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.product._id === product._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else {
        state.items.push({ product, quantity });
      }
      saveCart(state.items);
      state.isOpen = true;
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product._id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.product._id !== productId);
      } else {
        const item = state.items.find((i) => i.product._id === productId);
        if (item) item.quantity = Math.min(quantity, item.product.stock);
      }
      saveCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCart([]);
    },
    toggleCart(state) { state.isOpen = !state.isOpen; },
    openCart(state) { state.isOpen = true; },
    closeCart(state) { state.isOpen = false; },
  },
});

export const {
  initCart, addToCart, removeFromCart, updateQuantity,
  clearCart, toggleCart, openCart, closeCart,
} = cartSlice.actions;

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0);

export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((s, i) => s + i.quantity, 0);

export default cartSlice.reducer;