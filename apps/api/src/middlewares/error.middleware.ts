import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    if (err.statusCode === 500) {
      console.error(`💥 [SYSTEM ERROR]:`, err);
    } else {
      console.log(`⚠️ [APP ERROR]: ${err.statusCode} - ${err.message}`);
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Đã có lỗi xảy ra từ phía máy chủ!",
      });
    }
  }
};

// Hàm bổ trợ để ném lỗi nhanh
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Đánh dấu đây là lỗi có thể dự đoán được

    Error.captureStackTrace(this, this.constructor);
  }
}
