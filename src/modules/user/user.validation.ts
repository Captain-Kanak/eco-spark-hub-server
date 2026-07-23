import * as z from "zod";

const updateProfileZodSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name must be at least 1 characters long")
      .max(100, "Name can't be more than 100 characters long"),
    image: z.url("Image must be a valid URL"),
    phone: z
      .string()
      .min(11, "Phone number must be at least 11 characters long")
      .max(20, "Phone number can't be more than 20 characters long"),
    address: z
      .string()
      .min(3, "Address must be at least 3 characters long")
      .max(300, "Address can't be more than 100 characters long"),
    date_of_birth: z.string(),
  })
  .partial();

export const userValidation = {
  updateProfileZodSchema,
};
