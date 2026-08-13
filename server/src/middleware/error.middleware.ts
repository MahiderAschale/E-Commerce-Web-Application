import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    const field = err.field ? ` \"${err.field}\"` : "";

    return res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_UNEXPECTED_FILE"
          ? `Unexpected upload field${field}. This endpoint accepts exactly one file named \"image\".`
          : err.message,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  const prismaErrorCode = (err as Error & { code?: string }).code;

  if (prismaErrorCode === "P2021" || prismaErrorCode === "P2022") {
    return res.status(500).json({
      success: false,
      message:
        "Database schema is out of date. Apply the latest Prisma migrations and restart the server.",
    });
  }

  console.error(err);

  const isProduction = process.env.NODE_ENV === "production";

  return res.status(500).json({
    success: false,
    message: isProduction
      ? "Internal Server Error"
      : err.message || "Internal Server Error",
  });
};
