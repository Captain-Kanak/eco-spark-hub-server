import {
  Idea,
  IdeaStatus,
  Payment,
  Prisma,
  User,
  UserRole,
} from "@prisma/client";
import { CreateIdea, UpdateIdea } from "./idea.interface.js";
import AppError from "../../errors/app-error.js";
import status from "http-status";
import { prisma } from "../../lib/prisma.js";
import {
  IQueryParams,
  QueryResult,
} from "../../../interfaces/query-builder.interface.js";
import { QueryBuilder } from "../../utils/query-builder.js";
import { ideaFilterableFields, ideaSearchableFields } from "./idea.constant.js";

const createIdea = async (
  payload: CreateIdea,
  userId: string,
): Promise<Idea> => {
  try {
    const idea = await prisma.idea.create({
      data: {
        ...payload,
        userId,
      },
    });

    return idea;
  } catch (error) {
    throw new AppError("Failed to create idea", status.INTERNAL_SERVER_ERROR);
  }
};

const getPendingIdeas = async (
  query: IQueryParams,
): Promise<QueryResult<Partial<Idea>>> => {
  try {
    const queryBuilder = new QueryBuilder<
      Idea,
      Prisma.IdeaWhereInput,
      Prisma.IdeaInclude
    >(prisma.idea, query, {
      searchableFields: ideaSearchableFields,
      filterableFields: ideaFilterableFields,
    });

    const result = await queryBuilder
      .pagination()
      .where({ isDeleted: false, status: IdeaStatus.PENDING })
      .search()
      .filter()
      .sort()
      .select()
      .includes({ user: true })
      .execute();

    return result;
  } catch (error) {
    throw new AppError(
      "Failed to get pending ideas",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getIdeas = async (
  query: IQueryParams,
  user?: User,
): Promise<QueryResult<Partial<Idea>>> => {
  try {
    const queryBuilder = new QueryBuilder<
      Idea,
      Prisma.IdeaWhereInput,
      Prisma.IdeaInclude
    >(prisma.idea, query, {
      searchableFields: ideaSearchableFields,
      filterableFields: ideaFilterableFields,
    });

    const result = await queryBuilder
      .pagination()
      .where({
        isDeleted: false,
        status: IdeaStatus.APPROVED,
        categoryId: query.categoryId,
      })
      .search()
      .filter()
      .sort()
      .select()
      .includes({
        category: true,
        user: true,
        _count: true,
      })
      .execute();

    // Check if the user has purchased the idea
    let purchasedIdeaIds = new Set<string>();

    if (user?.id) {
      const payments = await prisma.payment.findMany({
        where: {
          userId: user.id,
        },
        select: {
          ideaId: true,
        },
      });

      purchasedIdeaIds = new Set(payments.map((payment) => payment.ideaId));
    }

    const sanitizedIdeas = result.data.map((idea) => {
      if (!idea.isPaid) {
        return {
          ...idea,
        };
      }

      const isAdmin = user?.role === UserRole.ADMIN;
      const isOwner = idea.userId === user?.id;
      const hasPurchased = purchasedIdeaIds.has(idea.id);

      if (isAdmin || isOwner || hasPurchased) {
        return {
          ...idea,
        };
      }

      return {
        id: idea.id,
        title: idea.title,
        image: idea.image,
        isPaid: idea.isPaid,
        price: idea.price,
        status: idea.status,
        upvotes: idea.upvotes,
        downvotes: idea.downvotes,
        categoryId: idea.categoryId,
        createdAt: idea.createdAt,
        updatedAt: idea.updatedAt,
      };
    });

    return {
      data: sanitizedIdeas,
      meta: result.meta,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError("Failed to get ideas", status.INTERNAL_SERVER_ERROR);
  }
};

const getMyIdeas = async (
  query: IQueryParams,
  userId: string,
): Promise<QueryResult<Partial<Idea>>> => {
  try {
    const queryBuilder = new QueryBuilder<
      Idea,
      Prisma.IdeaWhereInput,
      Prisma.IdeaInclude
    >(prisma.idea, query, {});

    const result = await queryBuilder
      .pagination()
      .where({
        isDeleted: false,
        status: IdeaStatus.APPROVED,
        userId,
      })
      .search()
      .filter()
      .sort()
      .select()
      .includes({ _count: true })
      .execute();

    return result;
  } catch (error) {
    throw new AppError("Failed to get my ideas", status.INTERNAL_SERVER_ERROR);
  }
};

const getPurchasedIdeas = async (
  query: IQueryParams,
  userId: string,
): Promise<QueryResult<Partial<Payment>>> => {
  try {
    const queryBuilder = new QueryBuilder<
      Payment,
      Prisma.PaymentWhereInput,
      Prisma.PaymentInclude
    >(prisma.payment, query, {});

    const result = await queryBuilder
      .pagination()
      .where({ isDeleted: false, userId })
      .search()
      .filter()
      .sort()
      .select()
      .includes({
        idea: true,
      })
      .execute();

    return result;
  } catch (error) {
    throw new AppError("Failed to get my ideas", status.INTERNAL_SERVER_ERROR);
  }
};

const getIdeaById = async (
  id: string,
  userId?: string,
): Promise<Partial<Idea>> => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id, status: IdeaStatus.APPROVED },
      include: { user: true },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    if (!idea.isPaid) {
      return idea;
    }

    const isOwner = idea.userId === userId;

    if (isOwner) {
      return idea;
    }

    if (!userId) {
      throw new AppError(
        "Please login to access this idea",
        status.UNAUTHORIZED,
      );
    }

    const payment = await prisma.payment.findFirst({
      where: {
        ideaId: id,
        userId,
      },
    });

    if (!payment) {
      return {
        id: idea.id,
        price: idea.price,
      };
    }

    return idea;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError("Failed to get idea", status.INTERNAL_SERVER_ERROR);
  }
};

const updateIdeaById = async (
  id: string,
  payload: UpdateIdea,
  userId: string,
): Promise<Idea> => {
  try {
    const idea = await prisma.idea.findUnique({
      where: {
        id,
      },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    if (idea.userId !== userId) {
      throw new AppError(
        "You are not authorized to update this idea",
        status.UNAUTHORIZED,
      );
    }

    if (idea.isDeleted) {
      throw new AppError("Idea already deleted", status.BAD_REQUEST);
    }

    const updatedIdea = await prisma.idea.update({
      where: {
        id,
      },
      data: payload,
    });

    return updatedIdea;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError("Failed to update idea", status.INTERNAL_SERVER_ERROR);
  }
};

const updateIdeaStatus = async (id: string, ideaStatus: IdeaStatus) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: {
        id,
      },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    if (idea.status === ideaStatus) {
      throw new AppError(
        `Idea status already ${ideaStatus}`,
        status.BAD_REQUEST,
      );
    }

    if (idea.isDeleted) {
      throw new AppError("Idea already deleted", status.BAD_REQUEST);
    }

    const updatedIdea = await prisma.idea.update({
      where: {
        id,
      },
      data: {
        status: ideaStatus,
      },
    });

    return updatedIdea;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to update idea status",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteIdeaById = async (id: string, user: User): Promise<void> => {
  try {
    const isAdmin = user.role === UserRole.ADMIN;

    const idea = await prisma.idea.findUnique({
      where: {
        id,
      },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    if (idea.isDeleted) {
      throw new AppError("Idea already deleted", status.BAD_REQUEST);
    }

    if (!isAdmin && idea.userId !== user.id) {
      throw new AppError(
        "You are not authorized to delete this idea",
        status.UNAUTHORIZED,
      );
    }

    await prisma.idea.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError("Failed to delete idea", status.INTERNAL_SERVER_ERROR);
  }
};

export const ideaServices = {
  createIdea,
  getPendingIdeas,
  getIdeas,
  getMyIdeas,
  getPurchasedIdeas,
  getIdeaById,
  updateIdeaById,
  updateIdeaStatus,
  deleteIdeaById,
};
