import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Jwt from "jsonwebtoken";
import { User } from "../user/user.model";

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, password, ho_ten, phone } = req.body;
    const exitingUser = await User.findOne({ email });
    if (exitingUser) {
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
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác." });
    }

    if (user.trang_thai === "inactive" || user.trang_thai === "banned") {
      return res.status(403).json({
        message:
          "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
      });
    }
    const token = Jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as Jwt.SignOptions["expiresIn"] },
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: { id: user._id, ho_ten: user.ho_ten, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi đăng nhập", error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Reset Password",
      html: `
        <h3>Reset mật khẩu</h3>
        <p>Click vào link dưới đây để đặt lại mật khẩu:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    res.json({ message: "Đã gửi email reset password" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
