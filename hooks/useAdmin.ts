'use client';
import { useCallback, useEffect, useState } from 'react';
import { userService, testimonialService } from '../api/services/api.service';
import { fetchDashboard, fetchRevenueAnalytics, fetchHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide } from '../lib/features/admin/adminSlice';
import { useAppDispatch, useAppSelector } from '../lib/store';
import { HeroSlide, User, Testimonial } from '../types';


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


export function useRevenueAnalytics(year?: number) {
  const dispatch = useAppDispatch();
  const { revenueData, isLoading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchRevenueAnalytics(year));
  }, [year, dispatch]);

  return { data: revenueData, isLoading };
}


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