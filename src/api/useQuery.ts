import { useEffect, useState } from "preact/hooks";

export interface UseQueryLoadingState<Data> {
  isLoading: true;
  error: null;
  data: null;
  retry: () => void;
  setData: (data: Data) => void;
}

export interface UseQuerySuccessfulState<Data> {
  isLoading: false;
  error: null;
  data: Data;
  retry: () => void;
  setData: (data: Data) => void;
}

export interface UseQueryErrorState<Data> {
  isLoading: false;
  error: Error;
  data: null;
  retry: () => void;
  setData: (data: Data) => void;
}

export type UseQuery<Data> =
  | UseQueryLoadingState<Data>
  | UseQuerySuccessfulState<Data>
  | UseQueryErrorState<Data>;

export interface UseQueryOptions {
  enabled?: boolean;
}

const defaultOptions: UseQueryOptions = {
  enabled: true,
};

export function useQuery<Data>(
  func: () => Promise<Data>,
  dependencies: unknown[],
  options: UseQueryOptions = defaultOptions
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
          : new Error("Invalid error instance", { cause: caughtError });

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
