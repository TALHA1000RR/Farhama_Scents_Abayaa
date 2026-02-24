'use client';
import { useState, useEffect } from 'react';
import { blogService } from '../api/services/api.service';
import { BlogPost } from '../types';



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