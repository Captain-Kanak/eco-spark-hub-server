import * as z from "zod";

const createCategoryZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name can't be more than 100 characters long"),
  icon: z.url("Icon must be a valid URL").optional(),
});

export const CategoryValidations = {
  createCategoryZodSchema,
};
