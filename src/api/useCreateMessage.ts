import { MessageCreatedEvent } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useMutation } from "./useMutation";

export interface CreateMessageParams {
  conversationId: string;
  content: string;
}

export function useCreateMessage() {
  const fetch = useAuthorizedFetch();

  return useMutation((params: CreateMessageParams) => {
    const { conversationId, content } = params;
    const url = `/api/v1/conversations/${conversationId}/messages`;

    return fetch<MessageCreatedEvent>(url, {
      method: "POST",
      body: { content },
    });
  });
}
