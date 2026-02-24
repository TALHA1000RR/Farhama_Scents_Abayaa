'use client';
import { useState } from 'react';
import { Loader, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { userService } from '../../api/services/api.service';
import Footer from '../../components/Footer';
import { useAuth } from '../../hooks';

export default function AccountPage() {
  const { user, logout, isInitialized } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  useEffect(() => {
    if (isInitialized && !user) router.push('/');
  }, [user, isInitialized]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const fd = new FormData();
      fd.append('name', profile.name);
      fd.append('phone', profile.phone);
      await userService.updateProfile(fd);
      setSuccess('Profile updated successfully');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) { setError('New passwords do not match'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      await userService.changePassword(passwords.currentPassword, passwords.newPassword);
      setSuccess('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to change password');
    } finally { setSaving(false); }
  };

  if (!user) return null;

  return (
    <>
      <div className="pt-[120px] min-h-screen bg-[#faf8f3]">
        <div className="bg-black text-white py-14 px-6 md:px-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black text-xl">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{user.name}</h1>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
          <div className="flex gap-1 mb-8">
            {(['profile', 'password'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSuccess(''); setError(''); }}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition ${tab === t ? 'bg-black text-white' : 'border border-gray-300 hover:border-black'}`}
              >
                {t === 'profile' ? 'Profile' : 'Password'}
              </button>
            ))}
          </div>

          <div className="bg-white p-8 shadow-sm border border-gray-100">
            {success && <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-4 py-3 border border-green-200 mb-6"><CheckCircle size={15} />{success}</div>}
            {error && <div className="text-red-500 text-sm bg-red-50 px-4 py-3 border border-red-200 mb-6">{error}</div>}

            {tab === 'profile' ? (
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Full Name</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} required className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Phone Number</label>
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Email Address</label>
                  <input type="email" value={user.email} disabled className="w-full border border-gray-100 px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                  <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <button type="submit" disabled={saving} className="bg-black text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center gap-2">
                  {saving ? <><Loader size={13} className="animate-spin" /> Saving...</> : 'Update Profile'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-5">
                {[
                  { label: 'Current Password', key: 'currentPassword' },
                  { label: 'New Password', key: 'newPassword' },
                  { label: 'Confirm New Password', key: 'confirm' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{label}</label>
                    <input type="password" value={(passwords as any)[key]} required onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition" />
                  </div>
                ))}
                <button type="submit" disabled={saving} className="bg-black text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center gap-2">
                  {saving ? <><Loader size={13} className="animate-spin" /> Changing...</> : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}