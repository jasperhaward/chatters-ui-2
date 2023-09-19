import { useState } from "preact/hooks";

export type ExecuteFunctionResult<Data> =
  | { data: null; error: Error }
  | { data: Data; error: null };

export type ExecuteFunction<Data, Args extends unknown[]> = (
  ...args: Args
) => Promise<ExecuteFunctionResult<Data>>;

export interface UseMutation<Data, Args extends unknown[]> {
  isLoading: boolean;
  error: Error | null;
  execute: ExecuteFunction<Data, Args>;
}

export function useMutation<Data, Args extends unknown[]>(
  func: (...args: Args) => Promise<Data>
): UseMutation<Data, Args> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute: ExecuteFunction<Data, Args> = async (...args) => {
    try {
      setIsLoading(true);

      const data = await func(...args);

      return { data, error: null };
    } catch (caughtError) {
      const error =
        caughtError instanceof Error
          ? caughtError
          : new Error("Invalid error instance", { cause: caughtError });

      setError(error);

      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, execute };
}
