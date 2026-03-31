import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Tài nguyên không tồn tại') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Dữ liệu không hợp lệ') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Bạn không có quyền truy cập') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Hành động bị từ chối') {
    super(message, 403);
  }
}

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
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
    // Production Mode
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        success: false,
        message: 'Đã có lỗi xảy ra từ phía máy chủ!',
      });
    }
  }
};

// 4. 404 Route Handler Middleware
export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Dùng luôn NotFoundError cho đồng bộ
  next(new NotFoundError(`Đường dẫn ${req.originalUrl} không tồn tại trên hệ thống`));
};
