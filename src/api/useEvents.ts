import { ConversationEvent } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useQuery } from "./useQuery";

export function useEvents(conversationId: string | null) {
  const fetch = useAuthorizedFetch();

  return useQuery(
    () =>
      fetch<ConversationEvent[]>(
        `/api/v1/conversations/${conversationId!}/events`,
        { method: "GET" }
      ),
    [conversationId],
    { enabled: conversationId !== null }
  );
}
