import { Idea } from "@prisma/client";
import { ICreateIdea } from "./idea.interface";
import AppError from "../../errors/app-error";
import status from "http-status";
import { prisma } from "../../lib/prisma";

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

export const ideaServices = { createIdea };
