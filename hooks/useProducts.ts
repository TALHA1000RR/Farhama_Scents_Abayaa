'use client';
import { useEffect } from 'react';
import { fetchProducts, fetchFeaturedProducts, fetchProductById, clearCurrentProduct } from '../lib/features/product/productSlice';
import { useAppDispatch, useAppSelector } from '../lib/store';



export function useProducts(autoFetch = true) {
  const dispatch = useAppDispatch();
  const { items, featured, current, isLoading, error, meta } = useAppSelector(
    (s) => s.products,
  );

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchProducts({ page: 1, limit: 8 }));
      dispatch(fetchFeaturedProducts());
    }
  }, [autoFetch, dispatch]);

  const fetchPage = (
    page: number,
    extra?: Record<string, string | number | boolean>,
  ) => dispatch(fetchProducts({ page, limit: 8, ...extra }));

  const fetchByCategory = (category: string) =>
    dispatch(fetchProducts({ category, page: 1, limit: 8 }));

  const fetchById = (id: string) => dispatch(fetchProductById(id));

  const clearCurrent = () => dispatch(clearCurrentProduct());

  return {
    items,
    featured,
    current,
    isLoading,
    error,
    meta,
    fetchPage,
    fetchByCategory,
    fetchById,
    clearCurrent,
  };
}