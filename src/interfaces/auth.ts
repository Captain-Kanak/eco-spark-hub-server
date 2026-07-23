import { UserRole } from "@prisma/client";

export interface JWTUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
