import { User, UserWithCreatedAt, Message } from ".";

export interface Conversation {
  id: string;
  createdAt: string;
  createdBy: User;
  title: string | null;
  recipients: UserWithCreatedAt[];
  latestMessage: Message | null;
}
