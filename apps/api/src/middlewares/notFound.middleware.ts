import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(
    new AppError(
      `Đường dẫn ${req.originalUrl} không tồn tại trên hệ thống`,
      404,
    ),
  );
};
