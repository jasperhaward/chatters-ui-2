import { Conversation } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useQuery } from "./useQuery";

export function useConversations() {
  const fetch = useAuthorizedFetch();

  return useQuery(() =>
    fetch<Conversation[]>("/api/v1/conversations", {
      method: "GET",
    })
  );
}
