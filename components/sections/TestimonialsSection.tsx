'use client';
import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTestimonials } from '@/hooks';
import Image from 'next/image';

const FALLBACK = [
  { _id: '1', name: 'Fatima Al-Hassan', location: 'Birmingham, UK', message: 'The Oud Rose perfume is absolutely divine. I get compliments everywhere I go. The packaging alone is a work of art — it came in the most beautiful box I have ever seen.', rating: 5, isApproved: true, createdAt: '' },
  { _id: '2', name: 'Maryam Okafor', location: 'London, UK', message: 'My abaya arrived within 2 days and the quality is exceptional. The fabric is so luxurious and the cut is perfect. I have already ordered two more.', rating: 5, isApproved: true, createdAt: '' },
  { _id: '3', name: 'Nadia Sharif', location: 'Manchester, UK', message: 'Been buying from Farhama for three years and the quality never disappoints. Customer service is always helpful and delivery is always fast. Highly recommend!', rating: 5, isApproved: true, createdAt: '' },
  { _id: '4', name: 'Amina Patel', location: 'Leicester, UK', message: 'The gift set I ordered for my mother made her cry happy tears. Every item was beautifully presented and smelled absolutely wonderful. Will order again for Eid.', rating: 5, isApproved: true, createdAt: '' },
];

export default function TestimonialsSection() {
  const { testimonials, isLoading } = useTestimonials();
  const [current, setCurrent] = useState(0);

  const items = testimonials.length > 0 ? testimonials : FALLBACK;
  const visible = items.slice(current, current + 3).length < 3
    ? [...items.slice(current), ...items.slice(0, 3 - items.slice(current).length)]
    : items.slice(current, current + 3);

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  const next = () => setCurrent((c) => (c + 1) % items.length);

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
          <div className="flex gap-2 mt-6 md:mt-0">
            <button onClick={prev} className="w-10 h-10 border border-white/20 hover:border-yellow-400 hover:text-yellow-400 flex items-center justify-center transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="w-10 h-10 border border-white/20 hover:border-yellow-400 hover:text-yellow-400 flex items-center justify-center transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-white/5 animate-pulse rounded" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {visible.map((t, i) => (
              <div key={t._id + i} className="bg-white/5 border border-white/10 p-7 hover:border-yellow-400/30 transition-all duration-300">
                <Quote size={28} className="text-yellow-400/40 mb-4" />

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={13} className={j < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                  "{t.message}"
                </p>

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
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-white/10">
          {[
            { val: '10,000+', label: 'Happy Customers' },
            { val: '4.9/5', label: 'Average Rating' },
            { val: '500+', label: 'Products' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-yellow-400 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{val}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// import user1 from "../../assets/users/user1.png";
// import user2 from "../../assets/users/user2.png";
// import user3 from "../../assets/users/user3.png";

// const testimonials = [
//   {
//     name: "Aisha Rahman",
//     location: "London, UK",
//     message:
//       "The quality of Farhama's abayas is exceptional. The fabrics are luxurious and the fit is perfect. I've received so many compliments!",
//     image: user1,
//   },
//   {
//     name: "Sarah Williams",
//     location: "Manchester, UK",
//     message:
//       "I'm absolutely in love with their perfume collection. The scents are long-lasting and sophisticated. Customer service was outstanding!",
//     image: user2,
//   },
//   {
//     name: "Fatima Al-Hashimi",
//     location: "Birmingham, UK",
//     message:
//       "Farhama has become my go-to for modest fashion. Their designs are elegant, modern, and reasonably priced. Highly recommend!",
//     image: user3,
//   },
// ];

// export default function TestimonialSection() {
//   const [current, setCurrent] = useState(0);

//   const nextSlide = () => {
//     setCurrent((prev) => (prev + 1) % testimonials.length);
//   };

//   const prevSlide = () => {
//     setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
//   };

//   useEffect(() => {
//     const interval = setInterval(nextSlide, 6000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section id="testimonials" className="w-full py-20 bg-brandWhite flex justify-center">
//       <div className="relative w-full max-w-3xl px-6 lg:px-10 text-center h-80">
//         {/* Left Arrow */}
//         <button
//           onClick={prevSlide}
//           className="absolute z-10 left-2 sm:left-0 top-1/2 -translate-y-1/2 px-2 rounded-full border border-black/10
//   hover:border-black hover:bg-black hover:text-white transition"
//           aria-label="Previous testimonial"
//         >
//           <ChevronLeft size={18} className="sm:size-10" />
//         </button>

//         {/* Right Arrow */}
//         <button
//           onClick={nextSlide}
//           className="absolute z-10 right-2 sm:right-0 top-1/2 -translate-y-1/2 px-2 rounded-full border border-black/10
//   hover:border-black hover:bg-black hover:text-white transition"
//           aria-label="Next testimonial"
//         >
//           <ChevronRight size={18} className="sm:size-10" />
//         </button>

//         {/* Slides */}
//         {testimonials.map((testimonial, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out
//               ${
//                 index === current
//                   ? "opacity-100 translate-y-0 scale-100"
//                   : "opacity-0 translate-y-4 scale-95 pointer-events-none"
//               }`}
//           >
//             <h2 className="text-2xl lg:text-3xl tracking-[0.25em] sm:tracking-[0.35em] font-semibold mb-6 sm:mb-8 text-black/60">
//               CUSTOMER EXPERIENCES
//             </h2>

//             <p className="italic text-brandBlack max-w-xl mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base px-2">
//               "{testimonial.message}"
//             </p>

//             <Image
//               src={testimonial.image}
//               alt={testimonial.name}
//               width={64}
//               height={64}
//               className="sm:w-20 sm:h-20 rounded-full object-cover mb-3 sm:mb-4"
//             />

//             <h4 className="text-sm sm:text-base font-semibold tracking-widest uppercase text-black">
//               {testimonial.name}
//             </h4>
//             <p className="text-xs text-black/50 mt-1">{testimonial.location}</p>
//           </div>
//         ))}

//         {/* Indicator Bars */}
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3">
//           {testimonials.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrent(index)}
//               className={`h-0.5 transition-all duration-500
//                 ${
//                   index === current
//                     ? "w-8 sm:w-10 bg-black"
//                     : "w-4 bg-black/30 hover:bg-black/60"
//                 }`}
//               aria-label={`Go to testimonial ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }