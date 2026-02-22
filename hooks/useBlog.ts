'use client';
import { useState, useEffect } from 'react';
import { blogService } from '../api/services/api.service';
import { BlogPost } from '../types';
// import { blogService } from '@/store/services/api.services';
// import type { BlogPost } from '@/types';

/**
 * useBlog — fetch published blog posts with optional limit.
 *
 * @param limit   Number of posts to fetch (default: 3 for homepage preview)
 * @param page    Page number (default: 1)
 *
 * Returns:
 *  - posts      Array of published blog posts
 *  - isLoading  True while fetching
 *  - error      Error message (or null)
 *  - meta       Pagination metadata: { total, page, limit, totalPages }
 *  - refetch()  Manually re-load posts
 */
export function useBlog(limit = 3, page = 1) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const load = () => {
    setIsLoading(true);
    setError(null);
    blogService
      .getPublished({ page: String(page), limit: String(limit) })
      .then((r) => {
        setPosts(r.data.data || []);
        setMeta(r.data.meta ?? null);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load posts'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, [limit, page]);

  return { posts, isLoading, error, meta, refetch: load };
}