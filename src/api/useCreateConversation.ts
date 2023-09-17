import { Conversation } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useMutation } from "./useMutation";

export interface CreateConversationParams {
  title: string | undefined;
  recipientIds: string[];
}

export function useCreateConversation() {
  const fetch = useAuthorizedFetch();

  return useMutation((params: CreateConversationParams) => {
    return fetch<Conversation>("/api/v1/conversations", {
      method: "POST",
      body: params,
    });
  });
}
