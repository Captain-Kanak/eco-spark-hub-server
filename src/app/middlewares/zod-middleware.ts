import { NextFunction, Request, Response } from "express";
import * as z from "zod";

export const paramsIdZodSchema = z.object({
  id: z.uuid("UUID is invalid or missing"),
});

export const validateRequestBody = (zodObject: z.ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = zodObject.safeParse(req.body);

    if (!parsedResult.success) {
      next(parsedResult.error);
    }

    req.body = parsedResult.data;

    next();
  };
};

export const validateRequestParams = (zodObject: z.ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = zodObject.safeParse(req.params);

    if (!parsedResult.success) {
      next(parsedResult.error);
    }

    req.params = parsedResult.data as Record<string, string>;

    next();
  };
};
