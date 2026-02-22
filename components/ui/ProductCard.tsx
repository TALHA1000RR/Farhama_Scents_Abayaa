'use client';
import Image from 'next/image';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
// import type { Product } from '@/types';
import { useCart } from '@/hooks';
import Link from 'next/link';
import { Product } from '../../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  return (
    <div className="group relative bg-white">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]} alt={product.name} fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <ShoppingBag size={32} className="text-gray-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="bg-yellow-400 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
              Featured
            </span>
          )}
          {product.discount && (
            <span className="bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
              {product.discount}
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
              Sold Out
            </span>
          )}
        </div>

        {/* Action overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="flex-1 bg-black text-white text-xs font-bold uppercase tracking-wider py-2.5 hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={13} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
            <Link
              href={`/products/${product._id}`}
              className="w-10 bg-white flex items-center justify-center hover:bg-yellow-400 transition-colors"
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="py-3 px-1">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{product.category}</p>
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-sm hover:text-yellow-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-black text-base">£{product.price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-xs">£{product.oldPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}