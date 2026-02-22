'use client';
import { useState, useEffect } from 'react';
import { SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ui/ProductCard';
import { useProducts } from '../../hooks';


const CATEGORIES = [
  { label: 'All Products', value: '' },
  { label: 'Perfumes', value: 'Perfume' },
  { label: 'Abayas', value: 'Abayas' },
  { label: 'Accessories', value: 'Accessories' },
  { label: "Men's Wear", value: 'MensWear' },
  { label: "Children's Wear", value: 'ChildrenWear' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Name A–Z', value: 'name' },
];

export default function ProductsPage() {
  const { items, isLoading, meta, fetchPage, fetchByCategory } = useProducts(false);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPage(page, { ...(category ? { category } : {}), sort, limit: 12 });
  }, [page, category, sort]);

  const handleCategory = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <>
      <div className="pt-[120px] min-h-screen bg-[#faf8f3]">
        {/* Page header */}
        <div className="bg-black text-white py-14 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Browse</p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>All Products</h1>
            {meta && <p className="text-gray-400 text-sm mt-2">{meta.total} products available</p>}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-56 flex-shrink-0">
              <div className="bg-white p-5 sticky top-[140px]">
                <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-gray-400">Categories</p>
                <ul className="space-y-1">
                  {CATEGORIES.map(({ label, value }) => (
                    <li key={value}>
                      <button
                        onClick={() => handleCategory(value)}
                        className={`w-full text-left px-3 py-2 text-xs font-medium transition-all ${
                          category === value ? 'bg-black text-white font-bold' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 bg-white px-4 py-3">
                <p className="text-xs text-gray-500">
                  {meta ? `Showing ${(page - 1) * 12 + 1}–${Math.min(page * 12, meta.total)} of ${meta.total}` : ''}
                </p>
                <div className="flex items-center gap-3">
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="text-xs border border-gray-200 px-3 py-2 outline-none focus:border-black bg-white"
                  >
                    {SORT_OPTIONS.map(({ label, value }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-gray-200 mb-3" />
                      <div className="h-3 bg-gray-200 rounded mb-2 w-1/4" />
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    className="w-9 h-9 border border-gray-300 flex items-center justify-center hover:border-black transition disabled:opacity-30"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {[...Array(meta.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 text-xs font-bold transition ${
                        page === i + 1 ? 'bg-black text-white' : 'border border-gray-300 hover:border-black'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === meta.totalPages}
                    className="w-9 h-9 border border-gray-300 flex items-center justify-center hover:border-black transition disabled:opacity-30"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}