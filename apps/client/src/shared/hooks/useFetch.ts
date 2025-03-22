import { useState, useEffect } from 'react';
import ky from '../lib/ky';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      setLoading(true)
      setData([]);
      setError(null);

      ky.get(url)
      .json<T[]>().then((res) => {
        setLoading(false);

        res.length && setData(res);
      })
      .catch(() => {
          setLoading(false)
          setError('An error occurred. Awkward..')
      })
  }, [url])

  return { data, loading, error, setData }
}
export default useFetch;