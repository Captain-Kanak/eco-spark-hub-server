import { User, UserRole } from "@prisma/client";

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

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  address: string | null;
  dateOfBirth: Date | null;
  role: UserRole;
  ecoPoints: number;
  createdAt: Date;
}

export const authResponse = (user: User): AuthResponse => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    phone: user.phone,
    address: user.address,
    dateOfBirth: user.dateOfBirth,
    role: user.role as UserRole,
    ecoPoints: user.ecoPoints,
    createdAt: user.createdAt,
  };
};
