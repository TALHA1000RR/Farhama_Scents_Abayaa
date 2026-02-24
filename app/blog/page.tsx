'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import Footer from '../../components/Footer';
import { useBlog } from '../../hooks';


export default function BlogPage() {
  const { posts, isLoading } = useBlog(20);

  return (
    <>
      <div className="pt-[120px] min-h-screen bg-[#faf8f3]">
        <div className="bg-black text-white py-14 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Stories & Style</p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>The Farhama Journal</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/2] bg-gray-200 mb-4" />
                  <div className="h-3 bg-gray-200 rounded mb-2 w-1/4" />
                  <div className="h-5 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No posts published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="group block bg-white">
                  <div className="aspect-[3/2] relative overflow-hidden bg-gray-100">
                    {post.image ? (
                      <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-yellow-400 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5">{post.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                      <Calendar size={11} />
                      <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <h2 className="font-bold text-sm leading-snug mb-2 group-hover:text-yellow-600 transition-colors">{post.title}</h2>
                    <p className="text-gray-500 text-xs line-clamp-2">{post.description}</p>
                    <div className="flex items-center gap-1 mt-4 text-[10px] font-black uppercase tracking-widest group-hover:text-yellow-600 transition-colors">
                      Read More <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}