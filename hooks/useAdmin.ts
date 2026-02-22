'use client';
import { useCallback, useEffect, useState } from 'react';
import { userService, testimonialService } from '../api/services/api.service';
import { fetchDashboard, fetchRevenueAnalytics, fetchHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide } from '../lib/features/admin/adminSlice';
import { useAppDispatch, useAppSelector } from '../lib/store';
import { HeroSlide, User, Testimonial } from '../types';


/**
 * useAdminDashboard — loads stats, recent orders, low-stock, and order-by-status.
 *
 * Returns:
 *  - stats              { totalProducts, totalOrders, totalUsers, monthRevenue }
 *  - recentOrders       Latest 10 orders
 *  - lowStockProducts   Products with stock < 5
 *  - ordersByStatus     Array of { _id: OrderStatus, count }
 *  - isLoading          True while dashboard data is loading
 *  - error              Error string or null
 *  - refetch()          Force reload
 */
export function useAdminDashboard() {
  const dispatch = useAppDispatch();
  const { stats, recentOrders, lowStockProducts, ordersByStatus, isLoading, error } =
    useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return {
    stats,
    recentOrders,
    lowStockProducts,
    ordersByStatus,
    isLoading,
    error,
    refetch: () => dispatch(fetchDashboard()),
  };
}

/**
 * useRevenueAnalytics — monthly revenue and order count for a given year.
 *
 * @param year  Optional year (defaults to current year on the backend)
 *
 * Returns:
 *  - data       Array of { _id: { month }, revenue, orders }
 *  - isLoading  True while fetching
 */
export function useRevenueAnalytics(year?: number) {
  const dispatch = useAppDispatch();
  const { revenueData, isLoading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchRevenueAnalytics(year));
  }, [year, dispatch]);

  return { data: revenueData, isLoading };
}

/**
 * useHeroSlides — manage hero slider content (CRUD).
 *
 * Returns:
 *  - slides          Array of HeroSlide objects
 *  - isLoading       True while fetching
 *  - createSlide(data)   Create a new slide
 *  - updateSlide(id, data)  Update an existing slide
 *  - removeSlide(id)    Delete a slide
 *  - refetch()       Force reload
 */
export function useHeroSlides() {
  const dispatch = useAppDispatch();
  const { heroSlides, isLoading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchHeroSlides());
  }, [dispatch]);

  const createSlide = useCallback(
    async (data: Partial<HeroSlide>): Promise<boolean> => {
      const result = await dispatch(createHeroSlide(data));
      return createHeroSlide.fulfilled.match(result);
    },
    [dispatch],
  );

  const updateSlide = useCallback(
    async (id: string, data: Partial<HeroSlide>): Promise<boolean> => {
      const result = await dispatch(updateHeroSlide({ id, data }));
      return updateHeroSlide.fulfilled.match(result);
    },
    [dispatch],
  );

  const removeSlide = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await dispatch(deleteHeroSlide(id));
      return deleteHeroSlide.fulfilled.match(result);
    },
    [dispatch],
  );

  return {
    slides: heroSlides,
    isLoading,
    createSlide,
    updateSlide,
    removeSlide,
    refetch: () => dispatch(fetchHeroSlides()),
  };
}

/**
 * useAdminUsers — paginated user list for admin management panel.
 *
 * Returns:
 *  - users       Array of User objects
 *  - isLoading   True while fetching
 *  - meta        Pagination metadata
 *  - refetch(params?)  Reload users with optional filters
 */
export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const refetch = useCallback((params?: Record<string, string>) => {
    setIsLoading(true);
    userService
      .getAll(params)
      .then((r) => {
        setUsers(r.data.data);
        setMeta(r.data.meta ?? null);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { users, isLoading, meta, refetch };
}

/**
 * useAdminTestimonials — full testimonial management for admins.
 *
 * Returns:
 *  - testimonials  All testimonials (pending + approved)
 *  - isLoading     True while loading
 *  - approve(id, value)  Approve or unapprove a testimonial
 *  - remove(id)          Delete a testimonial
 *  - refetch()           Reload all testimonials
 */
export function useAdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(() => {
    setIsLoading(true);
    testimonialService
      .getAll()
      .then((r) => setTestimonials(r.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const approve = useCallback(
    async (id: string, value: boolean) => {
      await testimonialService.approve(id, value);
      refetch();
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await testimonialService.delete(id);
      refetch();
    },
    [refetch],
  );

  return { testimonials, isLoading, approve, remove, refetch };
}