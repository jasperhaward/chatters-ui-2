import { Message } from "@/types";
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

    return fetch<Message>(`/api/v1/conversations/${conversationId}/messages`, {
      method: "POST",
      body: { content },
    });
  });
}
