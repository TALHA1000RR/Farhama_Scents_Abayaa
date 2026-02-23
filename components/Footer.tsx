"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-black text-xs">FAR</span>
              </div>
              <div>
                <p className="font-black text-base tracking-widest">FARHAMA</p>
                <p className="text-[10px] text-gray-500 tracking-widest">SCENTS & ABAYAA</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Bringing you the finest fragrances and modest fashion from around the world, curated with love.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-yellow-400 hover:text-yellow-400 transition-all text-gray-400">
                  <Icon size={14} />
                </a>
              ))}
              <a href="#" className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-yellow-400 hover:text-yellow-400 transition-all text-gray-400">
                <FaTiktok size={13} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-5 text-yellow-400">Shop</p>
            <ul className="space-y-3">
              {[
                { label: 'Perfumes', href: '/products?category=Perfume' },
                { label: 'Abayas', href: '/products?category=Abayas' },
                { label: 'Accessories', href: '/products?category=Accessories' },
                { label: "Men's Wear", href: '/products?category=MensWear' },
                { label: "Children's Wear", href: '/products?category=ChildrenWear' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 text-xs hover:text-yellow-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-5 text-yellow-400">Information</p>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '#' },
                { label: 'Shipping & Returns', href: '#' },
                { label: 'Size Guide', href: '#' },
                { label: 'Blog', href: '/blog' },
                { label: 'Membership', href: '#pricing' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 text-xs hover:text-yellow-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-5 text-yellow-400">Contact</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={13} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:hello@farhama.co.uk" className="text-gray-400 text-xs hover:text-yellow-400 transition-colors">
                  hello@farhama.co.uk
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={13} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+441902123456" className="text-gray-400 text-xs hover:text-yellow-400 transition-colors">
                  +44 1902 123456
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <p className="text-xs font-black uppercase tracking-widest mb-3 text-gray-400">Newsletter</p>
              <div className="flex">
                <input
                  type="email" placeholder="your@email.com"
                  className="flex-1 bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white placeholder-gray-600 outline-none focus:border-yellow-400/50 transition"
                />
                <button className="bg-yellow-400 text-black px-4 text-xs font-bold hover:bg-yellow-300 transition">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Farhama Scents & Abayaa. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((t) => (
              <a key={t} href="#" className="text-gray-600 text-xs hover:text-yellow-400 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import Logo from "@/public/logo.png";
// import { Facebook, Twitter, Instagram } from "lucide-react";
// import { FaTiktok } from "react-icons/fa";

// export default function Footer() {
//   const scrollToSection = (sectionId: string) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       const navHeight = 120;
//       const elementPosition = element.getBoundingClientRect().top;
//       const offsetPosition = elementPosition + window.pageYOffset - navHeight;

//       window.scrollTo({
//         top: offsetPosition,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <footer className="bg-black text-white pt-16 pb-10 px-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Top Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
//           {/* Brand */}
//           <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
//             <button
//               onClick={() => scrollToSection("hero")}
//               className="flex items-center gap-3 cursor-pointer"
//             >
//               <Image
//                 src={Logo}
//                 alt="Farhama Logo"
//                 width={54}
//                 height={54}
//                 className="object-contain"
//               />
//               <span className="flex flex-col leading-tight">
//                 <h3 className="font-extrabold text-2xl">FARHAMA</h3>
//                 <p className="text-sm text-gray-300">Scents & Abayaa</p>
//               </span>
//             </button>

//             <p className="text-gray-400 text-sm max-w-xs">
//               Luxury modest fashion and premium fragrances for the modern connoisseur. 
//               Quality, elegance, and authenticity in every piece.
//             </p>

//             {/* Social Media */}
//             <div className="flex gap-4 pt-4">
//               <button className="hover:text-brandGold transition">
//                 <Facebook size={20} />
//               </button>
//               <button className="hover:text-brandGold transition">
//                 <Twitter size={20} />
//               </button>
//               <button className="hover:text-brandGold transition">
//                 <Instagram size={20} />
//               </button>
//               <button className="hover:text-brandGold transition">
//                 <FaTiktok size={20} />
//               </button>
//             </div>
//           </div>

//           {/* Collections */}
//           <div className="text-center md:text-left">
//             <h4 className="text-sm tracking-widest font-semibold mb-5">
//               COLLECTIONS
//             </h4>
//             <ul className="space-y-3 text-gray-400 text-sm">
//               {[
//                 { label: "Women's Abayas", id: "products" },
//                 { label: "Men's Wear", id: "products" },
//                 { label: "Signature Perfumes", id: "products" },
//                 { label: "Accessories", id: "products" },
//               ].map((item) => (
//                 <li key={item.label}>
//                   <button
//                     onClick={() => scrollToSection(item.id)}
//                     className="hover:text-white transition"
//                   >
//                     {item.label}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Quick Links */}
//           <div className="text-center md:text-left">
//             <h4 className="text-sm tracking-widest font-semibold mb-5">
//               QUICK LINKS
//             </h4>
//             <ul className="space-y-3 text-gray-400 text-sm">
//               {[
//                 { label: "About Us", id: "about" },
//                 { label: "Our Story", id: "about" },
//                 { label: "Testimonials", id: "testimonials" },
//                 { label: "Blog", id: "about" },
//               ].map((item) => (
//                 <li key={item.label}>
//                   <button
//                     onClick={() => scrollToSection(item.id)}
//                     className="hover:text-white transition"
//                   >
//                     {item.label}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Customer Care */}
//           <div className="text-center md:text-left">
//             <h4 className="text-sm tracking-widest font-semibold mb-5">
//               CUSTOMER CARE
//             </h4>
//             <ul className="space-y-3 text-gray-400 text-sm">
//               {[
//                 { label: "Contact Us", id: "contact" },
//                 { label: "Delivery Information", id: "contact" },
//                 { label: "Returns & Exchanges", id: "contact" },
//                 { label: "FAQs", id: "contact" },
//               ].map((item) => (
//                 <li key={item.label}>
//                   <button
//                     onClick={() => scrollToSection(item.id)}
//                     className="hover:text-white transition"
//                   >
//                     {item.label}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Newsletter Section */}
//         <div className="mt-12 pt-8 border-t border-gray-800">
//           <div className="max-w-md mx-auto text-center">
//             <h4 className="text-lg font-semibold mb-3">Stay Updated</h4>
//             <p className="text-gray-400 text-sm mb-4">
//               Subscribe to receive exclusive offers and new collection updates
//             </p>
//             <div className="flex gap-2">
//               <input
//                 type="email"
//                 placeholder="Your email address"
//                 className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded outline-none focus:border-brandGold transition text-sm"
//               />
//               <button className="bg-brandGold text-black px-6 py-2 rounded font-semibold hover:bg-brandGold/90 transition text-sm">
//                 Subscribe
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
//           <p className="text-gray-500 text-xs text-center md:text-left">
//             © {new Date().getFullYear()} Farhama Scents & Abayaa. All rights reserved.
//           </p>
//           <div className="flex gap-6 text-xs text-gray-500">
//             <button className="hover:text-white transition">Privacy Policy</button>
//             <button className="hover:text-white transition">Terms of Service</button>
//             <button className="hover:text-white transition">Cookie Policy</button>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }