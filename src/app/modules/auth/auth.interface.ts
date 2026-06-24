import { UserRole, UserStatus } from "@prisma/client";

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmail {
  email: string;
  otp: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  createdAt: Date;
  updatedAt: Date;
}
