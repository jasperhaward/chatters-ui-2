import { ConversationEvent } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useMutation } from "./useMutation";

export interface CreateConversationParams {
  title: string | undefined;
  recipientIds: string[];
}

export function useCreateConversation() {
  const fetch = useAuthorizedFetch();
  const url = "/api/v1/conversations";

  return useMutation((params: CreateConversationParams) =>
    fetch<ConversationEvent[]>(url, {
      method: "POST",
      body: params,
    })
  );
}
