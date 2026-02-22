'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, ChevronLeft, ChevronRight, Star, Truck, Shield, RotateCcw, Loader } from 'lucide-react';
// import { useProducts, useCart } from '@/hooks';
import Link from 'next/link';
import Footer from '../../../components/Footer';
import { useProducts, useCart } from '../../../hooks';
// import Footer from '@/components/Footer';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { current, isLoading, fetchById } = useProducts(false);
  const { addItem } = useCart();
  const [currentImg, setCurrentImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (id) fetchById(id);
  }, [id]);

  const handleAdd = () => {
    if (!current) return;
    addItem(current, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="pt-[120px] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 spinner" />
      </div>
    );
  }

  if (!current) {
    return (
      <div className="pt-[120px] min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Product not found</p>
        <Link href="/products" className="text-sm font-bold underline">Browse all products</Link>
      </div>
    );
  }

  return (
    <>
      <div className="pt-[120px] min-h-screen bg-[#faf8f3]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-black transition">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black transition">Products</Link>
            <span>/</span>
            <span className="text-black font-medium">{current.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-14">
            {/* Images */}
            <div>
              <div className="aspect-square relative overflow-hidden bg-white mb-4">
                {current.images?.[currentImg] ? (
                  <Image src={current.images[currentImg]} alt={current.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ShoppingBag size={48} className="text-gray-300" />
                  </div>
                )}
              </div>

              {current.images && current.images.length > 1 && (
                <div className="flex gap-3">
                  {current.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`relative w-16 h-16 flex-shrink-0 overflow-hidden ${currentImg === i ? 'ring-2 ring-black' : 'ring-1 ring-gray-200'}`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:pt-4">
              <p className="text-xs text-yellow-600 font-bold uppercase tracking-widest mb-2">{current.category}</p>
              <h1 className="text-3xl md:text-4xl font-light mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {current.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-black">£{current.price.toFixed(2)}</span>
                {current.oldPrice && (
                  <span className="text-gray-400 line-through text-lg">£{current.oldPrice.toFixed(2)}</span>
                )}
                {current.discount && (
                  <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5">{current.discount}</span>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-8">{current.description}</p>

              {/* Quantity + Add */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-300">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-12 flex items-center justify-center hover:bg-gray-50 transition">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(current.stock, q + 1))} className="w-10 h-12 flex items-center justify-center hover:bg-gray-50 transition" disabled={qty >= current.stock}>
                    <ChevronRight size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={current.stock === 0}
                  className={`flex-1 h-12 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-black text-white hover:bg-yellow-400 hover:text-black disabled:opacity-40'
                  }`}
                >
                  <ShoppingBag size={15} />
                  {current.stock === 0 ? 'Out of Stock' : added ? 'Added to Bag!' : 'Add to Bag'}
                </button>
              </div>

              {/* Stock */}
              <p className={`text-xs font-medium mb-8 ${current.stock < 5 && current.stock > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                {current.stock === 0 ? 'Out of stock' : current.stock < 5 ? `Only ${current.stock} left in stock` : `In stock (${current.stock} available)`}
              </p>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-8">
                {[
                  { Icon: Truck, label: 'Free Shipping', sub: 'Orders over £100' },
                  { Icon: Shield, label: 'Secure Payment', sub: 'Stripe encrypted' },
                  { Icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="text-center">
                    <Icon size={20} className="mx-auto mb-2 text-yellow-600" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">{label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}