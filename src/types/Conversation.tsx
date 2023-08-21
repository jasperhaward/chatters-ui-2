import { User, Message } from ".";

export interface Conversation {
  id: string;
  createdAt: string;
  createdBy: User;
  title: string | null;
  recipients: User[];
  latestMessage: Message | null;
}
