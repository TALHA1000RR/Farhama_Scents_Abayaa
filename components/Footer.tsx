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