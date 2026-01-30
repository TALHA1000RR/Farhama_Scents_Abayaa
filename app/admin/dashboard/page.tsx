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
  Menu,
  X,
  Save,
  Eye,
} from "lucide-react";
import Logo from "@/public/logo.png";

interface User {
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock data states
  const [products] = useState([
    { id: 1, name: "Luxury Oud Perfume", category: "Perfume", price: 126, oldPrice: 140, discount: "-10%" },
    { id: 2, name: "Elegant Black Abaya", category: "Abayas", price: 89 },
    { id: 3, name: "Designer Handbag", category: "Accessories", price: 145 },
    { id: 4, name: "Premium Leather Belt", category: "Accessories", price: 45 },
  ]);

  const [orders] = useState([
    { id: "#12345", customer: "Sarah Williams", amount: "£145", status: "Completed", date: "2026-01-28", items: "2 items" },
    { id: "#12346", customer: "Aisha Rahman", amount: "£89", status: "Processing", date: "2026-01-29", items: "1 item" },
    { id: "#12347", customer: "Fatima Hassan", amount: "£234", status: "Shipped", date: "2026-01-30", items: "3 items" },
    { id: "#12348", customer: "Zainab Ahmed", amount: "£156", status: "Pending", date: "2026-01-30", items: "2 items" },
  ]);

  const [customers] = useState([
    { id: 1, name: "Sarah Williams", email: "sarah@example.com", phone: "+44 7700 900123", orders: 12, totalSpent: "£1,245" },
    { id: 2, name: "Aisha Rahman", email: "aisha@example.com", phone: "+44 7700 900124", orders: 8, totalSpent: "£890" },
    { id: 3, name: "Fatima Hassan", email: "fatima@example.com", phone: "+44 7700 900125", orders: 15, totalSpent: "£2,340" },
    { id: 4, name: "Zainab Ahmed", email: "zainab@example.com", phone: "+44 7700 900126", orders: 5, totalSpent: "£567" },
  ]);

  const [heroSlides, setHeroSlides] = useState([
    {
      id: 1,
      title: "LUXURY YOU CAN AFFORD",
      subtitle: "Discover Our Exquisite Collection",
      description: "Elegant abayas, refined men's wear, children's designs, and premium accessories. Timeless style meets uncompromising quality.",
      cta1: "Discover",
      cta2: "Order Now",
    },
    {
      id: 2,
      title: "CAPTIVATING FRAGRANCES",
      subtitle: "Scents That Define You",
      description: "From oud-inspired classics to modern floral notes, our premium perfumes are crafted for those who appreciate the art of fine fragrance.",
      cta1: "Explore Scents",
      cta2: "Order Now",
    },
    {
      id: 3,
      title: "MODEST ELEGANCE",
      subtitle: "Abayas & Modest Fashion",
      description: "Beautifully tailored abayas and modest wear for women, men, and children. Fashion that honours tradition while embracing contemporary style.",
      cta1: "View Collection",
      cta2: "Order Now",
    },
  ]);

  const [collections, setCollections] = useState([
    { id: 1, title: "Accessories", description: "Premium Quality" },
    { id: 2, title: "Women's Abayas", description: "Elegant Designs" },
    { id: 3, title: "Signature Scents", description: "Luxury Perfumes" },
    { id: 4, title: "Modest Fashion", description: "Modern Style" },
    { id: 5, title: "Men's Collection", description: "Refined Wear" },
  ]);

  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Styling Modest Fashion",
      category: "Fashion Tips",
      author: "Zainab Ahmed",
      date: "January 15, 2026",
      description: "Discover how to create versatile looks with our abaya collection. Learn the art of layering and accessorizing for every occasion.",
    },
    {
      id: 2,
      title: "Choosing Your Signature Scent",
      category: "Fragrance Guide",
      author: "Sarah Mitchell",
      date: "January 10, 2026",
      description: "Navigate our perfume collection to find the perfect fragrance that matches your personality and makes a lasting impression.",
    },
    {
      id: 3,
      title: "Timeless Elegance",
      category: "Style Guide",
      author: "Amira Hassan",
      date: "January 5, 2026",
      description: "Explore how Farhama combines traditional craftsmanship with contemporary design to create pieces that transcend trends.",
    },
  ]);

  useEffect(() => {
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem({ ...item, type });
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (editingItem.type === "hero") {
      setHeroSlides(heroSlides.map(slide => 
        slide.id === editingItem.id ? editingItem : slide
      ));
    } else if (editingItem.type === "collection") {
      setCollections(collections.map(col => 
        col.id === editingItem.id ? editingItem : col
      ));
    } else if (editingItem.type === "blog") {
      setBlogPosts(blogPosts.map(post => 
        post.id === editingItem.id ? editingItem : post
      ));
    }
    setShowEditModal(false);
    setEditingItem(null);
    alert("Changes saved successfully!");
  };

  const stats = [
    { label: "Total Products", value: "248", icon: Package, color: "bg-blue-500" },
    { label: "Total Orders", value: "1,429", icon: MessageSquare, color: "bg-green-500" },
    { label: "Active Users", value: "3,842", icon: Users, color: "bg-purple-500" },
    { label: "Revenue (Month)", value: "£28,450", icon: Home, color: "bg-yellow-500" },
  ];

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: MessageSquare },
    { id: "customers", label: "Customers", icon: Users },
    { id: "hero", label: "Hero Slides", icon: Edit },
    { id: "collections", label: "Collections", icon: Package },
    { id: "blog", label: "Blog Posts", icon: Edit },
    { id: "settings", label: "Settings", icon: Settings },
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-black text-white p-2 rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-black text-white p-6 transform transition-transform duration-300 z-40 overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 mb-10">
          <Image src={Logo} alt="Farhama Logo" width={40} height={40} />
          <div>
            <h2 className="font-bold text-xl">FARHAMA</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2 mb-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id ? "bg-brandGold text-black" : "hover:bg-white/10"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 absolute bottom-6 left-6 right-6"
        >
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </button>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <header className="mb-6 sm:mb-8 mt-16 lg:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 text-sm sm:text-base">Here's what's happening with your store today.</p>
        </header>

        {/* Overview */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="text-white" size={20} />
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
                  </div>
                );
              })}
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg gap-2">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{order.id}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-semibold text-sm sm:text-base">{order.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded inline-block ${
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

        {/* Products */}
        {activeTab === "products" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-bold">Product Management</h2>
              <button className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-brandGold transition text-sm">
                <Plus size={18} />
                Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">ID</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Name</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Category</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Price</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{product.id}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{product.name}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{product.category}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">£{product.price}</td>
                      <td className="py-3 px-2 sm:px-4">
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

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-6">Order Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Order ID</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Customer</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Date</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Items</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Amount</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Status</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">{order.id}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{order.customer}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{order.date}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{order.items}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">{order.amount}</td>
                      <td className="py-3 px-2 sm:px-4">
                        <select className={`text-xs px-2 py-1 rounded border ${
                          order.status === "Completed" ? "bg-green-100 text-green-700 border-green-300" :
                          order.status === "Processing" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                          order.status === "Shipped" ? "bg-blue-100 text-blue-700 border-blue-300" :
                          "bg-gray-100 text-gray-700 border-gray-300"
                        }`}>
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <button className="p-2 hover:bg-blue-50 rounded">
                          <Eye size={16} className="text-blue-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-6">Customer Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">ID</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Name</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Email</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Phone</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Orders</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Total Spent</th>
                    <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{customer.id}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">{customer.name}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{customer.email}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{customer.phone}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{customer.orders}</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">{customer.totalSpent}</td>
                      <td className="py-3 px-2 sm:px-4">
                        <button className="p-2 hover:bg-blue-50 rounded">
                          <Eye size={16} className="text-blue-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hero Slides */}
        {activeTab === "hero" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-bold">Hero Slides Management</h2>
              <button className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-brandGold transition text-sm">
                <Plus size={18} />
                Add Slide
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {heroSlides.map((slide) => (
                <div key={slide.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-base sm:text-lg mb-2">{slide.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{slide.subtitle}</p>
                      <p className="text-xs text-gray-500">{slide.description}</p>
                      <div className="mt-3 flex gap-2 text-xs flex-wrap">
                        <span className="bg-gray-100 px-2 py-1 rounded">CTA1: {slide.cta1}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">CTA2: {slide.cta2}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(slide, "hero")}
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm whitespace-nowrap"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collections */}
        {activeTab === "collections" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-bold">Collections Management</h2>
              <button className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-brandGold transition text-sm">
                <Plus size={18} />
                Add Collection
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((collection) => (
                <div key={collection.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-base mb-2">{collection.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{collection.description}</p>
                  <button
                    onClick={() => handleEdit(collection, "collection")}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts */}
        {activeTab === "blog" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-bold">Blog Posts Management</h2>
              <button className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-brandGold transition text-sm">
                <Plus size={18} />
                Add Post
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-base sm:text-lg mb-2">{post.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-2 text-xs">
                        <span className="bg-gray-100 px-2 py-1 rounded">{post.category}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">By {post.author}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">{post.date}</span>
                      </div>
                      <p className="text-xs text-gray-600">{post.description}</p>
                    </div>
                    <button
                      onClick={() => handleEdit(post, "blog")}
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm whitespace-nowrap"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-6">Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Store Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Store Name</label>
                    <input type="text" defaultValue="FARHAMA - Scents & Abayaa" className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Email</label>
                    <input type="email" defaultValue="hello@farhama.co.uk" className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Phone</label>
                    <input type="tel" defaultValue="+44 1902 123456" className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Currency Settings</h3>
                <select className="w-full border border-gray-300 px-3 py-2 rounded text-sm">
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Email notifications for new orders
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Low stock alerts
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Marketing updates
                  </label>
                </div>
              </div>
              <button className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded-lg hover:bg-brandGold transition text-sm">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center z-10">
              <h3 className="text-lg sm:text-xl font-bold">
                Edit {editingItem.type === "hero" ? "Hero Slide" : editingItem.type === "collection" ? "Collection" : "Blog Post"}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {editingItem.type === "hero" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input type="text" value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <input type="text" value={editingItem.subtitle} onChange={(e) => setEditingItem({...editingItem, subtitle: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea value={editingItem.description} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" rows={3} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">CTA Button 1</label>
                      <input type="text" value={editingItem.cta1} onChange={(e) => setEditingItem({...editingItem, cta1: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CTA Button 2</label>
                      <input type="text" value={editingItem.cta2} onChange={(e) => setEditingItem({...editingItem, cta2: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                    </div>
                  </div>
                </>
              )}
              {editingItem.type === "collection" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input type="text" value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input type="text" value={editingItem.description} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                  </div>
                </>
              )}
              {editingItem.type === "blog" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input type="text" value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <input type="text" value={editingItem.category} onChange={(e) => setEditingItem({...editingItem, category: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Author</label>
                      <input type="text" value={editingItem.author} onChange={(e) => setEditingItem({...editingItem, author: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea value={editingItem.description} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded text-sm" rows={3} />
                  </div>
                </>
              )}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button onClick={handleSave} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-brandGold transition text-sm">
                  <Save size={16} />
                  Save Changes
                </button>
                <button onClick={() => setShowEditModal(false)} className="flex-1 sm:flex-initial border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   Home,
//   Package,
//   Users,
//   MessageSquare,
//   Settings,
//   LogOut,
//   Plus,
//   Edit,
//   Trash2,
//   Upload,
// } from "lucide-react";
// import Logo from "@/public/logo.png";

// interface User {
//   name: string;
//   email: string;
//   role: string;
// }

// interface Product {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   oldPrice?: number;
//   discount?: string;
// }

// export default function AdminDashboard() {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [products, setProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     // Check if user is logged in and is admin
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const userData = JSON.parse(storedUser);
//       if (userData.role !== "admin") {
//         router.push("/");
//       } else {
//         setUser(userData);
//       }
//     } else {
//       router.push("/");
//     }

//     // Load mock products
//     setProducts([
//       { id: 1, name: "Luxury Oud Perfume", category: "Perfume", price: 126, oldPrice: 140, discount: "-10%" },
//       { id: 2, name: "Elegant Black Abaya", category: "Abayas", price: 89 },
//       { id: 3, name: "Designer Handbag", category: "Accessories", price: 145 },
//       { id: 4, name: "Premium Leather Belt", category: "Accessories", price: 45 },
//     ]);
//   }, [router]);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     router.push("/");
//   };

//   const stats = [
//     { label: "Total Products", value: "248", icon: Package, color: "bg-blue-500" },
//     { label: "Total Orders", value: "1,429", icon: MessageSquare, color: "bg-green-500" },
//     { label: "Active Users", value: "3,842", icon: Users, color: "bg-purple-500" },
//     { label: "Revenue (Month)", value: "£28,450", icon: Home, color: "bg-yellow-500" },
//   ];

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="fixed left-0 top-0 h-full w-64 bg-black text-white p-6">
//         {/* Logo */}
//         <div className="flex items-center gap-3 mb-10">
//           <Image src={Logo} alt="Farhama Logo" width={40} height={40} />
//           <div>
//             <h2 className="font-bold text-xl">FARHAMA</h2>
//             <p className="text-xs text-gray-400">Admin Panel</p>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="space-y-2">
//           {[
//             { id: "overview", label: "Overview", icon: Home },
//             { id: "products", label: "Products", icon: Package },
//             { id: "orders", label: "Orders", icon: MessageSquare },
//             { id: "customers", label: "Customers", icon: Users },
//             { id: "settings", label: "Settings", icon: Settings },
//           ].map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
//                   activeTab === item.id
//                     ? "bg-brandGold text-black"
//                     : "hover:bg-white/10"
//                 }`}
//               >
//                 <Icon size={20} />
//                 <span>{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 mt-auto absolute bottom-6 left-6 right-6"
//         >
//           <LogOut size={20} />
//           <span>Logout</span>
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="ml-64 p-8">
//         {/* Header */}
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">
//             Welcome back, {user.name}!
//           </h1>
//           <p className="text-gray-600">
//             Here's what's happening with your store today.
//           </p>
//         </header>

//         {/* Stats Grid */}
//         {activeTab === "overview" && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               {stats.map((stat) => {
//                 const Icon = stat.icon;
//                 return (
//                   <div
//                     key={stat.label}
//                     className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
//                   >
//                     <div className="flex items-center justify-between mb-4">
//                       <div className={`${stat.color} p-3 rounded-lg`}>
//                         <Icon className="text-white" size={24} />
//                       </div>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
//                     <p className="text-gray-600 text-sm">{stat.label}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
//               <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
//               <div className="space-y-3">
//                 {[
//                   { order: "#12345", customer: "Sarah Williams", amount: "£145", status: "Completed" },
//                   { order: "#12346", customer: "Aisha Rahman", amount: "£89", status: "Processing" },
//                   { order: "#12347", customer: "Fatima Hassan", amount: "£234", status: "Shipped" },
//                 ].map((order) => (
//                   <div
//                     key={order.order}
//                     className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
//                   >
//                     <div>
//                       <p className="font-semibold">{order.order}</p>
//                       <p className="text-sm text-gray-600">{order.customer}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold">{order.amount}</p>
//                       <span className={`text-xs px-2 py-1 rounded ${
//                         order.status === "Completed" ? "bg-green-100 text-green-700" :
//                         order.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
//                         "bg-blue-100 text-blue-700"
//                       }`}>
//                         {order.status}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}

//         {/* Products Management */}
//         {activeTab === "products" && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold">Product Management</h2>
//               <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-brandGold transition">
//                 <Plus size={18} />
//                 Add Product
//               </button>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="border-b">
//                   <tr>
//                     <th className="text-left py-3 px-4">ID</th>
//                     <th className="text-left py-3 px-4">Name</th>
//                     <th className="text-left py-3 px-4">Category</th>
//                     <th className="text-left py-3 px-4">Price</th>
//                     <th className="text-left py-3 px-4">Discount</th>
//                     <th className="text-left py-3 px-4">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map((product) => (
//                     <tr key={product.id} className="border-b hover:bg-gray-50">
//                       <td className="py-3 px-4">{product.id}</td>
//                       <td className="py-3 px-4">{product.name}</td>
//                       <td className="py-3 px-4">{product.category}</td>
//                       <td className="py-3 px-4">
//                         £{product.price}
//                         {product.oldPrice && (
//                           <span className="text-gray-400 line-through ml-2 text-sm">
//                             £{product.oldPrice}
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-3 px-4">
//                         {product.discount && (
//                           <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
//                             {product.discount}
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex gap-2">
//                           <button className="p-2 hover:bg-blue-50 rounded">
//                             <Edit size={16} className="text-blue-600" />
//                           </button>
//                           <button className="p-2 hover:bg-red-50 rounded">
//                             <Trash2 size={16} className="text-red-600" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Other tabs placeholder */}
//         {["orders", "customers", "settings"].includes(activeTab) && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
//             <h2 className="text-xl font-bold mb-4">
//               {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
//             </h2>
//             <p className="text-gray-600">
//               This section is under development. You can add your {activeTab} management features here.
//             </p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }