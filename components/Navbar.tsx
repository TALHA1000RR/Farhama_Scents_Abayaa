'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  MapPin, Phone, Facebook, Twitter, Instagram,
  Search, ShoppingBag, Menu, X, User, LogOut,
  LayoutDashboard, Package,
} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { useAuth, useCart } from '../hooks';
import AuthModal from './ui/AuthModal';
import CartSidebar from './ui/CartSidebar';


export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [showAuth, setShowAuth]     = useState(false);
  const [authMode, setAuthMode]     = useState<'signin' | 'signup'>('signin');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef  = useRef<HTMLDivElement>(null);
  const searchRef    = useRef<HTMLInputElement>(null);

  const { user, logout, isAdmin } = useAuth();
  const { count, toggle: toggleCart } = useCart();
  const router   = useRouter();
  const pathname = usePathname();

  // Close user-menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus the search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Listen for auth-open events dispatched by CartSidebar / other components
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setAuthMode(e.detail as 'signin' | 'signup');
      setShowAuth(true);
    };
    window.addEventListener('openAuth', handler as EventListener);
    return () => window.removeEventListener('openAuth', handler as EventListener);
  }, []);

  // Scroll to a homepage section (works on / and navigates first on other pages)
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setSearchOpen(false);
    if (pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 120,
        behavior: 'smooth',
      });
    }
  };

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuth(true);
    setMenuOpen(false);
  };

  // Search submit — navigate to /products?search=query
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) { setSearchOpen(false); return; }
    setSearchOpen(false);
    setSearchQuery('');
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  const navLinks = [
    { label: 'Home',         id: 'hero' },
    { label: 'Collections',  id: 'collections' },
    { label: 'Products',     id: 'products' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact',      id: 'contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="bg-black h-10 flex items-center justify-between px-4 md:px-10 text-white text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              <span className="hidden sm:block">Wolverhampton, UK</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={13} />
              <span className="hidden sm:block">+44 1902 123456</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <Icon key={i} size={14} className="cursor-pointer hover:text-yellow-400 transition" />
            ))}
            <FaTiktok size={13} className="cursor-pointer hover:text-yellow-400 transition" />
          </div>
        </div>

        {/* ── Main nav ─────────────────────────────────────────────── */}
        <nav className="bg-white h-20 flex items-center justify-between px-4 md:px-10 shadow-sm">

          {/* Logo */}
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-black text-xs tracking-wider">FAR</span>
            </div>
            <div className="leading-tight">
              <p className="font-black text-xl tracking-widest">FARHAMA</p>
              <p className="text-xs text-gray-500 tracking-widest">SCENTS &amp; ABAYAA</p>
            </div>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
            {navLinks.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="hover:text-yellow-500 transition-colors duration-200"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-5">

            {/* ── Search ── */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fadeIn">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="border-b border-black outline-none text-sm w-40 py-1 bg-transparent placeholder-gray-400"
                />
                <button type="submit" className="hover:text-yellow-500 transition">
                  <Search size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="text-gray-400 hover:text-black transition"
                >
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="hover:text-yellow-500 transition"
                aria-label="Open search"
              >
                <Search size={22} />
              </button>
            )}

            {/* ── Cart ── */}
            <button
              onClick={toggleCart}
              className="relative hover:text-yellow-500 transition"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* ── User ── */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-2 hover:text-yellow-500 transition"
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 rounded-full bg-black text-yellow-400 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{user.name.split(' ')[0]}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-white border border-gray-100 shadow-2xl rounded-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1 inline-block ${
                        isAdmin ? 'bg-black text-yellow-400' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    {isAdmin && (
                      <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                        <LayoutDashboard size={15} className="text-gray-500" /> Admin Dashboard
                      </a>
                    )}
                    <a href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                      <Package size={15} className="text-gray-500" /> My Orders
                    </a>
                    <a href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                      <User size={15} className="text-gray-500" /> My Account
                    </a>
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition w-full text-left"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuth('signin')}
                  className="flex items-center gap-1.5 text-sm font-medium hover:text-yellow-500 transition"
                >
                  <User size={18} /> Sign In
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="bg-black text-white text-xs font-bold px-5 py-2.5 uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="hover:text-yellow-500 transition"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={toggleCart}
              className="relative"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </nav>

        {/* ── Mobile search bar ─────────────────────────────────────── */}
        {searchOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                autoFocus
                className="flex-1 outline-none text-sm py-1 bg-transparent placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="text-gray-400"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}

        {/* ── Mobile menu ───────────────────────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg px-6 py-5 flex flex-col gap-4">
            {navLinks.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left font-medium uppercase tracking-widest text-sm hover:text-yellow-500 transition"
              >
                {label}
              </button>
            ))}
            <hr className="border-gray-200" />
            {user ? (
              <>
                <p className="font-semibold text-sm">{user.name}</p>
                <a href="/orders" className="text-sm text-gray-600">My Orders</a>
                <a href="/account" className="text-sm text-gray-600">My Account</a>
                {isAdmin && (
                  <a href="/admin/dashboard" className="text-sm font-medium">Admin Dashboard</a>
                )}
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="text-left text-red-500 text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuth('signin')}
                  className="text-left text-sm font-medium uppercase tracking-widest"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="bg-black text-white text-xs font-bold px-5 py-3 uppercase tracking-widest text-center hover:bg-yellow-500 hover:text-black transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Auth modal + cart sidebar rendered at root level, outside header */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
      <CartSidebar />
    </>
  );
}



// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   MapPin,
//   Phone,
//   Facebook,
//   Twitter,
//   Instagram,
//   Search,
//   ShoppingBag,
//   Menu,
//   X,
//   User,
// } from "lucide-react";
// import { FaTiktok } from "react-icons/fa";
// import Logo from "../public/logo.png";
// import AuthModal from "./ui/AuthModal";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

//   const scrollToSection = (sectionId: string) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       const navHeight = 120; // Height of both nav bars
//       const elementPosition = element.getBoundingClientRect().top;
//       const offsetPosition = elementPosition + window.pageYOffset - navHeight;

//       window.scrollTo({
//         top: offsetPosition,
//         behavior: "smooth",
//       });
//     }
//     setOpen(false);
//   };

//   const openAuthModal = (mode: "signin" | "signup") => {
//     setAuthMode(mode);
//     setShowAuthModal(true);
//     setOpen(false);
//   };

//   return (
//     <>
//       <header className="fixed top-0 left-0 z-50 w-full">
//         {/* Top Bar */}
//         <div className="bg-black h-10 flex font-light text-white justify-between px-4 sm:px-6 md:px-10 items-center text-xs sm:text-sm">
//           <div className="flex gap-4 sm:gap-8">
//             <span className="flex items-center">
//               <MapPin size={14} className="mr-2" />
//               <p className="hidden sm:block">Wolverhampton, UK</p>
//             </span>

//             <hr className="h-6 w-px bg-white hidden sm:block" />

//             <span className="flex items-center">
//               <Phone size={14} className="mr-2" />
//               <p className="hidden sm:block">+44 1902 123456</p>
//             </span>
//           </div>

//           <span className="flex items-center">
//             <Facebook size={14} className="mx-2 cursor-pointer hover:text-brandGold transition" />
//             <Twitter size={14} className="mx-2 cursor-pointer hover:text-brandGold transition" />
//             <Instagram size={14} className="mx-2 cursor-pointer hover:text-brandGold transition" />
//             <FaTiktok size={14} className="mx-2 cursor-pointer hover:text-brandGold transition" />
//           </span>
//         </div>

//         {/* Main Nav */}
//         <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 bg-white h-20 shadow-sm">
//           {/* Logo */}
//           <button
//             onClick={() => scrollToSection("hero")}
//             className="flex items-center cursor-pointer"
//           >
//             <Image
//               src={Logo}
//               alt="Farhama Logo"
//               className="h-12 w-12 sm:h-14 sm:w-14"
//             />
//             <span className="flex flex-col leading-3 ml-2">
//               <h3 className="font-extrabold text-xl sm:text-2xl md:text-3xl">
//                 FARHAMA
//               </h3>
//               <p className="text-xs sm:text-sm">Scents & Abayaa</p>
//             </span>
//           </button>

//           {/* Desktop Links */}
//           <div className="customLink hidden md:flex text-sm items-center gap-10 uppercase tracking-widest">
//             <button onClick={() => scrollToSection("hero")} className="hover:text-brandGold transition">
//               Home
//             </button>
//             <button onClick={() => scrollToSection("collections")} className="hover:text-brandGold transition">
//               Collections
//             </button>
//             <button onClick={() => scrollToSection("products")} className="hover:text-brandGold transition">
//               Products
//             </button>
//             <button onClick={() => scrollToSection("testimonials")} className="hover:text-brandGold transition">
//               Testimonials
//             </button>
//             <button onClick={() => scrollToSection("contact")} className="hover:text-brandGold transition">
//               Contact
//             </button>
//           </div>

//           {/* Desktop Actions */}
//           <div className="hidden md:flex items-center gap-6 uppercase tracking-widest text-sm">
//             <Search size={25} className="cursor-pointer hover:text-brandGold transition" />
//             <ShoppingBag size={25} className="cursor-pointer hover:text-brandGold transition" />
//             <button
//               onClick={() => openAuthModal("signin")}
//               className="flex items-center gap-2 hover:text-brandGold transition"
//             >
//               <User size={20} />
//               Sign In
//             </button>
//             <button
//               onClick={() => openAuthModal("signup")}
//               className="bg-black text-white px-4 py-2 hover:bg-brandGold transition"
//             >
//               Sign Up
//             </button>
//           </div>

//           {/* Mobile Actions */}
//           <div className="flex md:hidden items-center gap-4">
//             <Search size={22} />
//             <ShoppingBag size={22} />
//             <button onClick={() => setOpen(!open)}>
//               {open ? <X size={26} /> : <Menu size={26} />}
//             </button>
//           </div>
//         </nav>

//         {/* Mobile Menu */}
//         {open && (
//           <div className="md:hidden bg-white border-t px-6 py-6 flex flex-col gap-6 uppercase tracking-widest text-sm shadow-lg">
//             <button onClick={() => scrollToSection("hero")}>Home</button>
//             <button onClick={() => scrollToSection("collections")}>Collections</button>
//             <button onClick={() => scrollToSection("products")}>Products</button>
//             <button onClick={() => scrollToSection("testimonials")}>Testimonials</button>
//             <button onClick={() => scrollToSection("contact")}>Contact</button>
//             <hr className="border-gray-200" />
//             <button
//               onClick={() => openAuthModal("signin")}
//               className="text-left flex items-center gap-2"
//             >
//               <User size={18} />
//               Sign In
//             </button>
//             <button
//               onClick={() => openAuthModal("signup")}
//               className="bg-black text-white px-4 py-2 text-center hover:bg-brandGold transition"
//             >
//               Sign Up
//             </button>
//           </div>
//         )}
//       </header>

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//         mode={authMode}
//         setMode={setAuthMode}
//       />
//     </>
//   );
// }