'use client';
import { useState, useEffect, useCallback } from 'react';
import { pricingService } from '../api/services/api.service';
import { MembershipPlan } from '../types';



export function usePricing() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    setError(null);
    pricingService
      .getAll()
      .then((r) => setPlans(r.data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load plans'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const subscribe = useCallback(async (planId: string) => {
    setSubscribing(planId);
    setError(null);
    try {
      const res = await pricingService.subscribe(planId);
      const url = res.data.data?.url;
      if (url && url !== '#') {
        window.location.href = url;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(null);
    }
  }, []);

  return { plans, isLoading, subscribing, error, subscribe, refetch: load };
}