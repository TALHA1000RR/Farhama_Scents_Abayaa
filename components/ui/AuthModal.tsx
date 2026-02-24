'use client';
import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../../hooks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  setMode: (m: 'signin' | 'signup') => void;
}

export default function AuthModal({ isOpen, onClose, mode, setMode }: Props) {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [showPw, setShowPw]       = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', phone: '', role: 'user',
  });

  useEffect(() => {
    if (isOpen) {
      clearError();
      setLocalError(null);
      setForm({ name: '', email: '', password: '', confirm: '', phone: '', role: 'user' });
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setLocalError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (mode === 'signup') {
      if (form.password !== form.confirm) { setLocalError('Passwords do not match'); return; }
      if (form.password.length < 6)       { setLocalError('Password must be at least 6 characters'); return; }
      const result = await register({
        name: form.name, email: form.email, password: form.password,
        phone: form.phone || undefined, role: form.role as 'user' | 'admin',
      });
      if (result.success) onClose();
      else setLocalError(result.error || 'Registration failed');
    } else {
      const result = await login({ email: form.email, password: form.password });
      if (result.success) onClose();
      else setLocalError(result.error || 'Invalid email or password');
    }
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition z-10 p-1">
          <X size={22} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black tracking-widest uppercase">
              {mode === 'signin' ? 'WELCOME BACK' : 'JOIN FARHAMA'}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {mode === 'signin' ? 'Sign in to your account' : 'Create your account to start shopping'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Field label="Full Name" name="name" value={form.name} onChange={set} placeholder="Aisha Rahman" required />
            )}

            <Field label="Email" name="email" type="email" value={form.email} onChange={set} placeholder="you@example.com" required />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={set}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-black transition"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <>
                <Field label="Confirm Password" name="confirm" type={showPw ? 'text' : 'password'} value={form.confirm} onChange={set} placeholder="••••••••" required autoComplete="new-password" />
                <Field label="Phone (optional)" name="phone" type="tel" value={form.phone} onChange={set} placeholder="+44 7700 900123" />
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Account Type</label>
                  <select name="role" value={form.role} onChange={set} className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition bg-white">
                    <option value="user">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button type="button" className="text-xs text-gray-500 hover:text-black underline transition">
                  Forgot password?
                </button>
              </div>
            )}

            {displayError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded">
                {displayError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading
                ? <><Loader size={16} className="animate-spin" /> Processing...</>
                : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); clearError(); setLocalError(null); }}
              className="text-black font-bold hover:text-yellow-600 transition"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, placeholder, required = false, autoComplete }: any) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required} autoComplete={autoComplete}
        className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition"
      />
    </div>
  );
}