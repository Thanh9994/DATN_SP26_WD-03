import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "@shared/schemas";
import { User } from "@api/modules/access-control/user/user.model";

// Mở rộng interface Request của Express để có thể chứa thông tin user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

type UserRole = IUser["role"];

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Vui lòng đăng nhập để tiếp tục" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (user.trang_thai !== "active") {
      return res
        .status(403)
        .json({ message: `Tài khoản của bạn đã bị ${user.trang_thai}` });
    }

    req.user = user;
    next();
  } catch (error) {
    const message =
      error instanceof jwt.TokenExpiredError
        ? "Token đã hết hạn"
        : "Xác thực không hợp lệ";
    res.status(401).json({ message });
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as UserRole;

    if (!req.user || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Quyền truy cập bị từ chối" });
    }
    next();
  };
};
