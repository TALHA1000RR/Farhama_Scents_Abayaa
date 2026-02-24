'use client';
import { useState, useEffect } from 'react';
import { collectionService } from '../api/services/api.service';
import { Collection } from '../types';



export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    setError(null);
    collectionService
      .getAll()
      .then((r) => setCollections(r.data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load collections'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return { collections, isLoading, error, refetch: load };
}