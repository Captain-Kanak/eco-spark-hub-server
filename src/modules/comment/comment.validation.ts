import * as z from "zod";

const idSchema = z.uuid("Invalid or missing UUID");

const contentSchema = z
  .string()
  .min(1, "Content must be at least 1 characters long")
  .max(3000, "Content can't be more than 3000 characters long");

const createCommentSchema = z.object({
  ideaId: idSchema,
  content: contentSchema,
  parentId: idSchema.optional(),
});

const updateCommentSchema = z.object({
  content: contentSchema,
});

export const commentValidation = {
  createCommentSchema,
  updateCommentSchema,
};
