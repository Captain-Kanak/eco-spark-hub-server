import * as z from "zod";

const nameSchema = z
  .string("Name is required")
  .min(3, "Name must be at least 3 characters long")
  .max(100, "Name can't be more than 100 characters long");

const emailSchema = z
  .email("Invalid email address")
  .max(255, "Email can't be more than 255 characters long");

const passwordSchema = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters long")
  .max(50, "Password can't be more than 50 characters long");

const otpSchema = z
  .string("OTP is required")
  .min(6, "OTP must be at least 6 characters long")
  .max(6, "OTP can't be more than 6 characters long");

const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const verifyEmailSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const AuthValidation = {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
};
