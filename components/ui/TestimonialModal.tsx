'use client';
import { useState } from 'react';
import { X, Star, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks';
import { useToast } from '../../hooks/useToast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button"
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)} className="focus:outline-none">
          <Star size={24} className={`transition ${n <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

export default function TestimonyModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const toast    = useToast();

  const [rating,     setRating]     = useState(5);
  const [location,   setLocation]   = useState('');
  const [message,    setMessage]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to submit a testimonial'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const fd = new FormData();
      fd.append('name',     user.name);
      fd.append('location', location);
      fd.append('message',  message);
      fd.append('rating',   String(rating));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to submit');
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setRating(5); setLocation(''); setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition p-1">
          <X size={22} />
        </button>

        <div className="p-8">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Thank You!</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your testimonial has been submitted and is pending review. Once approved by our team it will appear on our website.
              </p>
              <button onClick={handleClose}
                className="mt-6 bg-black text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition">
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-black uppercase tracking-widest mb-1">Share Your Story</h2>
                <p className="text-gray-500 text-sm">
                  We love hearing from our customers. Your testimonial will be reviewed and featured on our site.
                </p>
              </div>

              {!user ? (
                <p className="text-sm text-gray-500 py-4">Please <strong>sign in</strong> to submit a testimonial.</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Your Name</label>
                    <input type="text" value={user.name} disabled
                      className="w-full border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Your Location *</label>
                    <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. London, UK"
                      className="w-full border text-gray-700 border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-500">Your Rating *</label>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Your Testimonial *</label>
                    <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                      minLength={20}
                      placeholder="Tell us about your experience with Farhama Scents & Abayaa..."
                      className="w-full border border-gray-200 px-4 py-3 text-sm outline-none text-gray-700 focus:border-black transition resize-none" />
                    <p className="text-[10px] text-gray-400 mt-1">{message.length} / 500 characters</p>
                  </div>

                  <p className="text-[10px] text-gray-400">
                    Your testimonial will be reviewed by our team before appearing on the website.
                  </p>

                  <button type="submit" disabled={submitting}
                    className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <><Loader size={15} className="animate-spin" /> Submitting...</> : 'Submit Testimonial'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}