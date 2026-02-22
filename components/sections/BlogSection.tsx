'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { useBlog } from '@/hooks';

export default function BlogSection() {
  const { posts, isLoading } = useBlog(3);

  if (!isLoading && posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">Stories & Insights</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              From the Journal
            </h2>
            <div className="w-16 h-px bg-yellow-400 mt-5" />
          </div>
          <Link href="/blog" className="mt-6 md:mt-0 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-yellow-600 transition-colors">
            View All Posts <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/2] bg-gray-100 mb-4" />
                <div className="h-3 bg-gray-100 rounded mb-2 w-1/4" />
                <div className="h-5 bg-gray-100 rounded mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug}`} className="group block">
                <div className="aspect-[3/2] relative overflow-hidden bg-gray-100 mb-5">
                  {post.image ? (
                    <Image
                      src={post.image} alt={post.title} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-400 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                  <Calendar size={12} />
                  <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="text-gray-300">•</span>
                  <span>{post.author}</span>
                </div>

                <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-yellow-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">{post.description}</p>

                <div className="flex items-center gap-1.5 mt-4 text-xs font-bold uppercase tracking-widest group-hover:text-yellow-600 transition-colors">
                  Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}