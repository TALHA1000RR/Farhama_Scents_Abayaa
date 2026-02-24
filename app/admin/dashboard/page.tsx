'use client';
// import { useAdminDashboard, useRevenueAnalytics } from '@/hooks';
import { ShoppingCart, Users, Package, TrendingUp, AlertTriangle, Loader } from 'lucide-react';
import { useAdminDashboard, useRevenueAnalytics } from '../../../hooks';
import { OrderStatus } from '../../../types';
// import type { OrderStatus } from '@/types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Refunded: 'bg-gray-100 text-gray-600',
};

export default function AdminDashboard() {
  const { stats, recentOrders, lowStockProducts, ordersByStatus, isLoading } = useAdminDashboard();
  const { data: revenueData } = useRevenueAnalytics();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><Loader size={32} className="animate-spin text-yellow-400" /></div>;
  }

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, Icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: `£${(stats?.monthRevenue ?? 0).toFixed(0)}`, Icon: TrendingUp, color: 'bg-green-500', sub: 'This month' },
    { label: 'Products', value: stats?.totalProducts ?? 0, Icon: Package, color: 'bg-purple-500' },
    { label: 'Customers', value: stats?.totalUsers ?? 0, Icon: Users, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ label, value, Icon, color, sub }) => (
          <div key={label} className="bg-white p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <Icon size={20} className={color.replace('bg-', 'text-')} />
              </div>
            </div>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
            {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-sm uppercase tracking-wider">Recent Orders</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No orders yet</p>
            ) : (
              recentOrders.slice(0, 8).map((order) => (
                <div key={order._id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-bold">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status as OrderStatus]}`}>
                    {order.status}
                  </span>
                  <span className="font-black text-sm">£{order.total.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            <h2 className="font-black text-sm uppercase tracking-wider">Low Stock</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">All products well stocked</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-xs font-bold line-clamp-1">{product.name}</p>
                    <p className="text-[10px] text-gray-400">{product.category}</p>
                  </div>
                  <span className={`text-xs font-black ${product.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                    {product.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Orders by Status */}
      {ordersByStatus.length > 0 && (
        <div className="bg-white border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-sm uppercase tracking-wider mb-4">Orders by Status</h2>
          <div className="flex flex-wrap gap-4">
            {ordersByStatus.map(({ _id, count }) => (
              <div key={_id} className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[_id as OrderStatus] || 'bg-gray-100 text-gray-600'}`}>
                  {_id}
                </span>
                <span className="font-bold text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}