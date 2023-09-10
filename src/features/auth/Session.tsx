import { UserWithCreatedAt } from "@/types";

export interface Session {
  user: UserWithCreatedAt;
  token: string;
}
