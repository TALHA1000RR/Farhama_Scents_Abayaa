'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader, X } from 'lucide-react';
import { blogService } from '../../../api/services/api.service';
import { BlogPost } from '../../../types';
// import { blogService } from '@/store/services/api.services';
// import type { BlogPost } from '@/types';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', content: '', category: '', author: '', isPublished: false });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    blogService.getAll({ limit: '50' })
      .then((r) => setPosts(r.data.data || []))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', content: '', category: '', author: '', isPublished: false }); setShowForm(true); };
  const openEdit = (p: BlogPost) => { setEditing(p); setForm({ title: p.title, description: p.description, content: p.content, category: p.category, author: p.author, isPublished: p.isPublished }); setShowForm(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imageFile) fd.append('image', imageFile);
      if (editing) {
        await blogService.update(editing._id, form);
      } else {
        await blogService.create(fd);
      }
      setShowForm(false);
      load();
    } catch (e: any) { alert(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    setDeleting(id);
    try { await blogService.delete(id); load(); }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Blog</h1>
          <p className="text-gray-500 text-sm">{posts.length} posts total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition">
          <Plus size={15} /> New Post
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-yellow-400" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Title', 'Category', 'Author', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold line-clamp-1 max-w-[240px]">{post.title}</p>
                      <p className="text-gray-400 text-xs line-clamp-1 max-w-[240px]">{post.description}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{post.category}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{post.author}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(post)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-black"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(post._id)} disabled={deleting === post._id} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                          {deleting === post._id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
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

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-black uppercase tracking-widest text-sm">{editing ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[
                { label: 'Title', key: 'title', required: true },
                { label: 'Category', key: 'category', required: true },
                { label: 'Author', key: 'author', required: true },
              ].map(({ label, key, required }) => (
                <div key={key}>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{label}</label>
                  <input type="text" value={(form as any)[key]} required={required} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition" />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Short Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Content (HTML supported)</label>
                <textarea rows={8} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none font-mono" />
              </div>
              {!editing && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Featured Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:bg-black file:text-white file:text-xs file:font-bold file:border-0 hover:file:bg-yellow-400 hover:file:text-black" />
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4 accent-black" />
                <span className="text-xs font-medium">Publish immediately</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-black text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><Loader size={13} className="animate-spin" /> Saving...</> : (editing ? 'Update Post' : 'Create Post')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 border border-gray-300 text-xs font-bold hover:border-black transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}