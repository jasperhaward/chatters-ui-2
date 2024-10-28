import { Conversation, User } from "@/types";

export function buildConversationTitle(
  conversation: Conversation,
  userId: string
) {
  return (
    conversation.title ??
    conversation.recipients
      .filter((recipient) => recipient.id !== userId)
      .map((recipient) => recipient.username)
      .join(", ")
  );
}

export function sortConversationsByLatestEvent(
  a: Conversation,
  b: Conversation
) {
  const aCreatedAt = new Date(a.latestEvent.createdAt);
  const bCreatedAt = new Date(b.latestEvent.createdAt);

  if (aCreatedAt.getTime() === bCreatedAt.getTime()) {
    return 0;
  }

  return aCreatedAt < bCreatedAt ? 1 : -1;
}

export function sortUsersByUsername(a: User, b: User) {
  if (a.username === b.username) {
    return 0;
  }

  return a.username < b.username ? -1 : 1;
}
