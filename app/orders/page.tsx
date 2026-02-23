'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Package, Loader, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Footer from '../../components/Footer';
import { useAuth, useOrders } from '../../hooks';
import { OrderStatus, PaymentStatus } from '../../types';


const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Refunded: 'bg-gray-100 text-gray-600',
};

const PAY_COLORS: Record<PaymentStatus, string> = {
  Pending: 'text-yellow-600',
  Paid: 'text-green-600',
  Failed: 'text-red-600',
  Refunded: 'text-gray-500',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const { myOrders, isLoading, cancel } = useOrders();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user]);

  return (
    <>
      <div className="pt-[120px] min-h-screen bg-[#faf8f3]">
        <div className="bg-black text-white py-14 px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Account</p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>My Orders</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader size={32} className="animate-spin text-yellow-400" /></div>
          ) : myOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={56} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
              <Link href="/products" className="inline-block bg-black text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div key={order._id} className="bg-white p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="font-black text-sm">Order #{order.orderNumber}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                      <span className={`text-[10px] font-bold uppercase ${PAY_COLORS[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                        <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Shipped to: {order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-base">£{order.total.toFixed(2)}</span>
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => cancel(order._id)}
                          className="text-xs font-bold text-red-500 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}