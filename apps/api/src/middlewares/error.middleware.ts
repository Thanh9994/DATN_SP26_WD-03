import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Lỗi hệ thống không xác định";

  console.error(`[ERROR]: ${message}`, err);

  res.status(statusCode).json({
    success: false,
    message,
    // Chỉ hiện chi tiết lỗi khi ở môi trường development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// Hàm bổ trợ để ném lỗi nhanh
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
