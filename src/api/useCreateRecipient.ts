import { RecipientCreatedEvent } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useMutation } from "./useMutation";

export interface CreateRecipientParams {
  conversationId: string;
  recipientId: string;
}

export function useCreateRecipient() {
  const fetch = useAuthorizedFetch();

  return useMutation((params: CreateRecipientParams) => {
    const { conversationId, recipientId } = params;

    return fetch<RecipientCreatedEvent>(
      `/api/v1/conversations/${conversationId}/recipients`,
      { method: "POST", body: { recipientId } }
    );
  });
}
