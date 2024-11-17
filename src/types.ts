export interface User {
  id: string;
  username: string;
}

export interface UserWithCreatedAt extends User {
  createdAt: string;
}

export interface Recipient extends UserWithCreatedAt {
  createdBy: User;
}

export interface Conversation {
  conversationId: string;
  createdAt: string;
  createdBy: User;
  title: string | null;
  recipients: Recipient[];
  latestEvent: ConversationEvent;
}

export enum ConversationEventType {
  ConversationCreated = "ConversationCreated",
  TitleUpdated = "TitleUpdated",
  MessageCreated = "MessageCreated",
  RecipientCreated = "RecipientCreated",
  RecipientRemoved = "RecipientRemoved",
  AddedToConversation = "AddedToConversation",
}

export interface ConversationEventCommon {
  id: number;
  conversationId: string;
  type: ConversationEventType;
  createdAt: string;
  createdBy: User;
}

export interface ConversationCreatedEvent extends ConversationEventCommon {
  type: ConversationEventType.ConversationCreated;
}

export interface TitleUpdatedEvent extends ConversationEventCommon {
  type: ConversationEventType.TitleUpdated;
  title: string | null;
}

export interface MessageCreatedEvent extends ConversationEventCommon {
  type: ConversationEventType.MessageCreated;
  message: string;
}

export interface RecipientCreatedEvent extends ConversationEventCommon {
  type: ConversationEventType.RecipientCreated;
  recipient: User;
}

export interface RecipientRemovedEvent extends ConversationEventCommon {
  type: ConversationEventType.RecipientRemoved;
  recipient: User;
}
export type ConversationEvent =
  | ConversationCreatedEvent
  | TitleUpdatedEvent
  | MessageCreatedEvent
  | RecipientCreatedEvent
  | RecipientRemovedEvent;

export interface AddedToConversationEvent extends Conversation {
  type: ConversationEventType.AddedToConversation;
}

/**
 * A superset of `TConversationEvent` events that includes
 * programmatically created events for WebSocket consumption in the UI.
 */
export type WebSocketConversationEvent =
  | ConversationEvent
  | AddedToConversationEvent;
