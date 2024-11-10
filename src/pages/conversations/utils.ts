import { Conversation, ConversationEvent, User } from "@/types";
import { differenceInMinutes } from "date-fns";

export function buildConversationTitle(
  conversation: Conversation,
  userId: string
) {
  if (conversation.title) {
    return conversation.title;
  }

  return conversation.recipients
    .filter((recipient) => recipient.id !== userId)
    .map((recipient) => recipient.username)
    .join(", ");
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

export function isWithinFiveMinutes(
  a: ConversationEvent,
  b: ConversationEvent
) {
  return (
    Math.abs(
      differenceInMinutes(new Date(a.createdAt), new Date(b.createdAt))
    ) <= 5
  );
}
