import * as z from "zod";

const createCommentZodSchema = z.object({
  content: z.string(),
  ideaId: z.string(),
  parentId: z.string().optional(),
});

const updateCommentZodSchema = z.object({
  content: z.string(),
});

export const CommentValidations = {
  createCommentZodSchema,
  updateCommentZodSchema,
};
