export interface User {
  id: string;
  username: string;
}

export interface UserWithCreatedAt extends User {
  createdAt: string;
}
