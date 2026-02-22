'use client';
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks';
// import ProductCard from './ProductCard';
import Link from 'next/link';
import ProductCard from '../ui/ProductCard';
import { Product } from '../../types';
// import type { ProductCategory } from '@/types';

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


// "use client";

// import Image from "next/image";
// import { products } from "@/components/data";

// export default function ProductsSection() {
//   return (
//     <section id="products" className="py-16 lg:py-30 bg-white">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Heading */}
//         <div className="text-center mb-20">
//           <h2 className="text-4xl font-extrabold tracking-widest mb-4">
//             SIGNATURE COLLECTION
//           </h2>

//           <div className="flex items-center justify-center gap-4 mb-6">
//             <span className="w-16 h-px bg-black/40" />
//             <span className="text-black/60">✻</span>
//             <span className="w-16 h-px bg-black/40" />
//           </div>

//           <p className="max-w-2xl mx-auto italic text-black/60 leading-relaxed">
//             Explore our curated selection of premium fragrances, elegant abayas, and exquisite accessories. 
//             Each piece is carefully crafted to embody timeless sophistication and modern luxury.
//           </p>
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="group transition-transform duration-300 hover:-translate-y-2"
//             >
//               {/* Image Wrapper (FIXED HEIGHT) */}
//               <div className="relative h-96 bg-[#f7f7f7] overflow-hidden rounded-sm group">
//                 {/* Discount Badge */}
//                 {product.discount && (
//                   <span className="absolute top-4 right-4 z-30 bg-black text-white text-xs px-3 py-1 tracking-wide">
//                     {product.discount}
//                   </span>
//                 )}

//                 {/* Image */}
//                 <Image
//                   src={product.image}
//                   alt={product.name}
//                   fill
//                   className="object-cover transition-transform duration-700 group-hover:scale-110"
//                 />

//                 {/* Dark Overlay */}
//                 <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10" />

//                 {/* Hover CTA */}
//                 <div className="absolute bottom-4 left-5 z-20 flex items-center justify-center gap-3 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
//                   {/* Animated Line */}
//                   <div className="w-1 h-px bg-white transition-all duration-500 group-hover:w-8" />

//                   {/* Add to Cart */}
//                   <span className="text-white text-xs uppercase font-extrabold cursor-pointer">
//                     Add to Cart
//                   </span>
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="mt-6">
//                 <span className="flex items-center justify-between">
//                   <h4 className="text-sm font-semibold tracking-wide uppercase mb-1">
//                     {product.name}
//                   </h4>

//                   <div className="flex items-center gap-2">
//                     {product.oldPrice && (
//                       <span className="text-sm line-through text-black/40">
//                         £{product.oldPrice}
//                       </span>
//                     )}
//                     <span className="text-sm font-semibold">
//                       £{product.price}
//                     </span>
//                   </div>
//                 </span>

//                 <div className="flex gap-2">
//                   <p className="text-xs italic text-black/50 mb-2">
//                     {product.category}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* View All Button */}
//         <div className="text-center mt-16">
//           <button className="border-2 border-black px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
//             View Full Collection
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }