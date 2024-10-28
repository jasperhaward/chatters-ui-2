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

    return fetch<TitleUpdatedEvent>(
      `/api/v1/conversations/${conversationId}/title`,
      { method: "PATCH", body: { title } }
    );
  });
}
