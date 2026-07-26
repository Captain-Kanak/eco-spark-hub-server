export interface CreateIdea {
  title: string;
  coverImage?: string;
  description: string;
  problemStatement: string;
  proposedSolution: string;
  expectedImpact: string;
  location: string;
  estimatedBudget: number;
  fundingGoal: number;
  categoryId: string;
}

export interface UpdateIdea {
  title?: string;
  description?: string;
  image?: string;
  isPaid?: boolean;
  price?: number;
  categoryId?: string;
}
