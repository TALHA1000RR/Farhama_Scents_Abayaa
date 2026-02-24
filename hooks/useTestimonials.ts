'use client';
import { useState, useEffect } from 'react';
import { Testimonial } from '../types';
import { testimonialService } from '../api/services/api.service';


export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    setError(null);
    testimonialService
      .getApproved()
      .then((r) => setTestimonials(r.data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load testimonials'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return { testimonials, isLoading, error, refetch: load };
}