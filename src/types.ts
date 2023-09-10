export interface User {
  id: string;
  username: string;
}

export interface UserWithCreatedAt extends User {
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  createdAt: string;
  createdBy: User;
}

export interface Conversation {
  id: string;
  createdAt: string;
  createdBy: User;
  title: string | null;
  recipients: UserWithCreatedAt[];
  latestMessage: Message | null;
}

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
