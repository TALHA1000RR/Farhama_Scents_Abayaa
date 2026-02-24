'use client';
import { useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader, Search, X } from 'lucide-react';
import Image from 'next/image';
import { productService } from '../../../api/services/api.service';
import { useProducts } from '../../../hooks';
import { Product } from '../../../types';


const CATEGORIES = ['Perfume', 'Abayas', 'Accessories', 'MensWear', 'ChildrenWear'];

export default function AdminProducts() {
  const { items, isLoading, meta, fetchPage } = useProducts(true);
  const [search,    setSearch]    = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState<Product | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', category: 'Perfume',
    price: '', stock: '', isFeatured: false, isActive: true,
  });
  // Multiple image files — backend expects field name "images" (array)
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', category: 'Perfume', price: '', stock: '', isFeatured: false, isActive: true });
    setImageFiles([]);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, category: p.category, price: String(p.price), stock: String(p.stock), isFeatured: p.isFeatured, isActive: p.isActive });
    setImageFiles([]);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      // Field name MUST be "images" — matches upload.array('images', 5) in backend
      imageFiles.forEach((file) => fd.append('images', file));

      if (editing) {
        await productService.update(editing._id, fd as any);
      } else {
        await productService.create(fd);
      }
      setShowForm(false);
      fetchPage(1);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await productService.delete(id);
      fetchPage(1);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Products</h1>
          <p className="text-gray-500 text-sm">{meta?.total ?? 0} products total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Search products..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 pl-9 pr-4 py-2 border border-gray-200 text-sm outline-none focus:border-black transition"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader size={24} className="animate-spin text-yellow-400" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Product', 'Category', 'Price', 'Stock', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <div className="w-10 h-10 relative flex-shrink-0 bg-gray-100 overflow-hidden rounded">
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
                          {product.isFeatured && (
                            <span className="text-[9px] font-black uppercase bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{product.category}</td>
                    <td className="px-4 py-3 font-bold">£{product.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-xs ${product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-orange-500' : 'text-gray-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(product)} className="p-1.5 hover:bg-gray-100 rounded transition text-gray-500 hover:text-black">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} disabled={deleting === product._id} className="p-1.5 hover:bg-red-50 rounded transition text-gray-500 hover:text-red-500">
                          {deleting === product._id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-black uppercase tracking-widest text-sm">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[
                { label: 'Product Name', key: 'name',  type: 'text',   required: true  },
                { label: 'Price (£)',    key: 'price', type: 'number', required: true  },
                { label: 'Stock',        key: 'stock', type: 'number', required: true  },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{label}</label>
                  <input
                    type={type} value={(form as any)[key]} required={required}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition"
                    min={type === 'number' ? 0 : undefined}
                    step={key === 'price' ? '0.01' : undefined}
                  />
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition bg-white">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">
                  Product Images (up to 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []).slice(0, 5))}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:bg-black file:text-white file:text-xs file:font-bold file:border-0 hover:file:bg-yellow-400 hover:file:text-black"
                />
                {imageFiles.length > 0 && (
                  <p className="text-[10px] text-gray-400 mt-1">{imageFiles.length} file{imageFiles.length > 1 ? 's' : ''} selected</p>
                )}
                {editing && editing.images?.length > 0 && imageFiles.length === 0 && (
                  <p className="text-[10px] text-gray-400 mt-1">Leave empty to keep existing {editing.images.length} image{editing.images.length > 1 ? 's' : ''}</p>
                )}
              </div>

              <div className="flex items-center gap-6">
                {[
                  { key: 'isActive',   label: 'Active'   },
                  { key: 'isFeatured', label: 'Featured' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} className="w-4 h-4 accent-black" />
                    <span className="text-xs font-medium">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-black text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><Loader size={13} className="animate-spin" /> Saving...</> : (editing ? 'Update Product' : 'Create Product')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 border border-gray-300 text-xs font-bold hover:border-black transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// 'use client';
// import { useState, useCallback } from 'react';
// import { Plus, Pencil, Trash2, Loader, Search, X, Upload } from 'lucide-react';
// import Image from 'next/image';
// import { productService } from '../../../api/services/api.service';
// import { useProducts } from '../../../hooks';
// import { Product } from '../../../types';
// // import { productService } from '@/store/services/api.services';
// // import { useProducts } from '@/hooks';
// // import type { Product } from '@/types';

// const CATEGORIES = ['Perfume', 'Abayas', 'Accessories', 'MensWear', 'ChildrenWear'];

// export default function AdminProducts() {
//   const { items, isLoading, meta, fetchPage } = useProducts(true);
//   const [search, setSearch] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [editing, setEditing] = useState<Product | null>(null);
//   const [deleting, setDeleting] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState({
//     name: '', description: '', category: 'Perfume', price: '', stock: '', isFeatured: false, isActive: true,
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const openCreate = () => { setEditing(null); setForm({ name: '', description: '', category: 'Perfume', price: '', stock: '', isFeatured: false, isActive: true }); setShowForm(true); };
//   const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, description: p.description, category: p.category, price: String(p.price), stock: String(p.stock), isFeatured: p.isFeatured, isActive: p.isActive }); setShowForm(true); };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
//       if (imageFile) fd.append('image', imageFile);

//       if (editing) {
//         await productService.update(editing._id, fd as any);
//       } else {
//         await productService.create(fd);
//       }
//       setShowForm(false);
//       fetchPage(1);
//     } catch (e: any) {
//       alert(e.response?.data?.message || 'Failed to save');
//     } finally { setSaving(false); }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Delete this product?')) return;
//     setDeleting(id);
//     try {
//       await productService.delete(id);
//       fetchPage(1);
//     } finally { setDeleting(null); }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-black uppercase tracking-widest">Products</h1>
//           <p className="text-gray-500 text-sm">{meta?.total ?? 0} products total</p>
//         </div>
//         <button onClick={openCreate} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition">
//           <Plus size={15} /> Add Product
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
//         <div className="p-4 border-b border-gray-100">
//           <div className="relative">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text" placeholder="Search products..." value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full md:w-72 pl-9 pr-4 py-2 border border-gray-200 text-sm outline-none focus:border-black transition"
//             />
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-yellow-400" /></div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-100 bg-gray-50">
//                   {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
//                     <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {items.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
//                   <tr key={product._id} className="hover:bg-gray-50 transition">
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-12 relative bg-gray-100 flex-shrink-0 overflow-hidden">
//                           {product.images?.[0] ? (
//                             <Image src={product.images[0]} alt="" fill className="object-cover" />
//                           ) : <div className="w-full h-full bg-gray-200" />}
//                         </div>
//                         <div>
//                           <p className="font-semibold line-clamp-1">{product.name}</p>
//                           {product.isFeatured && <span className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 font-bold uppercase">Featured</span>}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 text-xs">{product.category}</td>
//                     <td className="px-4 py-3 font-bold">£{product.price.toFixed(2)}</td>
//                     <td className="px-4 py-3">
//                       <span className={`font-bold text-xs ${product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-orange-500' : 'text-gray-700'}`}>
//                         {product.stock}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
//                         {product.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-2">
//                         <button onClick={() => openEdit(product)} className="p-1.5 hover:bg-gray-100 rounded transition text-gray-500 hover:text-black">
//                           <Pencil size={13} />
//                         </button>
//                         <button onClick={() => handleDelete(product._id)} disabled={deleting === product._id} className="p-1.5 hover:bg-red-50 rounded transition text-gray-500 hover:text-red-500">
//                           {deleting === product._id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
//               <h2 className="font-black uppercase tracking-widest text-sm">{editing ? 'Edit Product' : 'New Product'}</h2>
//               <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
//             </div>
//             <form onSubmit={handleSave} className="p-6 space-y-4">
//               {[
//                 { label: 'Product Name', key: 'name', type: 'text', required: true },
//                 { label: 'Price (£)', key: 'price', type: 'number', required: true },
//                 { label: 'Stock Quantity', key: 'stock', type: 'number', required: true },
//               ].map(({ label, key, type, required }) => (
//                 <div key={key}>
//                   <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{label}</label>
//                   <input
//                     type={type} value={(form as any)[key]} required={required}
//                     onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
//                     className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition"
//                     min={type === 'number' ? 0 : undefined} step={key === 'price' ? '0.01' : undefined}
//                   />
//                 </div>
//               ))}

//               <div>
//                 <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Category</label>
//                 <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition bg-white">
//                   {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Description</label>
//                 <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none" />
//               </div>

//               <div>
//                 <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Product Image</label>
//                 <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:bg-black file:text-white file:text-xs file:font-bold file:border-0 hover:file:bg-yellow-400 hover:file:text-black" />
//               </div>

//               <div className="flex items-center gap-6">
//                 {[
//                   { key: 'isActive', label: 'Active' },
//                   { key: 'isFeatured', label: 'Featured' },
//                 ].map(({ key, label }) => (
//                   <label key={key} className="flex items-center gap-2 cursor-pointer">
//                     <input type="checkbox" checked={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} className="w-4 h-4 accent-black" />
//                     <span className="text-xs font-medium">{label}</span>
//                   </label>
//                 ))}
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button type="submit" disabled={saving} className="flex-1 bg-black text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center justify-center gap-2">
//                   {saving ? <><Loader size={13} className="animate-spin" /> Saving...</> : (editing ? 'Update Product' : 'Create Product')}
//                 </button>
//                 <button type="button" onClick={() => setShowForm(false)} className="px-6 border border-gray-300 text-xs font-bold hover:border-black transition">
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }