import { useState, useCallback } from 'react';
import { ApiError } from '@/types';

export const useApi = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: Promise<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall;
      setData(result);
      return { data: result, error: null };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};