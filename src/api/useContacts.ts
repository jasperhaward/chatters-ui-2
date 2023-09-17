import { User } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useQuery } from "./useQuery";

export function useContacts() {
  const fetch = useAuthorizedFetch();

  return useQuery(() => {
    return fetch<User[]>("/api/v1/contacts", {
      method: "GET",
    });
  }, []);
}
