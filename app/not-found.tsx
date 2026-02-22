import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8f3] text-center px-6">
      <p className="text-8xl font-black text-gray-100 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>404</p>
      <h1 className="text-2xl font-light mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Page Not Found</h1>
      <p className="text-gray-500 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="bg-black text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition">
        Back to Home
      </Link>
    </div>
  );
}