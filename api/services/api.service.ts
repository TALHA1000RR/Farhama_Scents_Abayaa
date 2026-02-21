import apiClient from '../apiClient';
import type {
  AuthResponse, RegisterInput, LoginInput, User,
  Product, Order, CreateOrderInput,
  BlogPost, Collection, Testimonial, MembershipPlan,
  ContactInput, DashboardStats, HeroSlide,
  ApiResponse, PaginatedResponse,
} from '../../types';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  register: (data: RegisterInput) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: LoginInput) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),

  logout: () => apiClient.post<ApiResponse>('/auth/logout'),

  getMe: () => apiClient.get<ApiResponse<User>>('/auth/me'),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken }),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post<ApiResponse>('/auth/reset-password', { token, password }),
};

// ─── User ─────────────────────────────────────────────────────────────────────
export const userService = {
  getProfile: () => apiClient.get<ApiResponse<User>>('/users/profile'),

  updateProfile: (data: FormData) =>
    apiClient.patch<ApiResponse<User>>('/users/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<ApiResponse>('/users/change-password', { currentPassword, newPassword }),

  // Admin
  getAll: (params?: Record<string, string>) =>
    apiClient.get<PaginatedResponse<User>>('/users', { params }),

  getById: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/users/${id}`),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    apiClient.get<PaginatedResponse<Product>>('/products', { params }),

  getById: (id: string) => apiClient.get<ApiResponse<Product>>(`/products/${id}`),

  // Admin
  create: (data: FormData) =>
    apiClient.post<ApiResponse<Product>>('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: Partial<Product> | FormData) =>
    apiClient.patch<ApiResponse<Product>>(`/products/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/products/${id}`),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderService = {
  create: (data: CreateOrderInput) =>
    apiClient.post<ApiResponse<{ order: Order; clientSecret: string }>>('/orders', data),

  getMyOrders: (params?: Record<string, string>) =>
    apiClient.get<PaginatedResponse<Order>>('/orders/my-orders', { params }),

  getById: (id: string) => apiClient.get<ApiResponse<Order>>(`/orders/${id}`),

  cancel: (id: string) => apiClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`),

  // Admin
  getAll: (params?: Record<string, string>) =>
    apiClient.get<PaginatedResponse<Order>>('/orders', { params }),

  updateStatus: (id: string, status: Order['status']) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }),
};

// ─── Collections ─────────────────────────────────────────────────────────────
export const collectionService = {
  getAll: () => apiClient.get<ApiResponse<Collection[]>>('/collections'),

  create: (data: FormData) =>
    apiClient.post<ApiResponse<Collection>>('/collections', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: Partial<Collection>) =>
    apiClient.patch<ApiResponse<Collection>>(`/collections/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/collections/${id}`),
};

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonialService = {
  getApproved: () => apiClient.get<ApiResponse<Testimonial[]>>('/testimonials'),

  submit: (data: FormData) =>
    apiClient.post<ApiResponse<Testimonial>>('/testimonials', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAll: () => apiClient.get<ApiResponse<Testimonial[]>>('/testimonials/all'),

  approve: (id: string, isApproved: boolean) =>
    apiClient.patch<ApiResponse<Testimonial>>(`/testimonials/${id}/approve`, { isApproved }),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/testimonials/${id}`),
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactService = {
  submit: (data: ContactInput) => apiClient.post<ApiResponse>('/contact', data),

  getAll: (params?: Record<string, string>) =>
    apiClient.get<PaginatedResponse<any>>('/contact', { params }),

  markRead: (id: string) => apiClient.patch<ApiResponse>(`/contact/${id}/read`),
};

// ─── Blog ─────────────────────────────────────────────────────────────────────
export const blogService = {
  getPublished: (params?: Record<string, string>) =>
    apiClient.get<PaginatedResponse<BlogPost>>('/blog', { params }),

  getBySlug: (slug: string) => apiClient.get<ApiResponse<BlogPost>>(`/blog/${slug}`),

  getAll: (params?: Record<string, string>) =>
    apiClient.get<PaginatedResponse<BlogPost>>('/blog/all', { params }),

  create: (data: FormData) =>
    apiClient.post<ApiResponse<BlogPost>>('/blog', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: Partial<BlogPost>) =>
    apiClient.patch<ApiResponse<BlogPost>>(`/blog/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/blog/${id}`),
};

// ─── Pricing ──────────────────────────────────────────────────────────────────
export const pricingService = {
  getAll: () => apiClient.get<ApiResponse<MembershipPlan[]>>('/pricing'),

  subscribe: (id: string) =>
    apiClient.post<ApiResponse<{ url: string }>>(`/pricing/${id}/subscribe`),

  create: (data: Partial<MembershipPlan>) =>
    apiClient.post<ApiResponse<MembershipPlan>>('/pricing', data),

  update: (id: string, data: Partial<MembershipPlan>) =>
    apiClient.patch<ApiResponse<MembershipPlan>>(`/pricing/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/pricing/${id}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminService = {
  getDashboard: () =>
    apiClient.get<ApiResponse<{
      stats: DashboardStats;
      recentOrders: Order[];
      lowStockProducts: Product[];
      ordersByStatus: { _id: string; count: number }[];
    }>>('/admin/dashboard'),

  getRevenue: (year?: number) =>
    apiClient.get<ApiResponse<{ _id: { month: number }; revenue: number; orders: number }[]>>(
      '/admin/analytics/revenue', { params: { year } }
    ),

  getTopProducts: (limit = 10) =>
    apiClient.get<ApiResponse<{ _id: string; name: string; totalSold: number; revenue: number }[]>>(
      '/admin/analytics/top-products', { params: { limit } }
    ),

  getHeroSlides: () => apiClient.get<ApiResponse<HeroSlide[]>>('/admin/hero-slides'),

  createHeroSlide: (data: Partial<HeroSlide>) =>
    apiClient.post<ApiResponse<HeroSlide>>('/admin/hero-slides', data),

  updateHeroSlide: (id: string, data: Partial<HeroSlide>) =>
    apiClient.patch<ApiResponse<HeroSlide>>(`/admin/hero-slides/${id}`, data),

  deleteHeroSlide: (id: string) => apiClient.delete<ApiResponse>(`/admin/hero-slides/${id}`),
};