'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { blogService } from '../../../api/services/api.service';
import Footer from '../../../components/Footer';
import { BlogPost } from '../../../types';
// import { blogService } from '@/store/services/api.services';
// import type { BlogPost } from '@/types';
// import Footer from '@/components/Footer';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      blogService.getBySlug(slug)
        .then((r) => setPost(r.data.data || null))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  if (isLoading) {
    return <div className="pt-[120px] min-h-screen flex items-center justify-center"><div className="w-10 h-10 spinner" /></div>;
  }

  if (!post) {
    return (
      <div className="pt-[120px] min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Post not found</p>
        <Link href="/blog" className="text-sm font-bold underline">Back to blog</Link>
      </div>
    );
  }

  return (
    <>
      <div className="pt-[120px] min-h-screen bg-[#faf8f3]">
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-yellow-600 transition mb-8">
            <ArrowLeft size={14} /> Back to Journal
          </Link>

          <span className="bg-yellow-400 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5">{post.category}</span>

          <h1 className="text-3xl md:text-4xl font-light mt-4 mb-5 leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-gray-400 text-xs mb-8">
            <Calendar size={12} />
            <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="text-gray-300">•</span>
            <span>By {post.author}</span>
          </div>

          {post.image && (
            <div className="aspect-[16/9] relative overflow-hidden mb-10">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}