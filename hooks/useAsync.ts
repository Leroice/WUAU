import { useEffect, useState } from 'react';

// Tiny loader: runs an async fn, tracks loading/error, ignores stale results.
// The single place data-fetching boilerplate lives, so resource hooks stay thin.
export function useAsync<T>(loader: () => Promise<T>, initial: T, deps: unknown[]) {
  const [data, setData] = useState<T>(initial);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    loader()
      .then((d) => { if (alive) setData(d); })
      .catch((e: any) => { if (alive) setError(e?.message ?? 'Something went wrong'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, isLoading, error };
}
