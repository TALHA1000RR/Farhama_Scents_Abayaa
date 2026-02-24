'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, FileText, Settings, LogOut, Star, Layers } from 'lucide-react';
import { useAuth } from '../../hooks';



const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/products',  label: 'Products',  Icon: Package },
  { href: '/admin/orders',    label: 'Orders',    Icon: ShoppingCart },
  { href: '/admin/users',     label: 'Users',     Icon: Users },
  { href: '/admin/blog',      label: 'Blog',      Icon: FileText },
  { href: '/admin/content',   label: 'Content',   Icon: Layers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isInitialized, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until localStorage hydration is complete before making any
    // access-control decision. Without this guard, user is always null
    // on the first render (before initializeAuth resolves) and the layout
    // immediately redirects every admin to the homepage.
    if (!isInitialized) return;
    if (!user || !isAdmin) {
      router.replace('/');
    }
  }, [isInitialized, user, isAdmin, router]);

  // Phase 1: localStorage hasn't been read yet — show spinner, not redirect
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f3]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-black border-t-yellow-400 rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  // Phase 2: hydration done but user isn't admin — redirect is happening
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f3]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-black border-t-yellow-400 rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Redirecting…</p>
        </div>
      </div>
    );
  }

  // Phase 3: authenticated admin — show panel
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 mt-30 bg-black text-white flex flex-col fixed h-full z-40">
        <div className="px-6 py-7 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-black font-black text-[10px]">FAR</span>
            </div>
            <div>
              <p className="font-black text-sm tracking-widest">FARHAMA</p>
              <p className="text-[9px] text-gray-500 tracking-widest">ADMIN PANEL</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-all rounded ${
                  active
                    ? 'bg-yellow-400 text-black font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mb-30 py-4 border-t border-white/10">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-gray-400 hover:text-red-400 transition w-full"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 mt-30 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}