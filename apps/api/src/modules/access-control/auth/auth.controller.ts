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
      return res.json({
        message: "If the email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

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
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
          <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:12px;padding:40px 30px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">

            <h2 style="margin:0 0 20px;color:#111;font-size:24px;">
              Reset Your Password
            </h2>

            <p style="color:#555;font-size:15px;line-height:1.6;">
              We received a request to reset the password for your account.
              Click the button below to create a new password.
            </p>

            <div style="text-align:center;margin:30px 0;">
              <a href="${resetUrl}" 
                style="
                  background:#e11d48;
                  color:#ffffff;
                  padding:14px 28px;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:600;
                  display:inline-block;
                  font-size:15px;
                ">
                Reset Password
              </a>
            </div>

            <p style="color:#777;font-size:14px;line-height:1.6;">
              If you did not request a password reset, you can safely ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #eee;margin:30px 0;" />

            <p style="color:#999;font-size:12px;text-align:center;">
              This link will expire in 10 minutes for security reasons.
            </p>

          </div>
        </div>
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

    if (!password) {
      return res.status(400).json({
        message: "Mật khẩu không được để trống",
      });
    }

    // hash token từ URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // tìm user
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    // kiểm tra trùng mật khẩu cũ
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "Mật khẩu mới không được trùng mật khẩu cũ",
      });
    }

    // hash password mới
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    // clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
