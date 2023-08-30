import { Conversation } from "@/types";

export function buildConversationTitle(conversation: Conversation) {
  return (
    conversation.title ??
    conversation.recipients.map((recipient) => recipient.username).join(", ")
  );
}
