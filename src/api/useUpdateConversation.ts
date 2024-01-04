import { ConversationWithoutRecipientsLatestMessage } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useMutation } from "./useMutation";

export interface UpdateConversationParams {
  conversationId: string;
  title: string | null;
}

export function useUpdateConversation() {
  const fetch = useAuthorizedFetch();

  return useMutation((params: UpdateConversationParams) => {
    const { conversationId, title } = params;

    return fetch<ConversationWithoutRecipientsLatestMessage>(
      `/api/v1/conversations/${conversationId}`,
      { method: "PATCH", body: { title } }
    );
  });
}
