import {
  IQueryConfig,
  IQueryParams,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  PrismaWhereConditions,
  QueryResult,
} from "../../interfaces/query-builder.interface";

export class QueryBuilder<T, TWhereInput, TInclude> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountArgs;
  private page: number;
  private limit: number;
  private skip: number;

  constructor(
    private model: PrismaModelDelegate,
    private queryParams: IQueryParams,
    private config: IQueryConfig,
  ) {
    this.page = Number(this.queryParams.page) || 1;
    this.limit = Number(this.queryParams.limit) || 10;
    this.skip = (this.page - 1) * this.limit;
    this.query = {};
    this.countQuery = {};
  }

  pagination(): this {
    this.query.skip = this.skip;
    this.query.take = this.limit;

    return this;
  }

  where(conditions: TWhereInput): this {
    this.query.where = this._deepMerge(
      this.query.where as PrismaWhereConditions,
      conditions as Record<string, unknown>,
    );

    this.countQuery.where = this._deepMerge(
      this.countQuery.where as PrismaWhereConditions,
      conditions as Record<string, unknown>,
    );

    return this;
  }

  async execute(): Promise<QueryResult<T>> {
    const [data, total] = await Promise.all([
      this.model.findMany(this.query),
      this.model.count(this.countQuery),
    ]);

    const totalPages = Math.ceil(total / this.limit);

    return {
      data,
      meta: {
        currentPage: this.page,
        limit: this.limit,
        total,
        totalPages,
      },
    };
  }

  private _deepMerge(
    target: PrismaWhereConditions,
    source: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        if (
          result[key] &&
          typeof result[key] === "object" &&
          !Array.isArray(result[key])
        ) {
          result[key] = this._deepMerge(
            result[key] as Record<string, unknown>,
            source[key] as Record<string, unknown>,
          );
        }
      }

      result[key] = source[key];
    }

    return result;
  }
}
