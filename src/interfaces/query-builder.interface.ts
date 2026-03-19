export interface PrismaFindManyArgs {
  skip?: number;
  take?: number;
  where?: PrismaWhereConditions;
  orderBy?: Record<string, "asc" | "desc" | unknown>;
  select?: Record<string, boolean | unknown>;
  include?: Record<string, boolean | unknown>;
  [key: string]: unknown;
}

export interface PrismaCountArgs {
  where?: PrismaWhereConditions;
  [key: string]: unknown;
}

export interface PrismaWhereConditions {
  OR?: Record<string, unknown>[];
  AND?: Record<string, unknown>[];
  NOT?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface PrismaModelDelegate {
  findMany(args?: any): Promise<any[]>;
  count(args?: any): Promise<number>;
}

export interface IQueryParams {
  page?: string;
  limit?: string;
}

export interface IQueryConfig {
  searchableFields?: string[];
  filterableFields?: string[];
}

export interface QueryResult<T> {
  data: T[];
  meta: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
