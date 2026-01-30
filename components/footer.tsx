"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-black text-white pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Image
                src={Logo}
                alt="Farhama Logo"
                width={54}
                height={54}
                className="object-contain"
              />
              <span className="flex flex-col leading-tight">
                <h3 className="font-extrabold text-2xl">FARHAMA</h3>
                <p className="text-sm text-gray-300">Scents & Abayaa</p>
              </span>
            </button>

            <p className="text-gray-400 text-sm max-w-xs">
              Luxury modest fashion and premium fragrances for the modern connoisseur. 
              Quality, elegance, and authenticity in every piece.
            </p>

            {/* Social Media */}
            <div className="flex gap-4 pt-4">
              <button className="hover:text-brandGold transition">
                <Facebook size={20} />
              </button>
              <button className="hover:text-brandGold transition">
                <Twitter size={20} />
              </button>
              <button className="hover:text-brandGold transition">
                <Instagram size={20} />
              </button>
              <button className="hover:text-brandGold transition">
                <FaTiktok size={20} />
              </button>
            </div>
          </div>

          {/* Collections */}
          <div className="text-center md:text-left">
            <h4 className="text-sm tracking-widest font-semibold mb-5">
              COLLECTIONS
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                { label: "Women's Abayas", id: "products" },
                { label: "Men's Wear", id: "products" },
                { label: "Signature Perfumes", id: "products" },
                { label: "Accessories", id: "products" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-white transition"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-sm tracking-widest font-semibold mb-5">
              QUICK LINKS
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                { label: "About Us", id: "about" },
                { label: "Our Story", id: "about" },
                { label: "Testimonials", id: "testimonials" },
                { label: "Blog", id: "about" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-white transition"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="text-center md:text-left">
            <h4 className="text-sm tracking-widest font-semibold mb-5">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                { label: "Contact Us", id: "contact" },
                { label: "Delivery Information", id: "contact" },
                { label: "Returns & Exchanges", id: "contact" },
                { label: "FAQs", id: "contact" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-white transition"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-3">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive exclusive offers and new collection updates
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded outline-none focus:border-brandGold transition text-sm"
              />
              <button className="bg-brandGold text-black px-6 py-2 rounded font-semibold hover:bg-brandGold/90 transition text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Farhama Scents & Abayaa. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <button className="hover:text-white transition">Privacy Policy</button>
            <button className="hover:text-white transition">Terms of Service</button>
            <button className="hover:text-white transition">Cookie Policy</button>
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

// export default function Footer() {
//   return (
//     <footer className="bg-black text-white pt-16 pb-10 px-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Top Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          
//           {/* Brand */}
//           <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
//             <Link href="/" className="flex items-center gap-3">
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
//             </Link>

//             <p className="text-gray-400 text-sm max-w-xs">
//               Timeless fashion pieces crafted with elegance and precision.
//               Designed for those who value style that lasts forever.
//             </p>
//           </div>

//           {/* Shop */}
//           <div className="text-center md:text-left">
//             <h4 className="text-sm tracking-widest font-semibold mb-5">
//               SHOP
//             </h4>
//             <ul className="space-y-3 text-gray-400 text-sm">
//               {["Women", "Men", "Accessories", "New Arrivals"].map((item) => (
//                 <li key={item}>
//                   <Link href="#" className="hover:text-white transition">
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Company */}
//           <div className="text-center md:text-left">
//             <h4 className="text-sm tracking-widest font-semibold mb-5">
//               COMPANY
//             </h4>
//             <ul className="space-y-3 text-gray-400 text-sm">
//               {["About Us", "Lookbook", "Careers", "Press"].map((item) => (
//                 <li key={item}>
//                   <Link href="#" className="hover:text-white transition">
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Support */}
//           <div className="text-center md:text-left">
//             <h4 className="text-sm tracking-widest font-semibold mb-5">
//               SUPPORT
//             </h4>
//             <ul className="space-y-3 text-gray-400 text-sm">
//               {["Contact", "Shipping", "Returns", "FAQs"].map((item) => (
//                 <li key={item}>
//                   <Link href="#" className="hover:text-white transition">
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-gray-800 mt-14 pt-6">
//           <p className="text-gray-500 text-xs text-center">
//             © {new Date().getFullYear()} Farhama Scents and Abayaa. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
