'use client';
import { Loader, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAdminUsers } from '../../../hooks';
import { userService } from '../../../api/services/api.service';
// import { useAdminUsers } from '@/hooks';
// import { userService } from '@/store/services/api.services';

export default function AdminUsers() {
  const { users, isLoading, meta, refetch } = useAdminUsers();
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setDeleting(id);
    try {
      await userService.delete(id);
      refetch();
    } finally { setDeleting(null); }
  };

  const filtered = search
    ? users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest">Users</h1>
        <p className="text-gray-500 text-sm">{meta?.total ?? users.length} registered users</p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Search users..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 pl-9 pr-4 py-2 border border-gray-200 text-sm outline-none focus:border-black transition"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-yellow-400" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['User', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-700 font-bold text-sm flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{user.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-black text-yellow-400' : 'bg-gray-100 text-gray-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={deleting === user._id || user.role === 'admin'}
                        className="p-1.5 hover:bg-red-50 rounded transition text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {deleting === user._id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}