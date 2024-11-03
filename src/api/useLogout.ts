import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useMutation } from "./useMutation";

export function useLogout() {
  const fetch = useAuthorizedFetch();
  const url = "/api/v1/auth/logout";

  return useMutation(() => fetch<never>(url, { method: "POST" }));
}
