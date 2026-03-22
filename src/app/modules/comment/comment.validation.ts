import * as z from "zod";

const createCommentZodSchema = z.object({
  content: z.string(),
  ideaId: z.string(),
  parentId: z.string().optional(),
});

export const CommentValidations = {
  createCommentZodSchema,
};
