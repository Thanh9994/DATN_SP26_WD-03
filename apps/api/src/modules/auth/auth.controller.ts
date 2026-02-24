import { message } from 'antd';
import { UpdateUser } from '@shared/schemas';
import { Request, Response } from "express";
import { UserModel } from "./user.model";
import bcrypt from 'bcryptjs'
import  Jwt  from "jsonwebtoken";
import z from 'zod';

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, password, ho_ten, phone } = req.body;
    const exitUser = await UserModel.findOne({ email });
    if (!exitUser) {
      return res.status(400).json({ message: "Email này đã được đăng ký!" })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      ho_ten,
      email,
      phone,
      password: hashedPassword,
    });
    
    res.status(201).json({
      message: "Đăng ký thành công",
      user: { id: user._id, email: user.email, ho_ten: user.ho_ten }
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi đăng ký", error });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    if (user.trang_thai === "inactive") {
      return res.status(403).json({ message: "Tài khoản đang bị khóa." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không đúng." });
    }

    const token = Jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: { id: user._id, ho_ten: user.ho_ten, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi đăng nhập", error });
  }
};
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy danh sách người dùng", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const validation = UpdateUser.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({ 
                message: "Dữ liệu không hợp lệ", 
                errors: validation.error  
            });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $set: validation.data },
            { new: true }
        ).select("-password");

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: "Lỗi server" })
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        await UserModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa Thành Công"});
    } catch (error) {
        res.status(400).json({ message: "Lỗi server" })
    }
}