import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useMutation } from "./useMutation";

export interface DeleteRecipientParams {
  conversationId: string;
  recipientId: string;
}

export function useDeleteRecipient() {
  const fetch = useAuthorizedFetch();

  return useMutation((params: DeleteRecipientParams) => {
    const { conversationId, recipientId } = params;

    return fetch<never>(
      `/api/v1/conversations/${conversationId}/recipients/${recipientId}`,
      { method: "DELETE" }
    );
  });
}
