import { ConversationEventWithAggregates } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useQuery } from "./useQuery";

export function useEvents(conversationId: string | null) {
  const fetch = useAuthorizedFetch();
  const url = `/api/v1/conversations/${conversationId!}/events`;

  // prettier-ignore
  return useQuery(
    () => fetch<ConversationEventWithAggregates[]>(url), 
    [conversationId], {
    enabled: conversationId !== null,
  });
}
