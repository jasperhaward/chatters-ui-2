import { UserWithCreatedAt } from ".";

export interface Session {
  user: UserWithCreatedAt;
  token: string;
}
