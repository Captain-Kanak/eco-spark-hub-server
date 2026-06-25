export interface CreateIdea {
  title: string;
  description: string;
  problemStatement: string;
  solution: string;
  image?: string;
  isPaid?: boolean;
  price?: number;
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
