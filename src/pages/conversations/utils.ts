import { differenceInMinutes } from "date-fns";
import config from "@/config";
import { Conversation, ConversationEvent, User } from "@/types";
import { MultiselectOption } from "@/components";

export function titleValidation(value: string) {
  if (value.length <= config.maxConversationTitleLength) {
    return null;
  }

  const maximumLength = config.maxConversationTitleLength + 1;

  return `Must contain less than ${maximumLength} characters`;
}

export function toUserMultiselectOption(user: User): MultiselectOption {
  return {
    id: user.id,
    value: user.username,
    icon: ["fas", "user"],
  };
}

export function isConversationGroupConversation(conversation: Conversation) {
  return conversation.recipients.length > 2;
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
