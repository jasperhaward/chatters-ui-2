import { Conversation, Message, UserWithCreatedAt } from ".";

export interface ConversationCreatedEvent {
  type: "conversation/created";
  payload: Conversation;
}

export interface MessageCreatedEvent {
  type: "message/created";
  payload: Message;
}

export interface RecipientAddedEvent {
  type: "recipient/added";
  payload: UserWithCreatedAt;
}

export interface RecipientRemovedEvent {
  type: "recipient/removed";
  payload: UserWithCreatedAt;
}

export interface ErrorEvent {
  error: {
    code: string;
    message: string;
  };
}

export type ClientEvent =
  | ConversationCreatedEvent
  | MessageCreatedEvent
  | RecipientAddedEvent
  | RecipientRemovedEvent;
