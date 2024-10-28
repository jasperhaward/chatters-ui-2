import { RecipientRemovedEvent } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useMutation } from "./useMutation";

export interface RemoveRecipientParams {
  conversationId: string;
  recipientId: string;
}

export function useRemoveRecipient() {
  const fetch = useAuthorizedFetch();

  return useMutation((params: RemoveRecipientParams) => {
    const { conversationId, recipientId } = params;

    return fetch<RecipientRemovedEvent>(
      `/api/v1/conversations/${conversationId}/recipients/${recipientId}`,
      { method: "DELETE" }
    );
  });
}
