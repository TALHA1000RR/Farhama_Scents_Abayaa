'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCollections } from '../../hooks';


const CATEGORY_MAP: Record<string, string> = {
  'Luxury Perfumes':  'Perfume',
  'Premium Abayas':   'Abayas',
  'Accessories':      'Accessories',
  "Children's Wear":  'ChildrenWear',
  "Men's Wear":       'MensWear',
};

const FALLBACK = [
  {
    _id: '1', title: 'Luxury Perfumes',
    description: 'Handcrafted Arabic and Western fragrances, bottled in artisan glass.',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80',
    isActive: true, order: 1,
  },
  {
    _id: '2', title: 'Premium Abayas',
    description: 'Elegant, flowing abayas in the finest fabrics from around the world.',
    image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&q=80',
    isActive: true, order: 2,
  },
  {
    _id: '3', title: 'Accessories',
    description: 'Scarves, hijabs, and jewellery to complete every ensemble.',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
    isActive: true, order: 3,
  },
  {
    _id: '4', title: "Children's Wear",
    description: 'Modest, comfortable clothing for the little ones in every family.',
    image: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=600&q=80',
    isActive: true, order: 4,
  },
];

export default function CollectionsSection() {
  const { collections, isLoading } = useCollections();
  const items = collections.length > 0 ? collections : FALLBACK;

  return (
    <section id="collections" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">Curated For You</p>
          <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Our Collections
          </h2>
          <div className="w-16 h-px bg-yellow-400 mx-auto mt-6" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {items.map((c, i) => {
              const category = CATEGORY_MAP[c.title] || '';
              const href = category ? `/products?category=${category}` : '/products';

              return (
                <Link
                  key={c._id}
                  href={href}
                  className="group relative overflow-hidden cursor-pointer block"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                    {c.image ? (
                      <Image
                        src={c.image} alt={c.title} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100" />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="font-bold text-sm uppercase tracking-widest mb-1">{c.title}</h3>
                      <p className="text-gray-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 line-clamp-2">
                        {c.description}
                      </p>
                      <div className="w-0 group-hover:w-full h-px bg-yellow-400 transition-all duration-500 mt-3" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}