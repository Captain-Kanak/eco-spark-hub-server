import { Idea, Prisma, UserRole } from "@prisma/client";
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
import { DecodedUser } from "../../../types/auth.type.js";

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

const getIdeas = async (query: IQueryParams): Promise<QueryResult<Idea>> => {
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
      .where({ isDeleted: false })
      .search()
      .filter()
      .sort()
      .select()
      .includes({ _count: true })
      .execute();

    return {
      data: result.data,
      meta: result.meta,
    };
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get ideas",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const getIdeaById = async (id: string): Promise<Idea> => {
  try {
    const idea = await prisma.idea.findUnique({
      where: {
        id,
      },
    });

    if (!idea) {
      throw new AppError("Idea not found", status.NOT_FOUND);
    }

    return idea;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get idea",
      status.INTERNAL_SERVER_ERROR,
    );
  }
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
      data: payload,
    });

    return updatedIdea;
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to update idea",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteIdeaById = async (id: string, user: DecodedUser): Promise<Idea> => {
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
  getIdeaById,
  updateIdeaById,
  deleteIdeaById,
};
