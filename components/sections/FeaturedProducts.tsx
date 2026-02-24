'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../ui/ProductCard';
import { Product } from '../../types';
import { useProducts } from '../../hooks';

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Perfumes', value: 'Perfume' },
  { label: 'Abayas', value: 'Abayas' },
  { label: 'Accessories', value: 'Accessories' },
  { label: "Men's", value: 'MensWear' },
  { label: "Children's", value: 'ChildrenWear' },
];

export default function FeaturedProducts() {
  const { items, featured, isLoading, meta, fetchByCategory, fetchPage } = useProducts();
  const [activeCategory, setActiveCategory] = useState('');

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat) {
      fetchByCategory(cat);
    } else {
      fetchPage(1, { limit: 8 });
    }
  };

  const products = items.length > 0 ? items : featured;

  return (
    <section id="products" className="py-24 bg-[#faf8f3]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">Handpicked Pieces</p>
          <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            New Arrivals
          </h2>
          <div className="w-16 h-px bg-yellow-400 mx-auto mt-6" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleCategory(value)}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                activeCategory === value
                  ? 'bg-black text-white'
                  : 'border border-gray-300 text-gray-600 hover:border-black hover:text-black'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 mb-3" />
                <div className="h-3 bg-gray-200 rounded mb-2 w-1/3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block border-2 border-black px-10 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
          >
            View All Products
            {meta && <span className="ml-2 text-gray-400 font-normal">({meta.total})</span>}
          </Link>
        </div>
      </div>
    </section>
  );
}