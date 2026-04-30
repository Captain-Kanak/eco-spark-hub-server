import { Idea, Payment, Prisma, User, UserRole } from "@prisma/client";
import { ICreateIdea, IUpdateIdea } from "./idea.interface.js";
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
  payload: ICreateIdea,
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
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to create idea",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getIdeas = async (
  query: IQueryParams,
  userId?: string,
): Promise<QueryResult<Partial<Idea>>> => {
  try {
    let purchasedIdeaIds = new Set<string>();

    if (userId) {
      const payments = await prisma.payment.findMany({
        where: {
          userId,
        },
        select: {
          ideaId: true,
        },
      });

      purchasedIdeaIds = new Set(payments.map((payment) => payment.ideaId));
    }

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
      .where({ isDeleted: false })
      .search()
      .filter()
      .sort()
      .select()
      .includes({
        category: true,
      })
      .execute();

    const sanitizedIdeas = result.data.map((idea) => {
      if (!idea.isPaid) {
        return {
          ...idea,
        };
      }

      const isOwner = idea.userId === userId;
      const hasPurchased = purchasedIdeaIds.has(idea.id);

      if (isOwner || hasPurchased) {
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
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get ideas",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getMyIdeas = async (userId: string): Promise<Idea[]> => {
  try {
    const queryBuilder = new QueryBuilder<
      Idea,
      Prisma.IdeaWhereInput,
      Prisma.IdeaInclude
    >(prisma.idea, {}, {});

    const result = await queryBuilder
      .pagination()
      .where({ isDeleted: false, userId })
      .search()
      .filter()
      .sort()
      .select()
      .includes({ _count: true })
      .execute();

    return result.data;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get my ideas",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getPurchasedIdeas = async (userId: string) => {
  try {
    const queryBuilder = new QueryBuilder<
      Payment,
      Prisma.PaymentWhereInput,
      Prisma.PaymentInclude
    >(prisma.payment, {}, {});

    const result = await queryBuilder
      .pagination()
      .where({ isDeleted: false, userId })
      .search()
      .filter()
      .sort()
      .select()
      .includes({
        idea: {
          include: {
            category: true,
          },
        },
      })
      .execute();

    return result.data;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get my ideas",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getIdeaById = async (
  id: string,
  userId?: string,
): Promise<Partial<Idea>> => {
  const idea = await prisma.idea.findUnique({
    where: { id },
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
    throw new AppError("Please login to access this idea", status.UNAUTHORIZED);
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
};

const updateIdeaById = async (
  id: string,
  payload: IUpdateIdea,
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

    const updatedIdea = await prisma.idea.update({
      where: {
        id,
      },
      data: {
        ...payload,
        price: payload.isPaid ? Number(payload.price) : 0.0,
      },
    });

    return updatedIdea;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to update idea",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteIdeaById = async (id: string, user: User): Promise<Idea> => {
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

    const deletedIdea = await prisma.idea.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return deletedIdea;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to delete idea",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const ideaServices = {
  createIdea,
  getIdeas,
  getMyIdeas,
  getPurchasedIdeas,
  getIdeaById,
  updateIdeaById,
  deleteIdeaById,
};
