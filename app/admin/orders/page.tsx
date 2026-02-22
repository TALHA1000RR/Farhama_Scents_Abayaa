'use client';
import { useEffect, useState } from 'react';
import { Loader, ChevronDown } from 'lucide-react';
import { useOrders } from '../../../hooks';
import { OrderStatus } from '../../../types';
// import { useOrders } from '@/hooks';
// import type { OrderStatus, Order } from '@/types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Refunded: 'bg-gray-100 text-gray-600',
};

const STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled', 'Refunded'];

export default function AdminOrders() {
  const { allOrders, isLoading, meta, fetchAll, changeStatus } = useOrders();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    await changeStatus(id, status);
    setUpdatingId(null);
  };

  const filtered = filterStatus ? allOrders.filter((o) => o.status === filterStatus) : allOrders;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Orders</h1>
          <p className="text-gray-500 text-sm">{meta?.total ?? allOrders.length} orders total</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black bg-white"
        >
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-yellow-400" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Order #', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Update'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-bold text-xs">#{order.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                      <p className="text-gray-400">{order.shippingAddress.city}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3 font-black">£{order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : order.paymentStatus === 'Pending' ? 'text-yellow-600' : 'text-red-500'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {updatingId === order._id ? (
                        <Loader size={14} className="animate-spin text-yellow-400" />
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                          className="border border-gray-200 text-xs px-2 py-1.5 outline-none focus:border-black bg-white"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
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