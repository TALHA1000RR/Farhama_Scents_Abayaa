'use client';
import { useState } from 'react';
import { Loader, Check, Trash2, Plus, X } from 'lucide-react';
import { useHeroSlides, useAdminTestimonials, useCollections } from '../../../hooks';
import { collectionService } from '../../../api/services/api.service';
import type { HeroSlide } from '../../../types';

type Tab = 'hero' | 'collections' | 'testimonials';

export default function AdminContent() {
  const [tab, setTab] = useState<Tab>('hero');
  const heroHook         = useHeroSlides();
  const testimonialsHook = useAdminTestimonials();
  const collectionsHook  = useCollections();

  const isLoading =
    (tab === 'hero'         && heroHook.isLoading)         ||
    (tab === 'testimonials' && testimonialsHook.isLoading) ||
    (tab === 'collections'  && collectionsHook.isLoading);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest">Content</h1>
        <p className="text-gray-500 text-sm">Manage hero slides, collections, and testimonials</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded w-fit">
        {(['hero', 'collections', 'testimonials'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded ${
              tab === t ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader size={24} className="animate-spin text-yellow-400" />
        </div>
      ) : (
        <>
          {tab === 'hero'         && <HeroTab         {...heroHook} />}
          {tab === 'collections'  && <CollectionsTab  {...collectionsHook} />}
          {tab === 'testimonials' && <TestimonialsTab {...testimonialsHook} />}
        </>
      )}
    </div>
  );
}

/* ─── Hero Slides ─────────────────────────────────────────────────────────── */
function HeroTab({ slides, createSlide, updateSlide, removeSlide }: ReturnType<typeof useHeroSlides>) {
  const [showForm,   setShowForm]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', subtitle: '', description: '',
    cta1: 'Shop Now', cta2: 'Explore',
    order: 1, isActive: true,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createSlide(form);
      setShowForm(false);
      setForm({ title: '', subtitle: '', description: '', cta1: 'Shop Now', cta2: 'Explore', order: 1, isActive: true });
    } catch (err: any) {
      alert(err.message || 'Failed to create slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    setDeletingId(id);
    await removeSlide(id);
    setDeletingId(null);
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    await updateSlide(slide._id, { isActive: !slide.isActive });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition"
        >
          <Plus size={14} /> Add Slide
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 border border-gray-200">
          <h3 className="font-black text-sm uppercase tracking-widest mb-5">New Hero Slide</h3>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Title',       key: 'title',    required: true  },
              { label: 'Subtitle',    key: 'subtitle', required: false },
              { label: 'CTA Button 1', key: 'cta1',   required: false },
              { label: 'CTA Button 2', key: 'cta2',   required: false },
            ].map(({ label, key, required }) => (
              <div key={key}>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{label}</label>
                <input
                  type="text"
                  value={(form as any)[key]}
                  required={required}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-black text-white px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader size={13} className="animate-spin" />}
                Save Slide
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 border border-gray-300 text-xs font-bold hover:border-black transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-3">
        {slides.map((slide) => (
          <div key={slide._id} className="bg-white p-5 border border-gray-100 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold">{slide.title}</p>
                {!slide.isActive && (
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">Hidden</span>
                )}
              </div>
              <p className="text-gray-500 text-xs">{slide.subtitle}</p>
              <p className="text-gray-400 text-xs mt-1 line-clamp-1">{slide.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleToggleActive(slide)}
                title={slide.isActive ? 'Hide slide' : 'Show slide'}
                className={`w-8 h-8 flex items-center justify-center rounded border transition ${
                  slide.isActive
                    ? 'border-green-500 text-green-500 hover:bg-green-50'
                    : 'border-gray-300 text-gray-400 hover:border-black'
                }`}
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => handleDelete(slide._id)}
                disabled={deletingId === slide._id}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500 transition"
              >
                {deletingId === slide._id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No hero slides yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}

/* ─── Collections ─────────────────────────────────────────────────────────── */
function CollectionsTab({ collections, refetch }: ReturnType<typeof useCollections>) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collection?')) return;
    setDeletingId(id);
    try {
      await collectionService.delete(id);
      refetch();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        {collections.length} collection{collections.length !== 1 ? 's' : ''}. Use the API or Postman to create new entries.
      </p>
      {collections.map((c) => (
        <div key={c._id} className="bg-white p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">{c.title}</p>
            <p className="text-gray-500 text-xs line-clamp-1">{c.description}</p>
          </div>
          <button
            onClick={() => handleDelete(c._id)}
            disabled={deletingId === c._id}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition"
          >
            {deletingId === c._id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
          </button>
        </div>
      ))}
      {collections.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-8">No collections found.</p>
      )}
    </div>
  );
}

/* ─── Testimonials ────────────────────────────────────────────────────────── */
function TestimonialsTab({ testimonials, approve, remove }: ReturnType<typeof useAdminTestimonials>) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleApprove = async (id: string, value: boolean) => {
    setUpdatingId(id);
    await approve(id, value);
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    setUpdatingId(id);
    await remove(id);
    setUpdatingId(null);
  };

  return (
    <div className="space-y-3">
      {testimonials.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-8">No testimonials submitted yet.</p>
      )}
      {testimonials.map((t) => (
        <div key={t._id} className="bg-white p-5 border border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-sm">{t.name}</p>
                <span className="text-gray-400 text-xs">{t.location}</span>
                {!t.isApproved && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Pending</span>
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{t.message}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!t.isApproved ? (
                <button
                  onClick={() => handleApprove(t._id, true)}
                  disabled={updatingId === t._id}
                  className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2.5 py-1.5 hover:bg-green-200 transition"
                >
                  <Check size={11} /> Approve
                </button>
              ) : (
                <button
                  onClick={() => handleApprove(t._id, false)}
                  disabled={updatingId === t._id}
                  className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1.5 hover:bg-gray-200 transition"
                >
                  Unapprove
                </button>
              )}
              <button
                onClick={() => handleDelete(t._id)}
                disabled={updatingId === t._id}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 transition"
              >
                {updatingId === t._id ? <Loader size={12} className="animate-spin" /> : <Trash2 size={12} />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { Plus, Trash2, Loader, Check, X } from 'lucide-react';
// import { adminService, collectionService, testimonialService } from '../../../api/services/api.service';
// import { HeroSlide, Collection, Testimonial } from '../../../types';
// // import { adminService, collectionService, testimonialService } from '@/store/services/api.services';
// // import type { HeroSlide, Collection, Testimonial } from '@/types';

// type Tab = 'hero' | 'collections' | 'testimonials';

// export default function AdminContent() {
//   const [tab, setTab] = useState<Tab>('hero');
//   const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
//   const [collections, setCollections] = useState<Collection[]>([]);
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const load = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       if (tab === 'hero') {
//         const r = await adminService.getHeroSlides();
//         setHeroSlides(r.data.data || []);
//       } else if (tab === 'collections') {
//         const r = await collectionService.getAll();
//         setCollections(r.data.data || []);
//       } else {
//         const r = await testimonialService.getAll();
//         setTestimonials(r.data.data || []);
//       }
//     } finally { setIsLoading(false); }
//   }, [tab]);

//   useEffect(() => { load(); }, [load]);

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-black uppercase tracking-widest">Content</h1>
//         <p className="text-gray-500 text-sm">Manage hero slides, collections, and testimonials</p>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-1 bg-gray-100 p-1 rounded w-fit">
//         {(['hero', 'collections', 'testimonials'] as Tab[]).map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded ${tab === t ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-yellow-400" /></div>
//       ) : (
//         <>
//           {tab === 'hero' && <HeroTab slides={heroSlides} onRefresh={load} />}
//           {tab === 'collections' && <CollectionsTab collections={collections} onRefresh={load} />}
//           {tab === 'testimonials' && <TestimonialsTab testimonials={testimonials} onRefresh={load} />}
//         </>
//       )}
//     </div>
//   );
// }

// function HeroTab({ slides, onRefresh }: { slides: HeroSlide[]; onRefresh: () => void }) {
//   const [showForm, setShowForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState<string | null>(null);
//   const [form, setForm] = useState({ title: '', subtitle: '', description: '', cta1: 'Shop Now', cta2: 'Explore', order: 1, isActive: true });

//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try { await adminService.createHeroSlide(form); setShowForm(false); onRefresh(); }
//     catch (e: any) { alert(e.response?.data?.message || 'Failed'); }
//     finally { setSaving(false); }
//   };

//   const handleDelete = async (id: string) => {
//     setDeleting(id);
//     try { await adminService.deleteHeroSlide(id); onRefresh(); }
//     finally { setDeleting(null); }
//   };

//   const toggleActive = async (slide: HeroSlide) => {
//     await adminService.updateHeroSlide(slide._id, { isActive: !slide.isActive });
//     onRefresh();
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-end">
//         <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition">
//           <Plus size={14} /> Add Slide
//         </button>
//       </div>

//       {showForm && (
//         <div className="bg-white p-6 border border-gray-200">
//           <h3 className="font-black text-sm uppercase tracking-widest mb-4">New Hero Slide</h3>
//           <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
//             {[
//               { label: 'Title', key: 'title', required: true },
//               { label: 'Subtitle', key: 'subtitle' },
//               { label: 'CTA Button 1', key: 'cta1' },
//               { label: 'CTA Button 2', key: 'cta2' },
//             ].map(({ label, key, required }) => (
//               <div key={key}>
//                 <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{label}</label>
//                 <input type="text" value={(form as any)[key]} required={required} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition" />
//               </div>
//             ))}
//             <div className="sm:col-span-2">
//               <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Description</label>
//               <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none" />
//             </div>
//             <div className="sm:col-span-2 flex gap-3">
//               <button type="submit" disabled={saving} className="bg-black text-white px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center gap-2">
//                 {saving ? <Loader size={13} className="animate-spin" /> : null} Save Slide
//               </button>
//               <button type="button" onClick={() => setShowForm(false)} className="px-6 border border-gray-300 text-xs font-bold hover:border-black transition">Cancel</button>
//             </div>
//           </form>
//         </div>
//       )}

//       <div className="grid gap-3">
//         {slides.map((slide) => (
//           <div key={slide._id} className="bg-white p-5 border border-gray-100 flex items-start justify-between gap-4">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <p className="font-bold">{slide.title}</p>
//                 {!slide.isActive && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">Hidden</span>}
//               </div>
//               <p className="text-gray-500 text-xs">{slide.subtitle}</p>
//               <p className="text-gray-400 text-xs mt-1 line-clamp-1">{slide.description}</p>
//             </div>
//             <div className="flex items-center gap-2 flex-shrink-0">
//               <button onClick={() => toggleActive(slide)} className={`w-8 h-8 flex items-center justify-center rounded border transition ${slide.isActive ? 'border-green-500 text-green-500 hover:bg-green-50' : 'border-gray-300 text-gray-400 hover:border-black'}`}>
//                 <Check size={14} />
//               </button>
//               <button onClick={() => handleDelete(slide._id)} disabled={deleting === slide._id} className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500 transition">
//                 {deleting === slide._id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function CollectionsTab({ collections, onRefresh }: { collections: Collection[]; onRefresh: () => void }) {
//   const [deleting, setDeleting] = useState<string | null>(null);

//   const handleDelete = async (id: string) => {
//     if (!confirm('Delete this collection?')) return;
//     setDeleting(id);
//     try { await collectionService.delete(id); onRefresh(); }
//     finally { setDeleting(null); }
//   };

//   return (
//     <div className="space-y-3">
//       <p className="text-sm text-gray-500">{collections.length} collections. Use the API to create/edit via Postman, or extend this page for full CRUD.</p>
//       {collections.map((c) => (
//         <div key={c._id} className="bg-white p-4 border border-gray-100 flex items-center justify-between">
//           <div>
//             <p className="font-bold text-sm">{c.title}</p>
//             <p className="text-gray-500 text-xs">{c.description}</p>
//           </div>
//           <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition">
//             {deleting === c._id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// function TestimonialsTab({ testimonials, onRefresh }: { testimonials: Testimonial[]; onRefresh: () => void }) {
//   const [updating, setUpdating] = useState<string | null>(null);

//   const handleApprove = async (id: string, value: boolean) => {
//     setUpdating(id);
//     try { await testimonialService.approve(id, value); onRefresh(); }
//     finally { setUpdating(null); }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Delete this testimonial?')) return;
//     setUpdating(id);
//     try { await testimonialService.delete(id); onRefresh(); }
//     finally { setUpdating(null); }
//   };

//   return (
//     <div className="space-y-3">
//       {testimonials.length === 0 ? (
//         <p className="text-gray-400 text-sm">No testimonials submitted yet.</p>
//       ) : (
//         testimonials.map((t) => (
//           <div key={t._id} className="bg-white p-5 border border-gray-100">
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <p className="font-bold text-sm">{t.name}</p>
//                   <span className="text-gray-400 text-xs">{t.location}</span>
//                   {!t.isApproved && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 font-bold">Pending</span>}
//                 </div>
//                 <p className="text-gray-600 text-sm">{t.message}</p>
//               </div>
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 {!t.isApproved ? (
//                   <button onClick={() => handleApprove(t._id, true)} disabled={updating === t._id} className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2.5 py-1.5 hover:bg-green-200 transition">
//                     <Check size={11} /> Approve
//                   </button>
//                 ) : (
//                   <button onClick={() => handleApprove(t._id, false)} disabled={updating === t._id} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1.5 hover:bg-gray-200 transition">
//                     Unapprove
//                   </button>
//                 )}
//                 <button onClick={() => handleDelete(t._id)} disabled={updating === t._id} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500">
//                   {updating === t._id ? <Loader size={12} className="animate-spin" /> : <Trash2 size={12} />}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }