import { User } from ".";

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  createdAt: string;
  createdBy: User;
}
