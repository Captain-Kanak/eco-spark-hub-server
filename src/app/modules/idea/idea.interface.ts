export interface ICreateIdea {
  title: string;
  description: string;
  image?: string;
  isPaid?: boolean;
  price?: number;
  categoryId: string;
}

export interface IUpdateIdea {
  title?: string;
  description?: string;
  image?: string;
  isPaid?: boolean;
  price?: number;
  categoryId?: string;
}
