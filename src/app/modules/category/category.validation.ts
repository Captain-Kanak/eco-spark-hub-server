import * as z from "zod";

const createCategoryZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name can't be more than 100 characters long"),
  icon: z.url("Icon must be a valid URL").optional(),
  description: z
    .string()
    .max(1000, "Description can't be more than 1000 characters long")
    .optional(),
});


const updateCategoryZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name can't be more than 100 characters long"),
  icon: z.url("Icon must be a valid URL"),
  description: z
    .string()
    .max(1000, "Description can't be more than 1000 characters long")
}).partial();



export const CategoryValidations = {
  createCategoryZodSchema,
  updateCategoryZodSchema
};
