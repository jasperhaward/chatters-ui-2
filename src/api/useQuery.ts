import { useEffect, useState } from "preact/hooks";

export type UseQuery<Data> =
  | {
      isLoading: true;
      error: null;
      data: null;
      setData: (data: Data) => void;
    }
  | {
      isLoading: false;
      error: null;
      data: Data;
      setData: (data: Data) => void;
    }
  | {
      isLoading: false;
      error: Error;
      data: null;
      setData: (data: Data) => void;
    };

export function useQuery<Data>(func: () => Promise<Data>): UseQuery<Data> {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
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

    query();
  }, []);

  return {
    isLoading,
    error,
    data,
    setData,
  } as UseQuery<Data>;
}
