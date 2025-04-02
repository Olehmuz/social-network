import { useState, useEffect, useCallback } from 'react';
import ky from '../lib/ky';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await ky.get(url).json<T>();
      setData(res || null);
    } catch {
      setError('An error occurred. Awkward..');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, setData, refetch: fetchData };
}

export default useFetch;
