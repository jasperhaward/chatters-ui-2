import { Conversation } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useQuery } from "./useQuery";

export function useConversations() {
  const fetch = useAuthorizedFetch();

  return useQuery(() => {
    return fetch<Conversation[]>("/api/v1/conversations", {
      method: "GET",
    });
  }, []);
}
