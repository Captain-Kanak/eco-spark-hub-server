import { IdeaStatus } from "@prisma/client";
import * as z from "zod";

const titleSchema = z
  .string("Title is required")
  .trim()
  .min(3, "Title must be at least 3 characters long")
  .max(255, "Title can't be more than 255 characters long");

const textSchema = z
  .string("Description is required")
  .trim()
  .min(10, "Description must be at least 10 characters long")
  .max(5000, "Description can't be more than 5000 characters long");

const impactSchema = z.array(z.string());

const locationSchema = z
  .string("Location is required")
  .trim()
  .min(2, "Location must be at least 2 characters long")
  .max(300, "Location can't be more than 300 characters long");

const amountSchema = z
  .number("Amount is required")
  .min(0, "Amount cannot be negative");

const idSchema = z.uuid("Invalid or missing UUID");

const parcentageSchema = z.number().int().min(0).max(100);

const createIdeaSchema = z.object({
  title: titleSchema,
  description: textSchema,
  problemStatement: textSchema,
  proposedSolution: textSchema,
  expectedImpact: impactSchema,
  location: locationSchema,
  estimatedBudget: amountSchema,
  fundingGoal: amountSchema,
  categoryId: idSchema,
});

const updateIdeaSchema = createIdeaSchema.partial();

const updateIdeaStatusSchema = z.object({
  status: z.enum(IdeaStatus),
});

const createIdeaUpdateSchema = z.object({
  title: titleSchema,
  content: textSchema,
  progressPercentage: parcentageSchema,
});

const updateIdeaUpdateSchema = createIdeaUpdateSchema.partial();

export const IdeaValidation = {
  createIdeaSchema,
  updateIdeaSchema,
  updateIdeaStatusSchema,
  createIdeaUpdateSchema,
  updateIdeaUpdateSchema,
};
