import * as z from "zod";

const createIdeaZodSchema = z.object({
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title can't be more than 100 characters long"),
  description: z
    .string("Description is required")
    .min(3, "Description must be at least 3 characters long")
    .max(1000, "Description can't be more than 1000 characters long"),
  image: z.url("Image must be a valid URL").optional(),
  isPaid: z.boolean().optional(),
  price: z.number().optional(),
  categoryId: z.uuid("Category ID is invalid or missing"),
});

const updateIdeaZodSchema = z
  .object({
    title: z
      .string("Title is required")
      .min(3, "Title must be at least 3 characters long")
      .max(100, "Title can't be more than 100 characters long"),
    description: z
      .string("Description is required")
      .min(3, "Description must be at least 3 characters long")
      .max(1000, "Description can't be more than 1000 characters long"),
    image: z.url("Image must be a valid URL"),
    isPaid: z.boolean(),
    price: z.number(),
    categoryId: z.uuid("Category ID is invalid or missing"),
  })
  .partial();

export const IdeaValidations = {
  createIdeaZodSchema,
  updateIdeaZodSchema,
};
