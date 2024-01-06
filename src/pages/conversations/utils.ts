import { Conversation, User } from "@/types";

export function buildConversationTitle(conversation: Conversation) {
  return (
    conversation.title ??
    conversation.recipients.map((recipient) => recipient.username).join(", ")
  );
}

export function sortConversationsByLatestMessageOrCreatedAt(
  a: Conversation,
  b: Conversation
) {
  const aTimestamp = new Date(a.latestMessage?.createdAt || a.createdAt);
  const bTimestamp = new Date(b.latestMessage?.createdAt || b.createdAt);

  if (aTimestamp.getTime() === bTimestamp.getTime()) {
    return 0;
  }

  return aTimestamp < bTimestamp ? 1 : -1;
}

export function sortUsersByUsername(a: User, b: User) {
  if (a.username === b.username) {
    return 0;
  }

  return a.username < b.username ? -1 : 1;
}
