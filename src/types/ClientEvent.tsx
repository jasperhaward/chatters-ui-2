import { Conversation, Message, User } from ".";

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
  payload: User;
}

export interface RecipientRemovedEvent {
  type: "recipient/removed";
  payload: User;
}

export type ClientEvent =
  | ConversationCreatedEvent
  | MessageCreatedEvent
  | RecipientAddedEvent
  | RecipientRemovedEvent;
