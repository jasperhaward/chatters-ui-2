import { useEffect, useState } from "preact/hooks";

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

export function useQuery<Data>(func: () => Promise<Data>): UseQuery<Data> {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    query();
  }, []);

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

  return {
    isLoading,
    error,
    data,
    retry: query,
    setData,
  } as UseQuery<Data>;
}
