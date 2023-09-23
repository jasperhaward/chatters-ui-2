import { Message } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useQuery } from "./useQuery";

export function useMessages(conversationId: string | null) {
  const fetch = useAuthorizedFetch();

  return useQuery(
    () => {
      return fetch<Message[]>(
        `/api/v1/conversations/${conversationId!}/messages`,
        { method: "GET" }
      );
    },
    [conversationId],
    { enabled: conversationId !== null }
  );
}
