import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser, IUserDocument } from "@shared/schemas";
import { User } from "@api/modules/access-control/user/user.model";
import { catchAsync } from "@api/utils/catchAsync";
import { AppError } from "./error.middleware";

// Mở rộng interface Request của Express để có thể chứa thông tin user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
  } catch (error) {
    return next(
      new AppError(
        error instanceof jwt.TokenExpiredError
          ? "Token đã hết hạn"
          : "Xác thực không hợp lệ",
        401,
      ),
    );
  }

  const user = await User.findById(decoded.id).select("-password -__v");
  if (!user) {
    return next(
      new AppError("Người dùng không còn tồn tại trên hệ thống", 401),
    );
  }

  if (user.trang_thai !== "active") {
    return next(
      new AppError(`Tài khoản của bạn đã bị ${user.trang_thai}`, 403),
    );
  }

  req.user = user as IUserDocument;
  next();
});

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("Bạn không có quyền thực hiện hành động này", 403),
      );
    }
    next();
  };
};
