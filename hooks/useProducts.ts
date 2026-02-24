'use client';
import { useEffect } from 'react';
import { fetchProducts, fetchFeaturedProducts, fetchProductById, clearCurrentProduct } from '../lib/features/product/productSlice';
import { useAppDispatch, useAppSelector } from '../lib/store';


/**
 * useProducts — product catalogue hook backed by Redux.
 *
 * @param autoFetch  When true (default), immediately fetches the first page
 *                   of products AND featured products on mount.
 *
 * Returns:
 *  - items        Current page of products
 *  - featured     Featured products (up to 8)
 *  - current      Single product loaded by fetchById
 *  - isLoading    True while any fetch is in flight
 *  - error        Last error message (or null)
 *  - meta         Pagination metadata: { total, page, limit, totalPages }
 *  - fetchPage(page, extraParams?)    Load a specific page
 *  - fetchByCategory(category)        Filter by category (page 1)
 *  - fetchById(id)                    Load a single product
 *  - clearCurrent()                   Reset the `current` product
 */
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