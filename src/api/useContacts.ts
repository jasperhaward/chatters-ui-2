import { User } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useQuery } from "./useQuery";

export function useContacts() {
  const fetch = useAuthorizedFetch();
  const url = "/api/v1/contacts";

  return useQuery(() => fetch<User[]>(url), []);
}
