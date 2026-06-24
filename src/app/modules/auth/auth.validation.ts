import * as z from "zod";

const registerUserZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(1, "Name must be at least 1 characters long")
    .max(100, "Name can't be more than 100 characters long"),
  email: z
    .email("Invalid email address")
    .max(255, "Email can't be more than 255 characters long"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password can't be more than 50 characters long"),
});

const verifyEmailZodSchema = z.object({
  email: z
    .email("Invalid email address")
    .max(255, "Email can't be more than 255 characters long"),
  otp: z
    .string("OTP is required")
    .min(6, "OTP must be at least 6 characters long")
    .max(6, "OTP can't be more than 6 characters long"),
});

const loginUserZodSchema = z.object({
  email: z
    .email("Invalid email address")
    .max(255, "Email can't be more than 255 characters long"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password can't be more than 50 characters long"),
});

export const AuthValidations = {
  registerUserZodSchema,
  verifyEmailZodSchema,
  loginUserZodSchema,
};
