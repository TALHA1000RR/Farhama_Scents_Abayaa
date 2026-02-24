'use client';
import { useState, useEffect } from 'react';
import { Testimonial } from '../types';
import { testimonialService } from '../api/services/api.service';


/**
 * useTestimonials — fetch publicly-approved testimonials.
 *
 * Returns:
 *  - testimonials  Array of approved testimonials (sorted by backend)
 *  - isLoading     True while fetching
 *  - error         Error message (or null)
 *  - refetch()     Manually re-fetch testimonials
 */
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