export type UserRole = "MANAGEMENT" | "ACCOUNTS" | "TEACHER";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserFormData {
  username: string;
  password: string;
  role: UserRole;
}

