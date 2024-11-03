import { Conversation } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useQuery } from "./useQuery";

export function useConversations() {
  const fetch = useAuthorizedFetch();
  const url = "/api/v1/conversations";

  return useQuery(() => fetch<Conversation[]>(url), []);
}
