'use client';
import { useState, useRef } from 'react';
import { Loader, Check, Trash2, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useHeroSlides, useAdminTestimonials, useCollections } from '../../../hooks';
import { collectionService, adminService } from '../../../api/services/api.service';
import { useToast } from '../../../hooks/useToast';
import type { HeroSlide, Collection } from '../../../types';

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

      <div className="flex gap-1 bg-gray-100 p-1 rounded w-fit">
        {(['hero', 'collections', 'testimonials'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded ${tab === t ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}>
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-yellow-400" /></div>
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

/* ─── Image Picker helper ────────────────────────────────────────────────── */
function ImagePicker({ value, onChange, label = 'Image' }: {
  value: File | null;
  onChange: (f: File | null) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const preview = value ? URL.createObjectURL(value) : null;

  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="relative border-2 border-dashed border-gray-200 rounded cursor-pointer hover:border-black transition flex items-center justify-center bg-gray-50 overflow-hidden"
        style={{ minHeight: 96 }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className="w-full h-24 object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 py-4 text-gray-400">
            <Upload size={20} />
            <span className="text-xs">Click to upload image</span>
          </div>
        )}
        {preview && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition"
          >
            <X size={10} />
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)} />
    </div>
  );
}

/* ─── Hero Slides ─────────────────────────────────────────────────────────── */
function HeroTab({ slides, updateSlide, removeSlide, refetch }: ReturnType<typeof useHeroSlides>) {
  const toast = useToast();
  const [showForm,   setShowForm]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageFile,  setImageFile]  = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '', subtitle: '', description: '',
    cta1: 'Shop Now', cta2: 'Explore', order: 1, isActive: true,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imageFile) fd.append('image', imageFile);
      // Call API directly as multipart — adminService.createHeroSlide sends JSON
      const { default: axios } = await import('axios');
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/hero-slides`,
        fd,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Hero slide created');
      setShowForm(false);
      setImageFile(null);
      setForm({ title: '', subtitle: '', description: '', cta1: 'Shop Now', cta2: 'Explore', order: 1, isActive: true });
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    setDeletingId(id);
    const ok = await removeSlide(id);
    if (ok) toast.success('Slide deleted');
    setDeletingId(null);
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    await updateSlide(slide._id, { isActive: !slide.isActive });
    toast.success(slide.isActive ? 'Slide hidden' : 'Slide visible');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition">
          <Plus size={14} /> Add Slide
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 border border-gray-200">
          <h3 className="font-black text-sm uppercase tracking-widest mb-5">New Hero Slide</h3>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Title *',      key: 'title',    required: true  },
              { label: 'Subtitle',     key: 'subtitle', required: false },
              { label: 'CTA Button 1', key: 'cta1',    required: false },
              { label: 'CTA Button 2', key: 'cta2',    required: false },
            ].map(({ label, key, required }) => (
              <div key={key}>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{label}</label>
                <input type="text" value={(form as any)[key]} required={required}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Description</label>
              <textarea rows={2} value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none" />
            </div>
            <div className="sm:col-span-2">
              <ImagePicker value={imageFile} onChange={setImageFile} label="Slide Background Image" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-black text-white px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center gap-2">
                {saving && <Loader size={13} className="animate-spin" />} Save Slide
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 border border-gray-300 text-xs font-bold hover:border-black transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-3">
        {slides.map((slide) => (
          <div key={slide._id} className="bg-white p-5 border border-gray-100 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {slide.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={slide.image} alt={slide.title} className="w-16 h-10 object-cover rounded flex-shrink-0" />
              ) : (
                <div className="w-16 h-10 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                  <ImageIcon size={16} className="text-gray-300" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">{slide.title}</p>
                  {!slide.isActive && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">Hidden</span>}
                </div>
                <p className="text-gray-500 text-xs">{slide.subtitle}</p>
                <p className="text-gray-400 text-xs mt-1 line-clamp-1">{slide.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleToggleActive(slide)}
                title={slide.isActive ? 'Hide' : 'Show'}
                className={`w-8 h-8 flex items-center justify-center rounded border transition ${slide.isActive ? 'border-green-500 text-green-500 hover:bg-green-50' : 'border-gray-300 text-gray-400 hover:border-black'}`}>
                <Check size={14} />
              </button>
              <button onClick={() => handleDelete(slide._id)} disabled={deletingId === slide._id}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500 transition">
                {deletingId === slide._id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            </div>
          </div>
        ))}
        {slides.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No hero slides yet. Add one above.</p>}
      </div>
    </div>
  );
}

/* ─── Collections ─────────────────────────────────────────────────────────── */
function CollectionsTab({ collections, refetch }: ReturnType<typeof useCollections>) {
  const toast = useToast();
  const [showForm,   setShowForm]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageFile,  setImageFile]  = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', description: '', order: 0, isActive: true });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imageFile) fd.append('image', imageFile);
      const { default: axios } = await import('axios');
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/collections`,
        fd,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Collection created');
      setShowForm(false);
      setImageFile(null);
      setForm({ title: '', description: '', order: 0, isActive: true });
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create collection');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collection?')) return;
    setDeletingId(id);
    try {
      await collectionService.delete(id);
      toast.success('Collection deleted');
      refetch();
    } catch {
      toast.error('Failed to delete collection');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition">
          <Plus size={14} /> Add Collection
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 border border-gray-200">
          <h3 className="font-black text-sm uppercase tracking-widest mb-5">New Collection</h3>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Title *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Display Order</label>
              <input type="number" min={0} value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Description *</label>
              <textarea rows={2} required value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none" />
            </div>
            <div className="sm:col-span-2">
              <ImagePicker value={imageFile} onChange={setImageFile} label="Collection Image" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-black text-white px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center gap-2">
                {saving && <Loader size={13} className="animate-spin" />} Save Collection
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 border border-gray-300 text-xs font-bold hover:border-black transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-3">
        {collections.map((c) => (
          <div key={c._id} className="bg-white p-4 border border-gray-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt={c.title} className="w-12 h-12 object-cover rounded flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                  <ImageIcon size={16} className="text-gray-300" />
                </div>
              )}
              <div>
                <p className="font-bold text-sm">{c.title}</p>
                <p className="text-gray-500 text-xs line-clamp-1">{c.description}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(c._id)} disabled={deletingId === c._id}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition flex-shrink-0">
              {deletingId === c._id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
            </button>
          </div>
        ))}
        {collections.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No collections yet. Add one above.</p>}
      </div>
    </div>
  );
}

/* ─── Testimonials ────────────────────────────────────────────────────────── */
function TestimonialsTab({ testimonials, approve, remove }: ReturnType<typeof useAdminTestimonials>) {
  const toast = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleApprove = async (id: string, value: boolean) => {
    setUpdatingId(id);
    await approve(id, value);
    toast.success(value ? 'Testimonial approved' : 'Testimonial unapproved');
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    setUpdatingId(id);
    await remove(id);
    toast.success('Testimonial deleted');
    setUpdatingId(null);
  };

  return (
    <div className="space-y-3">
      {testimonials.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No testimonials submitted yet.</p>}
      {testimonials.map((t) => (
        <div key={t._id} className="bg-white p-5 border border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-sm">{t.name}</p>
                <span className="text-gray-400 text-xs">{t.location}</span>
                {!t.isApproved && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Pending</span>}
                {t.isApproved  && <span className="text-[10px] bg-green-100  text-green-700  px-2 py-0.5 rounded-full font-bold">Approved</span>}
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{t.message}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!t.isApproved ? (
                <button onClick={() => handleApprove(t._id, true)} disabled={updatingId === t._id}
                  className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2.5 py-1.5 hover:bg-green-200 transition">
                  <Check size={11} /> Approve
                </button>
              ) : (
                <button onClick={() => handleApprove(t._id, false)} disabled={updatingId === t._id}
                  className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1.5 hover:bg-gray-200 transition">
                  Unapprove
                </button>
              )}
              <button onClick={() => handleDelete(t._id)} disabled={updatingId === t._id}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 transition">
                {updatingId === t._id ? <Loader size={12} className="animate-spin" /> : <Trash2 size={12} />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}