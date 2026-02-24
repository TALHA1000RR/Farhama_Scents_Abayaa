'use client';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { adminService } from '../../api/services/api.service';
import { HeroSlide } from '../../types';


const FALLBACK_SLIDES: HeroSlide[] = [
  {
    _id: '1', title: 'The Art of Perfumery', subtitle: 'New Collection 2025',
    description: 'Discover our handcrafted scents, each one a journey through the souks of the East and the gardens of the West.',
    cta1: 'Shop Perfumes', cta2: 'Explore Collections', order: 1, isActive: true,
    image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=1600&q=80',
  },
  {
    _id: '2', title: 'Modest Luxury', subtitle: 'Abaya Collection',
    description: 'Elevate your wardrobe with our premium abayas. Timeless elegance meeting contemporary design.',
    cta1: 'Shop Abayas', cta2: 'View Lookbook', order: 2, isActive: true,
    image: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=1600&q=80',
  },
  {
    _id: '3', title: 'Gifts of Luxury', subtitle: 'Premium Gift Sets',
    description: 'Curated gift sets that speak of luxury. Perfect for every occasion, wrapped in elegance.',
    cta1: 'Shop Gifts', cta2: 'Build a Bundle', order: 3, isActive: true,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=80',
  },
];

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    adminService.getHeroSlides()
      .then((r) => {
        const active = r.data.data?.filter((s) => s.isActive) ?? [];
        if (active.length > 0) setSlides(active);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => goNext(), 6000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const goTo = (idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((idx + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goNext = () => goTo(current + 1);
  const goPrev = () => goTo(current - 1);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  };

  const slide = slides[current];

  return (
    <section id="hero" className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s._id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: s.image ? `url(${s.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: s.image ? undefined : '#1a1a1a',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
      ))}

      {/* Content */}
      <div className={`relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-2xl text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em]">{slide?.subtitle}</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-light leading-tight mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {slide?.title}
          </h1>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 max-w-lg">
            {slide?.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollToSection('products')}
              className="bg-yellow-400 text-black px-8 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-yellow-300 transition-all duration-300 hover:scale-105"
            >
              {slide?.cta1 || 'Shop Now'}
            </button>
            <button
              onClick={() => scrollToSection('collections')}
              className="border border-white/50 text-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
            >
              {slide?.cta2 || 'Explore'}
            </button>
          </div>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 left-6 md:left-16 z-10 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 ${i === current ? 'w-8 h-0.5 bg-yellow-400' : 'w-2 h-0.5 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        <button onClick={goPrev} className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-yellow-400 hover:text-black text-white flex items-center justify-center transition-all duration-300">
          <ChevronLeft size={18} />
        </button>
        <button onClick={goNext} className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-yellow-400 hover:text-black text-white flex items-center justify-center transition-all duration-300">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 right-6 md:right-10 z-10">
        <div className="text-white/50 text-[10px] uppercase tracking-[0.3em] writing-vertical flex items-center gap-2">
          <span className="text-xs font-light">{String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
}