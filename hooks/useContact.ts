'use client';
import { useState, useCallback } from 'react';
import { contactService } from '../api/services/api.service';
import { ContactInput } from '../types';


/**
 * useContact — contact form submission hook.
 *
 * Returns:
 *  - submit(data)  POST to /contact → returns true on success
 *  - isLoading     True while the request is in flight
 *  - isSuccess     True for 5 seconds after a successful submission
 *  - error         Error message string (or null)
 *  - reset()       Manually reset isSuccess / error back to defaults
 */
export function useContact() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (data: ContactInput): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await contactService.submit(data);
      setIsSuccess(true);
      // Auto-clear the success flag after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send message. Please try again.';
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
  }, []);

  return { submit, isLoading, isSuccess, error, reset };
}