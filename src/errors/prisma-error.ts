import { Prisma } from "@prisma/client";
import status from "http-status";

export const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
) => {
  let message = "Database Error";
  let statusCode: number = status.BAD_REQUEST;

  switch (err.code) {
    case "P2002":
      message = `Duplicate value for ${err.meta?.target}`;
      break;

    case "P2003":
      message = "Invalid relation";
      break;

    case "P2025":
      message = "Record not found";
      statusCode = status.NOT_FOUND;
      break;
  }

  return {
    statusCode,
    message,
    errorSources: [],
  };
};
