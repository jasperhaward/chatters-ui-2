import { TitleUpdatedEvent } from "@/types";
import { useAuthorizedFetch } from "./useAuthorizedFetch";
import { useMutation } from "./useMutation";

export interface UpdateTitleParams {
  conversationId: string;
  title: string | null;
}

export function useUpdateTitle() {
  const fetch = useAuthorizedFetch();

  return useMutation((params: UpdateTitleParams) => {
    const { conversationId, title } = params;
    const url = `/api/v1/conversations/${conversationId}/title`;

    return fetch<TitleUpdatedEvent>(url, {
      method: "PATCH",
      body: { title },
    });
  });
}
