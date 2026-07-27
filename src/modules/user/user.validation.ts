import * as z from "zod";

const nameSchema = z
  .string("Name is required")
  .min(2, "Name must be at least 2 characters long")
  .max(100, "Name can't be more than 100 characters long");

const phoneSchema = z
  .string()
  .min(7, "Phone number must be at least 7 characters long")
  .max(15, "Phone number can't be more than 15 characters long");

const addressSchema = z
  .string()
  .min(3, "Address must be at least 3 characters long")
  .max(300, "Address can't be more than 100 characters long");

const dateOfBirthSchema = z.string();

const updateProfileSchema = z
  .object({
    name: nameSchema,
    phone: phoneSchema,
    address: addressSchema,
    dateOfBirth: dateOfBirthSchema,
  })
  .partial();

export const userValidation = {
  updateProfileSchema,
};
