'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
// import { useCart, useAuth } from '@/hooks';
import CheckoutModal from './CheckoutModal';
import { useCart, useAuth } from '../../hooks';

export default function CartSidebar() {
  const { items, isOpen, total, count, removeItem, updateItem, toggle } = useCart();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  const shipping = total >= 100 ? 0 : 4.99;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" onClick={toggle} />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[201] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} />
            <h2 className="font-black tracking-widest uppercase">Your Bag</h2>
            {count > 0 && (
              <span className="bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button onClick={toggle} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <ShoppingBag size={60} className="text-gray-200" />
              <p className="text-gray-500 font-medium">Your bag is empty</p>
              <button
                onClick={toggle}
                className="border-2 border-black px-6 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product._id} className="flex gap-4 py-4 border-b border-gray-100">
                  {/* Product image */}
                  <div className="relative w-20 h-24 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={20} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                    <p className="font-bold text-sm mt-1">£{product.price.toFixed(2)}</p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateItem(product._id, quantity - 1)}
                        className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:border-black transition"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => updateItem(product._id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:border-black transition disabled:opacity-40"
                      >
                        <Plus size={11} />
                      </button>
                      <button
                        onClick={() => removeItem(product._id)}
                        className="ml-1 p-1 text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="font-bold text-sm flex-shrink-0">£{(product.price * quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>£{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `£${shipping.toFixed(2)}`}</span>
              </div>
              {total < 100 && (
                <p className="text-xs text-gray-400">Add £{(100 - total).toFixed(2)} more for free shipping</p>
              )}
              <div className="flex justify-between font-black text-base pt-2 border-t border-gray-100">
                <span>Total</span><span>£{(total + shipping).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  window.dispatchEvent(new CustomEvent('openAuth', { detail: 'signin' }));
                } else {
                  setShowCheckout(true);
                }
              }}
              className="w-full bg-black text-white py-4 text-sm font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition"
            >
              {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </button>
          </div>
        )}
      </aside>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={() => { setShowCheckout(false); toggle(); }}
        />
      )}
    </>
  );
}