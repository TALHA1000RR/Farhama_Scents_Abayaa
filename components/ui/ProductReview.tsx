'use client';
import { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, ThumbsDown, Pencil, Trash2, Loader, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks';
import { useToast } from '../../hooks/useToast';


interface Review {
  _id: string;
  user: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  helpful: string[];
  unhelpful: string[];
  createdAt: string;
}

interface Meta { total: number; page: number; limit: number; totalPages: number; }

const API = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button"
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="focus:outline-none">
          <Star size={22} className={`transition ${n <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { user, isAdmin } = useAuth();
  const toast = useToast();

  const [reviews,    setReviews]    = useState<Review[]>([]);
  const [meta,       setMeta]       = useState<Meta | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [page,       setPage]       = useState(1);
  const [myReview,   setMyReview]   = useState<Review | null>(null);

  // Form state
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState<Review | null>(null);
  const [formRating, setFormRating] = useState(5);
  const [formTitle,  setFormTitle]  = useState('');
  const [formBody,   setFormBody]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (p = 1) => {
    setIsLoading(true);
    try {
      const res = await apiFetch(`/products/${productId}/reviews?page=${p}&limit=10`);
      setReviews(res.data);
      setMeta(res.meta);
      if (user) {
        const mine = (res.data as Review[]).find((r) => r.user === user._id);
        if (mine) setMyReview(mine);
      }
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  }, [productId, user]);

  useEffect(() => { load(page); }, [page, load]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const openCreate = () => {
    setEditing(null);
    setFormRating(5); setFormTitle(''); setFormBody('');
    setShowForm(true);
  };

  const openEdit = (r: Review) => {
    setEditing(r);
    setFormRating(r.rating); setFormTitle(r.title); setFormBody(r.body);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await apiFetch(`/products/${productId}/reviews/${editing._id}`, {
          method: 'PATCH',
          body: JSON.stringify({ rating: formRating, title: formTitle, body: formBody }),
        });
        toast.success('Review updated');
      } else {
        await apiFetch(`/products/${productId}/reviews`, {
          method: 'POST',
          body: JSON.stringify({ rating: formRating, title: formTitle, body: formBody }),
        });
        toast.success('Review posted!');
      }
      setShowForm(false);
      load(page);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await apiFetch(`/products/${productId}/reviews/${id}`, { method: 'DELETE' });
      toast.success('Review deleted');
      load(page);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  const handleReact = async (reviewId: string, reaction: 'helpful' | 'unhelpful') => {
    if (!user) { toast.info('Sign in to react to reviews'); return; }
    try {
      await apiFetch(`/products/${productId}/reviews/${reviewId}/react`, {
        method: 'POST',
        body: JSON.stringify({ reaction }),
      });
      load(page);
    } catch { /* silent */ }
  };

  const ratingBars = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-light mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        Customer Reviews
      </h2>

      {/* Summary bar */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 mb-10 p-6 bg-gray-50 rounded">
          <div className="text-center">
            <p className="text-5xl font-black">{avgRating}</p>
            <div className="flex justify-center gap-0.5 my-2">
              {[1,2,3,4,5].map((n) => (
                <Star key={n} size={14} className={n <= Math.round(Number(avgRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <p className="text-xs text-gray-500">{meta?.total ?? reviews.length} review{(meta?.total ?? reviews.length) !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingBars.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-right text-gray-500">{star}</span>
                <Star size={10} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full rounded-full transition-all"
                    style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="w-4 text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review button */}
      {user && !myReview && !showForm && (
        <button onClick={openCreate}
          className="mb-8 flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition">
          <Star size={14} /> Write a Review
        </button>
      )}
      {!user && (
        <p className="mb-8 text-sm text-gray-500">
          <span className="font-semibold text-black">Sign in</span> to write a review.
        </p>
      )}

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 bg-white border border-gray-200 p-6 rounded space-y-4">
          <h3 className="font-black text-sm uppercase tracking-widest">
            {editing ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-500">Your Rating *</label>
            <StarPicker value={formRating} onChange={setFormRating} />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Review Title *</label>
            <input type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Summarise your experience"
              className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Your Review *</label>
            <textarea rows={4} required minLength={10} value={formBody} onChange={(e) => setFormBody(e.target.value)}
              placeholder="Share your experience with this product (min 10 characters)"
              className="w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting}
              className="bg-black text-white px-6 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center gap-2">
              {submitting && <Loader size={13} className="animate-spin" />}
              {editing ? 'Update Review' : 'Post Review'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-6 border border-gray-300 text-xs font-bold hover:border-black transition">Cancel</button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader size={22} className="animate-spin text-yellow-400" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-10">No reviews yet. Be the first to review this product.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const isOwner = user?._id === review.user;
            const hasHelpful   = user ? review.helpful.includes(user._id)   : false;
            const hasUnhelpful = user ? review.unhelpful.includes(user._id) : false;

            return (
              <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-600 font-bold text-sm flex-shrink-0">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.userName}</p>
                      <p className="text-gray-400 text-xs">{new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  {(isOwner || isAdmin) && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isOwner && (
                        <button onClick={() => openEdit(review)}
                          className="p-1.5 hover:bg-gray-100 rounded transition text-gray-400 hover:text-black">
                          <Pencil size={13} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(review._id)}
                        className="p-1.5 hover:bg-red-50 rounded transition text-gray-400 hover:text-red-500">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((n) => (
                        <Star key={n} size={13} className={n <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <p className="font-semibold text-sm">{review.title}</p>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-400">Helpful?</span>
                  <button
                    onClick={() => handleReact(review._id, 'helpful')}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition ${hasHelpful ? 'border-yellow-400 bg-yellow-50 text-yellow-600' : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}>
                    <ThumbsUp size={11} /> {review.helpful.length}
                  </button>
                  <button
                    onClick={() => handleReact(review._id, 'unhelpful')}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition ${hasUnhelpful ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}>
                    <ThumbsDown size={11} /> {review.unhelpful.length}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {page < meta.totalPages && (
            <button onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-gray-300 px-5 py-2.5 hover:border-black transition">
              Load More <ChevronDown size={14} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}