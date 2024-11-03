import { useSession } from "@/features/auth";
import { UseFetch, useFetch, UnauthorizedApiResponseError } from "./useFetch";

export function useAuthorizedFetch(): UseFetch {
  const fetch = useFetch();
  const [session, setSession] = useSession();

  return async (path, init) => {
    try {
      return await fetch(path, {
        ...init,
        headers: {
          Authorization: `Bearer ${session.token}`,
          ...init?.headers,
        },
      });
    } catch (error) {
      if (error instanceof UnauthorizedApiResponseError) {
        // clear session to redirect to login page
        setSession(null);
      }

      throw error;
    }
  };
}
