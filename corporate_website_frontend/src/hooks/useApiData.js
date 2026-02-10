import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimal data-fetching hook.
 * - Prevents state updates after unmount
 * - Supports manual refresh
 */
// PUBLIC_INTERFACE
export const useApiData = (fetcher, { immediate = true } = {}) => {
  const mountedRef = useRef(true);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(immediate));
  const [error, setError] = useState(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (!mountedRef.current) return;
      setData(result);
      return result;
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err);
      return null;
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (!immediate) return;
    run();
  }, [immediate, run]);

  return { data, loading, error, refresh: run };
};
