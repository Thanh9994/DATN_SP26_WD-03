import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Jwt from "jsonwebtoken";
import { User } from "../user/user.model";
import { AppError } from "@api/middlewares/error.middleware";
import { catchAsync } from "@api/utils/catchAsync";

export const Register = catchAsync(async (req, res) => {
  const { email, password, ho_ten, phone } = req.body;

  const exitingUser = await User.findOne({ email });
  if (exitingUser) {
    throw new AppError("Email đã tồn tại", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const verifyToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    ho_ten,
    email,
    phone,
    password: hashedPassword,
    emailVerifyToken: verifyToken,
    emailVerifyExpire: Date.now() + 1000 * 60 * 60, // 1h
  });

  const verifyUrl = `http://localhost:5000/api/access/auth/verify-email?token=${verifyToken}`;

  // transporter gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Xác nhận email",
    html: `
      <h3>Xin chào ${ho_ten}</h3>
      <p>Nhấn vào link để xác nhận email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  });

  res.status(201).json({
    message: "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.",
  });
});
export const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({
    emailVerifyToken: token,
    emailVerifyExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Token không hợp lệ hoặc đã hết hạn", 400);
  }

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpire = undefined;

  await user.save();

  res.json({
    message: "Xác nhận email thành công",
  });
});
export const Login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Email hoặc mật khẩu không chính xác', 401);
  }

  if (user.trang_thai === 'inactive' || user.trang_thai === 'banned') {
    throw new AppError('Tài khoản đã bị khóa', 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Email hoặc mật khẩu không chính xác', 401);
  }

  const token = Jwt.sign(
    { _id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as Jwt.SignOptions['expiresIn'] },
  );

  res.status(200).json({
    message: 'Đăng nhập thành công',
    token,
    user: {
      _id: user._id,
      ho_ten: user.ho_ten,
      email: user.email,
      role: user.role,
    },
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      message: 'If the email exists, a reset link has been sent.',
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: user.email,
    subject: 'Reset Password',
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

  res.json({ message: 'Đã gửi email reset password' });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: 'Mật khẩu không được để trống',
    });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  // tìm user
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: 'Token không hợp lệ hoặc đã hết hạn',
    });
  }

  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    throw new AppError('Mật khẩu mới không được trùng mật khẩu cũ', 400);
  }

  user.password = await bcrypt.hash(password, 10); // Đổi về salt 10 cho đồng bộ tốc độ
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: 'Đổi mật khẩu thành công' });
});
