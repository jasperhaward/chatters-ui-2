import { Conversation } from "../../types";

export function buildConversationHeader(conversation: Conversation) {
  return (
    conversation.title ??
    conversation.recipients.map((recipient) => recipient.username).join(", ")
  );
}
