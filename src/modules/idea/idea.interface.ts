import { Idea, IdeaStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

export interface CreateIdea {
  title: string;
  coverImage?: string;
  description: string;
  problemStatement: string;
  proposedSolution: string;
  expectedImpact: string;
  location: string;
  estimatedBudget: Decimal;
  fundingGoal: Decimal;
  categoryId: string;
}

export interface UpdateIdea {
  title?: string;
  coverImage?: string;
  description?: string;
  categoryId?: string;
}
