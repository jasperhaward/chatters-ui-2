import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useMutation } from "./useMutation";

export function useLogout() {
  const fetch = useAuthorizedFetch();

  return useMutation(() => {
    return fetch<never>("/api/v1/auth/logout", {
      method: "POST",
    });
  });
}
