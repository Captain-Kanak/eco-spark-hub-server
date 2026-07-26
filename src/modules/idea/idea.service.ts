import {
  Idea,
  IdeaStatus,
  Donation,
  Prisma,
  User,
  UserRole,
} from "@prisma/client";
import { CreateIdea, UpdateIdea } from "./idea.interface.js";
import AppError from "../../errors/app-error.js";
import status from "http-status";
import { prisma } from "../../lib/prisma.js";
import { QueryBuilder } from "../../utils/query-builder.js";
import { ideaFilterableFields, ideaSearchableFields } from "./idea.constant.js";
import {
  IQueryParams,
  QueryResult,
} from "../../interfaces/query-builder.interface.js";
import { generateUniqueSlug } from "../../utils/generate-slug.js";

const createIdea = async (
  payload: CreateIdea,
  userId: string,
): Promise<Idea> => {
  try {
    const slug = generateUniqueSlug(payload.title);

    const idea = await prisma.idea.create({
      data: {
        ...payload,
        userId,
        slug,
      },
    });

    return idea;
  } catch (error) {
    throw error;
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
      .where({
        deletedAt: null,
        status: IdeaStatus.ON_REVIEW,
      })
      .search()
      .filter()
      .sort()
      .select()
      .includes({ user: true })
      .execute();

    return result;
  } catch (error) {
    throw error;
  }
};

const getIdeas = async (
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
      .where({
        deletedAt: null,
        status: IdeaStatus.PUBLISHED,
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

    return result;
  } catch (error) {
    throw error;
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
        userId,
        deletedAt: null,
        status: IdeaStatus.PUBLISHED,
      })
      .search()
      .filter()
      .sort()
      .select()
      .includes({ _count: true })
      .execute();

    return result;
  } catch (error) {
    throw error;
  }
};

const getDonatedIdeas = async (
  query: IQueryParams,
  userId: string,
): Promise<QueryResult<Partial<Donation>>> => {
  try {
    const queryBuilder = new QueryBuilder<
      Donation,
      Prisma.DonationWhereInput,
      Prisma.DonationInclude
    >(prisma.donation, query, {});

    const result = await queryBuilder
      .pagination()
      .where({ deletedAt: null, userId })
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

const getIdeaById = async (id: string): Promise<Partial<Idea>> => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id, status: IdeaStatus.PUBLISHED },
      include: { user: true },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    return idea;
  } catch (error) {
    throw error;
  }
};

const updateIdeaById = async (
  id: string,
  payload: UpdateIdea,
  userId: string,
): Promise<Idea> => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id, deletedAt: null },
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

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: payload,
    });

    return updatedIdea;
  } catch (error) {
    throw error;
  }
};

const updateIdeaStatus = async (id: string, ideaStatus: IdeaStatus) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id, deletedAt: null },
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

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: {
        status: ideaStatus,
      },
    });

    return updatedIdea;
  } catch (error) {
    throw error;
  }
};

const deleteIdeaById = async (id: string, user: User): Promise<void> => {
  try {
    const isAdmin = user.role === UserRole.ADMIN;

    const idea = await prisma.idea.findUnique({
      where: { id, deletedAt: null },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    if (!isAdmin && idea.userId !== user.id) {
      throw new AppError(
        "You are not authorized to delete this idea",
        status.UNAUTHORIZED,
      );
    }

    await prisma.idea.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const ideaServices = {
  createIdea,
  getPendingIdeas,
  getIdeas,
  getMyIdeas,
  getDonatedIdeas,
  getIdeaById,
  updateIdeaById,
  updateIdeaStatus,
  deleteIdeaById,
};
