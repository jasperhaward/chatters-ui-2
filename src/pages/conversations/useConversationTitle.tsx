import { useSession } from "@/features/auth";
import { Conversation } from "@/types";

export function useConversationTitle(conversation: Conversation | undefined) {
  const [session] = useSession();

  if (!conversation) {
    return null;
  }

  if (conversation.title) {
    return conversation.title;
  }

  return conversation.recipients
    .filter((recipient) => recipient.id !== session.user.id)
    .map((recipient) => recipient.username)
    .join(", ");
}
