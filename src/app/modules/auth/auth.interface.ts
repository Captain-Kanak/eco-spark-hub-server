import { User, UserRole, UserStatus } from "@prisma/client";

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
  role: UserRole;
  status: UserStatus;
  image: string | null;
  phone: string | null;
  address: string | null;
  date_of_birth: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const userResponse = (user: User): UserResponse => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    role: user.role as UserRole,
    status: user.status as UserStatus,
    image: user.image,
    phone: user.phone,
    address: user.address,
    date_of_birth: user.date_of_birth,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
