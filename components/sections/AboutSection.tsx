// "use client";
// import Image from "next/image";
// import Photo from "@/assets/clothe3.jpeg";
// import { Check } from "lucide-react";
// import * as SC from "@/app/style";

// // data/fashionPosts.ts
// import img1 from "@/assets/clothe5.jpeg";
// import img2 from "@/assets/clothe6.jpeg";
// import img3 from "@/assets/clothe7.jpeg";

// export const fashionPosts = [
//   {
//     id: 1,
//     image: img1,
//     date: "January 15, 2026",
//     category: "Fashion Tips",
//     author: "Zainab Ahmed",
//     title: "Styling Modest Fashion",
//     description:
//       "Discover how to create versatile looks with our abaya collection. Learn the art of layering and accessorizing for every occasion.",
//   },
//   {
//     id: 2,
//     image: img2,
//     date: "January 10, 2026",
//     category: "Fragrance Guide",
//     author: "Sarah Mitchell",
//     title: "Choosing Your Signature Scent",
//     description:
//       "Navigate our perfume collection to find the perfect fragrance that matches your personality and makes a lasting impression.",
//   },
//   {
//     id: 3,
//     image: img3,
//     date: "January 5, 2026",
//     category: "Style Guide",
//     author: "Amira Hassan",
//     title: "Timeless Elegance",
//     description:
//       "Explore how Farhama combines traditional craftsmanship with contemporary design to create pieces that transcend trends.",
//   },
// ];

// function AboutSection() {
//   return (
//     <>
//       {/* ABOUT SECTION */}
//       <div
//         id="about"
//         className="bg-cover bg-center w-full min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-14 px-6 sm:px-10 lg:px-20"
//         style={{
//           backgroundImage: `url('/background/background2.jpg')`,
//         }}
//       >
//         {/* Text */}
//         <div className="w-full lg:w-1/2 text-left text-white mt-24 lg:mt-0">
//           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6">
//             Our Story & Values
//           </h2>

//           <p className="text-white/80 mb-10 max-w-xl leading-relaxed text-base">
//             Farhama was founded with a vision to bring together the finest in modest fashion and luxury fragrances. 
//             We believe that elegance should be accessible, quality should be uncompromising, and style should honour both tradition and modernity.
//           </p>

//           <div className="flex flex-col gap-4 text-white/80 text-sm sm:text-base">
//             {[
//               "Premium materials and expert craftsmanship",
//               "Authentic fragrances from master perfumers",
//               "Designs for women, men, and children",
//               "Convenient online ordering and fast delivery",
//               "Committed to customer satisfaction",
//             ].map((item, i) => (
//               <span key={i} className="flex items-center">
//                 <Check className="mr-3 shrink-0 text-brandGold" size={20} />
//                 {item}
//               </span>
//             ))}
//           </div>

//           <button className="mt-10 border-2 border-white text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
//             Learn More About Us
//           </button>
//         </div>

//         {/* Image */}
//         <div className="w-full lg:w-1/2 flex justify-center">
//           <Image
//             src={Photo}
//             alt="Farhama Fashion"
//             width={380}
//             className="rounded-3xl animate-float-soft shadow-lg shadow-white/30 w-full lg:w-3/5 mb-10 lg:mb-0"
//           />
//         </div>
//       </div>

//       <SC.FixedDiv />

//       {/* BLOG / POSTS */}
//       <div className="max-w-7xl mx-auto px-6 bg-transparent">
//         <div className="text-center py-16">
//           <h3 className="text-3xl sm:text-4xl font-extrabold tracking-widest mb-4 text-white">
//             LATEST FROM OUR BLOG
//           </h3>
//           <div className="flex items-center justify-center gap-4 mb-6">
//             <span className="w-16 h-px bg-white/40" />
//             <span className="text-white/60">✻</span>
//             <span className="w-16 h-px bg-white/40" />
//           </div>
//           <p className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
//             Stay updated with our latest fashion tips, fragrance guides, and style inspiration
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 pb-24">
//           {fashionPosts.map((post) => (
//             <div
//               key={post.id}
//               className="group overflow-hidden cursor-pointer bg-white/5 backdrop-blur-sm rounded-lg"
//             >
//               {/* Image */}
//               <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
//                 <Image
//                   src={post.image}
//                   alt={post.title}
//                   fill
//                   className="object-cover transition-transform duration-700 group-hover:scale-110"
//                 />
//               </div>

//               {/* Content */}
//               <div className="p-6 text-white transition-all duration-300">
//                 <p className="text-xs italic text-white/70 mb-3">
//                   {post.date} — {post.category} — by {post.author}
//                 </p>

//                 <h3 className="text-lg sm:text-xl font-semibold tracking-wide mb-3">
//                   {post.title.toUpperCase()}
//                 </h3>

//                 <p className="text-sm text-white/80 leading-relaxed mb-5">
//                   {post.description}
//                 </p>

//                 <span className="inline-flex items-center gap-3 text-xs tracking-widest uppercase text-brandGold group-hover:gap-5 transition-all duration-300">
//                   Read More
//                   <span className="block h-px w-10 bg-brandGold transition-all duration-500 group-hover:w-16" />
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// export default AboutSection;