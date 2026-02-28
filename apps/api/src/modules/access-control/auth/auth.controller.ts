import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { User } from "../user/user.model";

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, password, ho_ten, phone } = req.body;
    const exitUser = await User.findOne({ email });
    if (exitUser) {
      return res.status(400).json({ message: "Email này đã được đăng ký!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      ho_ten,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      user: { id: user._id, email: user.email, ho_ten: user.ho_ten },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi đăng ký", error });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

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
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: { id: user._id, ho_ten: user.ho_ten, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi đăng nhập", error });
  }
};
