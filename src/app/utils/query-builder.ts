import {
  IQueryConfig,
  IQueryParams,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  QueryResult,
} from "../../interfaces/query-builder.interface";

export class QueryBuilder<T, TWhereInput, TInclude> {
  private query: PrismaFindManyArgs;
  private queryWhere: PrismaCountArgs;
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
    this.queryWhere = {};
  }

  pagination(): this {
    this.query.skip = this.skip;
    this.query.take = this.limit;

    return this;
  }

  async execute(): Promise<QueryResult<T>> {
    const [data, total] = await Promise.all([
      this.model.findMany(this.query),
      this.model.count(this.queryWhere),
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
}
