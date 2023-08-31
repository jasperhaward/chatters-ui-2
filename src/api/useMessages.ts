import { Message, Conversation } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useQuery } from "./useQuery";

export function useMessages(selectedConversation: Conversation | undefined) {
  const fetch = useAuthorizedFetch();

  return useQuery(
    () => {
      return fetch<Message[]>(
        `/api/v1/conversations/${selectedConversation!.id}/messages`,
        { method: "GET" }
      );
    },
    [selectedConversation],
    { enabled: selectedConversation !== undefined }
  );
}
