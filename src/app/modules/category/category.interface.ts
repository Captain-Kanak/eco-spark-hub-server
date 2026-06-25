export interface CreateCategory {
  name: string;
  icon?: string;
  description?: string;
}

export interface UpdateCategory {
  name?: string;
  icon?: string;
  description?: string;
}
