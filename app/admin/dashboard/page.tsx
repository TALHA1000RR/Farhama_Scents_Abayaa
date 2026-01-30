"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Package,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Upload,
} from "lucide-react";
import Logo from "@/public/logo.png";

interface User {
  name: string;
  email: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  discount?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role !== "admin") {
        router.push("/");
      } else {
        setUser(userData);
      }
    } else {
      router.push("/");
    }

    // Load mock products
    setProducts([
      { id: 1, name: "Luxury Oud Perfume", category: "Perfume", price: 126, oldPrice: 140, discount: "-10%" },
      { id: 2, name: "Elegant Black Abaya", category: "Abayas", price: 89 },
      { id: 3, name: "Designer Handbag", category: "Accessories", price: 145 },
      { id: 4, name: "Premium Leather Belt", category: "Accessories", price: 45 },
    ]);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const stats = [
    { label: "Total Products", value: "248", icon: Package, color: "bg-blue-500" },
    { label: "Total Orders", value: "1,429", icon: MessageSquare, color: "bg-green-500" },
    { label: "Active Users", value: "3,842", icon: Users, color: "bg-purple-500" },
    { label: "Revenue (Month)", value: "£28,450", icon: Home, color: "bg-yellow-500" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-black text-white p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <Image src={Logo} alt="Farhama Logo" width={40} height={40} />
          <div>
            <h2 className="font-bold text-xl">FARHAMA</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {[
            { id: "overview", label: "Overview", icon: Home },
            { id: "products", label: "Products", icon: Package },
            { id: "orders", label: "Orders", icon: MessageSquare },
            { id: "customers", label: "Customers", icon: Users },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? "bg-brandGold text-black"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 mt-auto absolute bottom-6 left-6 right-6"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your store today.
          </p>
        </header>

        {/* Stats Grid */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {[
                  { order: "#12345", customer: "Sarah Williams", amount: "£145", status: "Completed" },
                  { order: "#12346", customer: "Aisha Rahman", amount: "£89", status: "Processing" },
                  { order: "#12347", customer: "Fatima Hassan", amount: "£234", status: "Shipped" },
                ].map((order) => (
                  <div
                    key={order.order}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{order.order}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{order.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === "Completed" ? "bg-green-100 text-green-700" :
                        order.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Products Management */}
        {activeTab === "products" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Product Management</h2>
              <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-brandGold transition">
                <Plus size={18} />
                Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Discount</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{product.id}</td>
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">
                        £{product.price}
                        {product.oldPrice && (
                          <span className="text-gray-400 line-through ml-2 text-sm">
                            £{product.oldPrice}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {product.discount && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                            {product.discount}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded">
                            <Edit size={16} className="text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded">
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {["orders", "customers", "settings"].includes(activeTab) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h2>
            <p className="text-gray-600">
              This section is under development. You can add your {activeTab} management features here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}