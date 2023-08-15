import { useState } from "preact/hooks";

export type MutateFunctionResult<Data> =
  | { data: null; error: Error }
  | { data: Data; error: null };

export type MutateFunction<Data, Args extends unknown[]> = (
  ...args: Args
) => Promise<MutateFunctionResult<Data>>;

export interface UseMutation<Data, Args extends unknown[]> {
  isLoading: boolean;
  data: Data | null;
  error: Error | null;
  mutate: MutateFunction<Data, Args>;
}

export function useMutation<Data, Args extends unknown[]>(
  func: (...args: Args) => Promise<Data>
): UseMutation<Data, Args> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Data | null>(null);

  const mutate: MutateFunction<Data, Args> = async (...args) => {
    try {
      setIsLoading(true);

      const data = await func(...args);

      setData(data);

      return { data, error: null };
    } catch (caughtError) {
      const error =
        caughtError instanceof Error
          ? caughtError
          : new Error(`Invalid error instance: ${caughtError}`);

      setError(error);

      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, mutate };
}
