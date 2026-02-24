'use client';
import { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth, useTestimonials } from '../../hooks';
import TestimonyModal from '../ui/TestimonialModal';
// import { useTestimonials } from '../hooks';
// import { useAuth } from '../hooks';
// import TestimonyModal from './ui/TestimonyModal';

const FALLBACK = [
  { _id: '1', name: 'Fatima Al-Hassan', location: 'Birmingham, UK', message: 'The Oud Rose perfume is absolutely divine. I get compliments everywhere I go. The packaging alone is a work of art.', rating: 5, isApproved: true, createdAt: '' },
  { _id: '2', name: 'Maryam Okafor',    location: 'London, UK',     message: 'My abaya arrived within 2 days and the quality is exceptional. The fabric is so luxurious and the cut is perfect. Already ordered two more.', rating: 5, isApproved: true, createdAt: '' },
  { _id: '3', name: 'Nadia Sharif',     location: 'Manchester, UK', message: 'Been buying from Farhama for three years and the quality never disappoints. Customer service is always helpful.', rating: 5, isApproved: true, createdAt: '' },
  { _id: '4', name: 'Amina Patel',      location: 'Leicester, UK',  message: 'The gift set for my mother made her cry happy tears. Every item was beautifully presented and smelled wonderful.', rating: 5, isApproved: true, createdAt: '' },
  { _id: '5', name: 'Sara Khan',        location: 'Bradford, UK',   message: 'Outstanding quality and beautiful presentation. Will definitely be a returning customer for years to come.', rating: 5, isApproved: true, createdAt: '' },
  { _id: '6', name: 'Zainab Hassan',    location: 'Leeds, UK',      message: 'Fast delivery, stunning packaging, and the fragrance lasts all day. Exactly what I was looking for.', rating: 5, isApproved: true, createdAt: '' },
];

export default function TestimonialsSection() {
  const { testimonials, isLoading } = useTestimonials();
  const { user } = useAuth();
  const [slide,  setSlide]  = useState(0);
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cap at 9, show 3 per page
  const items  = (testimonials.length > 0 ? testimonials : FALLBACK).slice(0, 9);
  const pages  = Math.ceil(items.length / 3);

  const goTo = (idx: number) => setSlide((idx + pages) % pages);
  const prev = () => goTo(slide - 1);
  const next = () => goTo(slide + 1);

  // Auto-scroll every 5 s
  useEffect(() => {
    timerRef.current = setInterval(() => setSlide((s) => (s + 1) % pages), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [pages]);

  const visible = items.slice(slide * 3, slide * 3 + 3);

  return (
    <section id="testimonials" className="py-24 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">What Our Customers Say</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Loved by Thousands
            </h2>
          </div>
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            {user && (
              <button
                onClick={() => setShowModal(true)}
                className="text-xs font-bold uppercase tracking-widest border border-yellow-400 text-yellow-400 px-4 py-2.5 hover:bg-yellow-400 hover:text-black transition"
              >
                Share Your Story
              </button>
            )}
            <button onClick={() => { prev(); if (timerRef.current) clearInterval(timerRef.current); }}
              className="w-10 h-10 border border-white/20 hover:border-yellow-400 hover:text-yellow-400 flex items-center justify-center transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => { next(); if (timerRef.current) clearInterval(timerRef.current); }}
              className="w-10 h-10 border border-white/20 hover:border-yellow-400 hover:text-yellow-400 flex items-center justify-center transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-white/5 animate-pulse rounded" />)}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 min-h-[240px]">
              {visible.map((t, i) => (
                <div key={t._id + i} className="bg-white/5 border border-white/10 p-7 hover:border-yellow-400/30 transition-all duration-300">
                  <Quote size={28} className="text-yellow-400/40 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} className={j < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">"{t.message}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(pages)].map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className={`rounded-full transition-all ${i === slide ? 'w-6 h-2 bg-yellow-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-white/10">
          {[
            { val: '10,000+', label: 'Happy Customers' },
            { val: '4.9/5',   label: 'Average Rating'  },
            { val: '500+',    label: 'Products'         },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-yellow-400 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{val}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <TestimonyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}



// 'use client';
// import { useState } from 'react';
// import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
// // import { useTestimonials } from '@/hooks';
// import Image from 'next/image';
// import { useTestimonials } from '../../hooks';

// const FALLBACK = [
//   { _id: '1', name: 'Fatima Al-Hassan', location: 'Birmingham, UK', message: 'The Oud Rose perfume is absolutely divine. I get compliments everywhere I go. The packaging alone is a work of art — it came in the most beautiful box I have ever seen.', rating: 5, isApproved: true, createdAt: '' },
//   { _id: '2', name: 'Maryam Okafor', location: 'London, UK', message: 'My abaya arrived within 2 days and the quality is exceptional. The fabric is so luxurious and the cut is perfect. I have already ordered two more.', rating: 5, isApproved: true, createdAt: '' },
//   { _id: '3', name: 'Nadia Sharif', location: 'Manchester, UK', message: 'Been buying from Farhama for three years and the quality never disappoints. Customer service is always helpful and delivery is always fast. Highly recommend!', rating: 5, isApproved: true, createdAt: '' },
//   { _id: '4', name: 'Amina Patel', location: 'Leicester, UK', message: 'The gift set I ordered for my mother made her cry happy tears. Every item was beautifully presented and smelled absolutely wonderful. Will order again for Eid.', rating: 5, isApproved: true, createdAt: '' },
// ];

// export default function TestimonialsSection() {
//   const { testimonials, isLoading } = useTestimonials();
//   const [current, setCurrent] = useState(0);

//   const items = testimonials.length > 0 ? testimonials : FALLBACK;
//   const visible = items.slice(current, current + 3).length < 3
//     ? [...items.slice(current), ...items.slice(0, 3 - items.slice(current).length)]
//     : items.slice(current, current + 3);

//   const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
//   const next = () => setCurrent((c) => (c + 1) % items.length);

//   return (
//     <section id="testimonials" className="py-24 bg-black text-white overflow-hidden">
//       <div className="max-w-7xl mx-auto px-6 md:px-10">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
//           <div>
//             <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">What Our Customers Say</p>
//             <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
//               Loved by Thousands
//             </h2>
//           </div>
//           <div className="flex gap-2 mt-6 md:mt-0">
//             <button onClick={prev} className="w-10 h-10 border border-white/20 hover:border-yellow-400 hover:text-yellow-400 flex items-center justify-center transition-all">
//               <ChevronLeft size={18} />
//             </button>
//             <button onClick={next} className="w-10 h-10 border border-white/20 hover:border-yellow-400 hover:text-yellow-400 flex items-center justify-center transition-all">
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="grid md:grid-cols-3 gap-6">
//             {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-white/5 animate-pulse rounded" />)}
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-3 gap-6">
//             {visible.map((t, i) => (
//               <div key={t._id + i} className="bg-white/5 border border-white/10 p-7 hover:border-yellow-400/30 transition-all duration-300">
//                 <Quote size={28} className="text-yellow-400/40 mb-4" />

//                 <div className="flex gap-1 mb-4">
//                   {[...Array(5)].map((_, j) => (
//                     <Star key={j} size={13} className={j < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
//                   ))}
//                 </div>

//                 <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
//                   "{t.message}"
//                 </p>

//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold text-sm">
//                     {t.name.charAt(0)}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm">{t.name}</p>
//                     <p className="text-gray-500 text-xs">{t.location}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-white/10">
//           {[
//             { val: '10,000+', label: 'Happy Customers' },
//             { val: '4.9/5', label: 'Average Rating' },
//             { val: '500+', label: 'Products' },
//           ].map(({ val, label }) => (
//             <div key={label} className="text-center">
//               <p className="text-3xl md:text-4xl font-black text-yellow-400 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{val}</p>
//               <p className="text-gray-500 text-xs uppercase tracking-widest">{label}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }