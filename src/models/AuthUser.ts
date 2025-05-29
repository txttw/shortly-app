import { User } from "./User";

export interface AuthUser {
  user: User | null;
  expiresAt?: string;
  token?: string;
  refresh?: string;
}
