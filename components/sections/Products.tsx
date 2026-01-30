"use client";

import Image from "next/image";
import { products } from "@/components/data";

export default function ProductsSection() {
  return (
    <section id="products" className="py-16 lg:py-30 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold tracking-widest mb-4">
            SIGNATURE COLLECTION
          </h2>

          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-16 h-px bg-black/40" />
            <span className="text-black/60">✻</span>
            <span className="w-16 h-px bg-black/40" />
          </div>

          <p className="max-w-2xl mx-auto italic text-black/60 leading-relaxed">
            Explore our curated selection of premium fragrances, elegant abayas, and exquisite accessories. 
            Each piece is carefully crafted to embody timeless sophistication and modern luxury.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="group transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Image Wrapper (FIXED HEIGHT) */}
              <div className="relative h-96 bg-[#f7f7f7] overflow-hidden rounded-sm group">
                {/* Discount Badge */}
                {product.discount && (
                  <span className="absolute top-4 right-4 z-30 bg-black text-white text-xs px-3 py-1 tracking-wide">
                    {product.discount}
                  </span>
                )}

                {/* Image */}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10" />

                {/* Hover CTA */}
                <div className="absolute bottom-4 left-5 z-20 flex items-center justify-center gap-3 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  {/* Animated Line */}
                  <div className="w-1 h-px bg-white transition-all duration-500 group-hover:w-8" />

                  {/* Add to Cart */}
                  <span className="text-white text-xs uppercase font-extrabold cursor-pointer">
                    Add to Cart
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-6">
                <span className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold tracking-wide uppercase mb-1">
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-2">
                    {product.oldPrice && (
                      <span className="text-sm line-through text-black/40">
                        £{product.oldPrice}
                      </span>
                    )}
                    <span className="text-sm font-semibold">
                      £{product.price}
                    </span>
                  </div>
                </span>

                <div className="flex gap-2">
                  <p className="text-xs italic text-black/50 mb-2">
                    {product.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button className="border-2 border-black px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
            View Full Collection
          </button>
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
//     <section className="py-16 lg:30 bg-white">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Heading */}
//         <div className="text-center mb-20">
//           <h2 className="text-4xl font-extrabold tracking-widest mb-4">
//             FOREVER PIECES
//           </h2>

//           <div className="flex items-center justify-center gap-4 mb-6">
//             <span className="w-16 h-px bg-black/40" />
//             <span className="text-black/60">✻</span>
//             <span className="w-16 h-px bg-black/40" />
//           </div>

//           <p className="max-w-2xl mx-auto italic text-black/60 leading-relaxed">
//             “Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
//             Phasellus viverra nulla ut metus varius laoreet.”
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
//               <div className="relative h-70 bg-[#f7f7f7] overflow-hidden rounded-sm group">
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
//                 <div className="absolute bottom-4 left-5 z-20 flex  items-center justify-center gap-3 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
//                   {/* Animated Line (better than hr) */}
//                   <div className="w-1 h-px bg-white transition-all duration-500 group-hover:w-8" />

//                   {/* Add to Cart */}
//                   <span className="text-white text-xs uppercase font-extrabold">
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

//                   {product.oldPrice && (
//                     <span className="text-sm line-through text-black/40">
//                       ${product.oldPrice}
//                     </span>
//                   )}
//                   <span className="text-sm font-semibold">
//                     ${product.price}
//                   </span>
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
//       </div>
//     </section>
//   );
// }
