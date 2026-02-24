'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCollections } from '../../hooks';
// import { useCollections } from '../hooks';

// Category map: collection title → /products?category= value
// Matches backend enum: Perfume | Abayas | Accessories | MensWear | ChildrenWear
const CATEGORY_MAP: Record<string, string> = {
  'Luxury Perfumes':  'Perfume',
  'Premium Abayas':   'Abayas',
  'Accessories':      'Accessories',
  "Children's Wear":  'ChildrenWear',
  "Men's Wear":       'MensWear',
};

const FALLBACK = [
  {
    _id: '1', title: 'Luxury Perfumes',
    description: 'Handcrafted Arabic and Western fragrances, bottled in artisan glass.',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80',
    isActive: true, order: 1,
  },
  {
    _id: '2', title: 'Premium Abayas',
    description: 'Elegant, flowing abayas in the finest fabrics from around the world.',
    image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&q=80',
    isActive: true, order: 2,
  },
  {
    _id: '3', title: 'Accessories',
    description: 'Scarves, hijabs, and jewellery to complete every ensemble.',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
    isActive: true, order: 3,
  },
  {
    _id: '4', title: "Children's Wear",
    description: 'Modest, comfortable clothing for the little ones in every family.',
    image: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=600&q=80',
    isActive: true, order: 4,
  },
];

export default function CollectionsSection() {
  const { collections, isLoading } = useCollections();
  const items = collections.length > 0 ? collections : FALLBACK;

  return (
    <section id="collections" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">Curated For You</p>
          <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Our Collections
          </h2>
          <div className="w-16 h-px bg-yellow-400 mx-auto mt-6" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {items.map((c, i) => {
              const category = CATEGORY_MAP[c.title] || '';
              const href = category ? `/products?category=${category}` : '/products';

              return (
                <Link
                  key={c._id}
                  href={href}
                  className="group relative overflow-hidden cursor-pointer block"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                    {c.image ? (
                      <Image
                        src={c.image} alt={c.title} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100" />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="font-bold text-sm uppercase tracking-widest mb-1">{c.title}</h3>
                      <p className="text-gray-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 line-clamp-2">
                        {c.description}
                      </p>
                      <div className="w-0 group-hover:w-full h-px bg-yellow-400 transition-all duration-500 mt-3" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


// 'use client';
// // import { useCollections } from '@/hooks';
// import Image from 'next/image';
// import { useCollections } from '../../hooks';

// const FALLBACK = [
//   { _id: '1', title: 'Luxury Perfumes', description: 'Handcrafted Arabic and Western fragrances, bottled in artisan glass.', image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80', isActive: true, order: 1 },
//   { _id: '2', title: 'Premium Abayas', description: 'Elegant, flowing abayas in the finest fabrics from around the world.', image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&q=80', isActive: true, order: 2 },
//   { _id: '3', title: 'Accessories', description: 'Scarves, hijabs, and jewellery to complete every ensemble.', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80', isActive: true, order: 3 },
//   { _id: '4', title: "Children's Wear", description: 'Modest, comfortable clothing for the little ones in every family.', image: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=600&q=80', isActive: true, order: 4 },
// ];

// export default function CollectionsSection() {
//   const { collections, isLoading } = useCollections();
//   const items = collections.length > 0 ? collections : FALLBACK;

//   return (
//     <section id="collections" className="py-24 bg-white">
//       <div className="max-w-7xl mx-auto px-6 md:px-10">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <p className="text-yellow-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">Curated For You</p>
//           <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
//             Our Collections
//           </h2>
//           <div className="w-16 h-px bg-yellow-400 mx-auto mt-6" />
//         </div>

//         {isLoading ? (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded" />
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
//             {items.map((c, i) => (
//               <div
//                 key={c._id}
//                 className="group relative overflow-hidden cursor-pointer"
//                 style={{ animationDelay: `${i * 100}ms` }}
//               >
//                 <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
//                   {c.image ? (
//                     <Image
//                       src={c.image} alt={c.title} fill
//                       className="object-cover transition-transform duration-700 group-hover:scale-110"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100" />
//                   )}
//                   {/* Overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

//                   {/* Content */}
//                   <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
//                     <h3 className="font-bold text-sm uppercase tracking-widest mb-1">{c.title}</h3>
//                     <p className="text-gray-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 line-clamp-2">
//                       {c.description}
//                     </p>
//                     <div className="w-0 group-hover:w-full h-px bg-yellow-400 transition-all duration-500 mt-3" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }


// "use client";
// import Image from "next/image";
// import Image1 from "../../assets/icon1.png";
// import Image2 from "../../assets/icon2.png";
// import Image3 from "../../assets/icon3.png";
// import imageBg from "../../assets/icon.png";
// import clothe from "../../assets/clothe.jpeg";
// import clothe1 from "../../assets/clothe1.jpeg";
// import clothe2 from "../../assets/clothe2.jpeg";
// import perfume from "../../assets/perfume.jpeg";
// import shoe from "../../assets/shoe.jpeg";

// function Collections() {
//   const features = [
//     {
//       num: 1,
//       title: "Premium Quality",
//       description:
//         "Every piece is crafted with meticulous attention to detail using the finest materials and fabrics.",
//       image: Image1,
//     },
//     {
//       num: 2,
//       title: "Timeless Elegance",
//       description:
//         "Our designs blend traditional modesty with contemporary sophistication for lasting style.",
//       image: Image2,
//     },
//     {
//       num: 3,
//       title: "Authentic Fragrances",
//       description:
//         "Experience luxury perfumes crafted with rare ingredients and traditional perfumery techniques.",
//       image: Image3,
//     },
//     {
//       num: 4,
//       title: "Worldwide Delivery",
//       description:
//         "Shop from anywhere in the world with secure, fast delivery right to your doorstep.",
//       image: Image2,
//     },
//   ];

//   const photoBg = [
//     {
//       num: 1,
//       image: `url(${shoe.src})`,
//       title: "Accessories",
//       description: "Premium Quality",
//     },
//     {
//       num: 2,
//       image: `url(${clothe2.src})`,
//       title: "Women's Abayas",
//       description: "Elegant Designs",
//     },
//     {
//       num: 3,
//       image: `url(${perfume.src})`,
//       title: "Signature Scents",
//       description: "Luxury Perfumes",
//     },
//     {
//       num: 4,
//       image: `url(${clothe1.src})`,
//       title: "Modest Fashion",
//       description: "Modern Style",
//     },
//     {
//       num: 5,
//       image: `url(${clothe.src})`,
//       title: "Men's Collection",
//       description: "Refined Wear",
//     },
//   ];

//   return (
//     <div id="collections" className="bg-brandWhite w-full py-16 flex flex-col justify-center items-center text-center px-4">
//       {/* Features Section */}
//       <div className="mb-16">
//         <h2 className="text-4xl font-extrabold tracking-widest mb-4">WHY CHOOSE FARHAMA</h2>
        
//         <div className="flex items-center justify-center gap-4 mb-10">
//           <span className="w-16 h-px bg-black/40" />
//           <span className="text-black/60">✻</span>
//           <span className="w-16 h-px bg-black/40" />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
//           {features.map((feature, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <div
//                 style={{
//                   backgroundImage: `url(${imageBg.src})`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//                 className="flex flex-col items-center justify-center mb-4"
//               >
//                 <Image
//                   src={feature.image}
//                   alt={feature.title}
//                   className="h-24 object-cover rounded-full z-10"
//                   width={96}
//                   height={96}
//                 />
//               </div>
//               <h3 className="text-xl font-semibold mb-2 text-black mt-3 uppercase tracking-wide">
//                 {feature.title}
//               </h3>
//               <p className="text-gray-600 text-center text-sm max-w-xs">
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Collections Grid */}
//       <div className="w-full">
//         <h3 className="text-3xl font-extrabold tracking-widest mb-10">EXPLORE OUR COLLECTIONS</h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
//           {photoBg.map((photo) => (
//             <div
//               key={photo.num}
//               style={{
//                 backgroundImage: photo.image,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//               className="relative h-72 w-full bg-cover bg-center group overflow-hidden cursor-pointer"
//             >
//               {/* Dark overlay */}
//               <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
//                 <h3 className="text-white text-xl font-semibold uppercase tracking-wide mb-2">
//                   {photo.title}
//                 </h3>
//                 <p className="text-brandGold text-sm tracking-widest">{photo.description}</p>
//                 <button className="mt-4 border border-white text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
//                   Explore
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Collections;