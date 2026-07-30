export interface CreateComment {
  ideaId: string;
  content: string;
  parentId?: string;
}

export interface UpdateComment {
  content?: string;
}
