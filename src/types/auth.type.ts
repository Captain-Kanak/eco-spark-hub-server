import { UserRole } from "@prisma/client";

export interface DecodedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  isDeleted: boolean;
}
