import * as z from "zod";

const updateProfileZodSchema = z
  .object({
    name: z.string(),
    image: z.url("Image must be a valid URL"),
    phone: z.string(),
    address: z.string(),
    date_of_birth: z.string(),
  })
  .partial();

export const userValidation = {
  updateProfileZodSchema,
};
