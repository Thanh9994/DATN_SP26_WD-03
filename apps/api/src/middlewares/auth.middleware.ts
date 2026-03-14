import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser, IUserDocument, IUserRole } from "@shared/schemas";
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
    return res.status(401).json({
      status: "fail",
      message: "Vui lòng đăng nhập để tiếp tục",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id?: string;
      _id?: string;
    };
    const userId = decoded._id || decoded.id;
    if (!userId) return next(new AppError("Token không hợp lệ", 401));
    const user = await User.findById(userId).select("-password -__v");

    if (!user) return next(new AppError("User không tồn tại", 401));
    if (user.trang_thai !== "active")
      return next(new AppError("Tài khoản bị khóa", 403));

    req.user = user as IUserDocument;
    next();
  } catch (error) {
    // Trả về JSON luôn, không gọi next(err) để Terminal không báo lỗi Stack Trace
    return res.status(401).json({
      status: "fail",
      message:
        error instanceof jwt.TokenExpiredError
          ? "Token đã hết hạn"
          : "Xác thực lỗi",
    });
  }
});

export const authorize = (roles: IUserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("Bạn không có quyền thực hiện hành động này", 403),
      );
    }
    next();
  };
};
