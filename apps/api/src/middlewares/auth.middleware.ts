import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../modules/auth/user.model";
import { IUser } from "@shared/schemas";

// Mở rộng interface Request của Express để có thể chứa thông tin user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Yêu cầu xác thực, vui lòng cung cấp token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const user = await UserModel.findById(decoded.id).select("-password -__v -updatedAt");
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
    res.status(500).json({ message: "Lỗi xác thực từ server" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction ) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập tài nguyên này" });
    }
    next();
  };
};
