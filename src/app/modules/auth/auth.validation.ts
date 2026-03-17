import * as z from "zod";

const registerUserZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name can't be more than 50 characters long"),
  email: z
    .email("Invalid email address")
    .max(100, "Email can't be more than 100 characters long"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password can't be more than 50 characters long"),
});

const loginUserZodSchema = z.object({
  email: z
    .email("Invalid email address")
    .max(100, "Email can't be more than 100 characters long"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password can't be more than 50 characters long"),
});

export const AuthValidations = {
  registerUserZodSchema,
  loginUserZodSchema,
};
