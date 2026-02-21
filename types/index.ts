// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  isEmailVerified: boolean;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'user' | 'admin';
}

export interface LoginInput {
  email: string;
  password: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export type ProductCategory = 'Perfume' | 'Abayas' | 'Accessories' | 'MensWear' | 'ChildrenWear';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  discount?: string;
  stock: number;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Order ─────────────────────────────────────────────────────────────────
export interface OrderItem {
  product: string | Product;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  phone?: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled' | 'Refunded';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  createdAt: string;
}

export interface CreateOrderInput {
  items: { product: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  couponCode?: string;
}

// ─── Content Types ─────────────────────────────────────────────────────────
export interface Collection {
  _id: string;
  title: string;
  description: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface Testimonial {
  _id: string;
  name: string;
  location: string;
  message: string;
  rating: number;
  image?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  description: string;
  content: string;
  image?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface MembershipPlan {
  _id: string;
  title: string;
  price: number;
  features: string[];
  isFeatured: boolean;
  isActive: boolean;
  stripePriceId?: string;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  cta1: string;
  cta2: string;
  order: number;
  isActive: boolean;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  monthRevenue: number;
}

// ─── API Helpers ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}