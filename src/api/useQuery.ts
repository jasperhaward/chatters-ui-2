import { useEffect, useState } from "preact/hooks";

export interface UseQueryOptions {
  enabled?: boolean;
}

export type UseQuery<Data> =
  | {
      isLoading: true;
      error: null;
      data: null;
      retry: () => void;
      setData: (data: Data) => void;
    }
  | {
      isLoading: false;
      error: null;
      data: Data;
      retry: () => void;
      setData: (data: Data) => void;
    }
  | {
      isLoading: false;
      error: Error;
      data: null;
      retry: () => void;
      setData: (data: Data) => void;
    };

export function useQuery<Data>(
  func: () => Promise<Data>,
  dependencies: unknown[],
  options: UseQueryOptions = {
    enabled: true,
  }
): UseQuery<Data> {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    if (options.enabled) {
      query();
    }
  }, dependencies);

  async function query() {
    try {
      const data = await func();

      setData(data);
    } catch (caughtError) {
      const error =
        caughtError instanceof Error
          ? caughtError
          : new Error(`Invalid error instance: ${caughtError}`);

      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function retry() {
    setError(null);
    setIsLoading(true);
    await query();
  }

  return {
    isLoading,
    error,
    data,
    retry,
    setData,
  } as UseQuery<Data>;
}
