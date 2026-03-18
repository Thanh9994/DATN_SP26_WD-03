import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import { AppError } from '@api/middlewares/error.middleware';
import { catchAsync } from '@api/utils/catchAsync';
import { ResendOtp, VerifyOtp } from '@shared/schemas';

export const Register = catchAsync(async (req, res) => {
  const { email, password, ho_ten, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email đã tồn tại', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000)
    .toString()
    .padStart(6, '0');

  await User.create({
    ho_ten,
    email,
    phone,
    password: hashedPassword,
    otpCode: otp,
    otpExpire: Date.now() + 6 * 60 * 1000,
    isVerified: false,
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: `[PvM.app] ${otp} là mã xác thực của bạn`,
    html: `
      <div style="background-color: #020617; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 24px; border: 1px solid #1e293b; overflow: hidden;">
          <tr>
            <td style="padding: 40px 20px; text-align: center; color: #ffffff;">
              
              <h1 style="margin: 0; font-size: 28px; color: #ef4444; letter-spacing: -1px;">
                CINEMA<span style="color: #ffffff;">APP</span>
              </h1>
              
              <p style="color: #94a3b8; font-size: 16px; margin-top: 10px;">Xác thực tài khoản của bạn</p>
              
              <div style="margin: 30px 0; padding: 30px; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155;">
                <p style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 2px;">Mã OTP của bạn là</p>
                
                <div style="
                  font-size: 42px; 
                  font-weight: 800; 
                  letter-spacing: 10px; 
                  color: #ffffff; 
                  text-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
                  user-select: all; /* Hỗ trợ một số trình duyệt tự chọn toàn bộ khi chạm */
                  -webkit-user-select: all;
                ">
                  <span style="font-family: monospace; cursor: pointer;">${otp}</span>
                </div>
                
                <p style="margin-top: 15px; font-size: 11px; color: #475569;">(Nhấn giữ vào số trên để sao chép)</p>
              </div>

              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 0;">
                Mã này sẽ hết hạn trong <strong style="color: #f1f5f9;">10 phút</strong>.<br>
                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
</p>
              
            </td>
          </tr>
        </table>
      </div>
    `,
  });

  res.status(201).json({
    message: 'Đăng ký thành công. Mã OTP đã được gửi vào email.',
  });
});

export const verifyOtp = catchAsync(async (req, res) => {
  const validated = VerifyOtp.parse(req.body);
  const user = await User.findOne({
    email: validated.email,
    otpCode: validated.otp,
    otpExpire: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError('Mã OTP không hợp lệ hoặc đã hết hạn', 400);
  }

  user.isVerified = true;
  user.otpCode = undefined; // Xóa mã sau khi dùng xong
  user.otpExpire = undefined;
  user.trang_thai = 'active';

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Xác nhận tài khoản thành công! Chào mừng bạn.',
  });
});

export const resendOtp = catchAsync(async (req, res) => {
  const { email } = ResendOtp.parse(req.body);
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Không tìm thấy người dùng với email này', 404);
  }

  if (user.isVerified) {
    throw new AppError('Tài khoản này đã được xác thực rồi', 400);
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000)
    .toString()
    .padStart(6, '0');

  user.otpCode = newOtp;
  user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: `[PVM.app] ${newOtp} là mã xác thực của bạn`,
    html: `
      <div style="background-color: #020617; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 24px; border: 1px solid #1e293b; overflow: hidden;">
          <tr>
            <td style="padding: 40px 20px; text-align: center; color: #ffffff;">
              
              <h1 style="margin: 0; font-size: 28px; color: #ef4444; letter-spacing: -1px;">
                PVM<span style="color: #ffffff;">APP</span>
              </h1>
              
              <p style="color: #94a3b8; font-size: 16px; margin-top: 10px;">Xác thực tài khoản của bạn</p>
              
              <div style="margin: 30px 0; padding: 30px; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155;">
                <p style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 2px;">Mã OTP của bạn là</p>
                
                <div style="
                  font-size: 42px; 
                  font-weight: 800;
letter-spacing: 10px; 
                  color: #ffffff; 
                  text-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
                  user-select: all; /* Hỗ trợ một số trình duyệt tự chọn toàn bộ khi chạm */
                  -webkit-user-select: all;
                ">
                  <span style="font-family: monospace; cursor: pointer;">${newOtp}</span>
                </div>
                
                <p style="margin-top: 15px; font-size: 11px; color: #475569;">(Nhấn giữ vào số trên để sao chép)</p>
              </div>

              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 0;">
                Mã này sẽ hết hạn trong <strong style="color: #f1f5f9;">10 phút</strong>.<br>
                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
              </p>
              
            </td>
          </tr>
        </table>
      </div>
  `,
  });

  res.status(200).json({
    status: 'success',
    message: 'Mã OTP mới đã được gửi vào email của bạn!',
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
      phone: user.phone,
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

export const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = (req as any).user?._id;

  if (!userId) throw new AppError('Chưa đăng nhập', 401);

  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('Không tìm thấy người dùng', 404);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new AppError('Mật khẩu cũ không đúng', 400);

  if (oldPassword === newPassword) throw new AppError('Mật khẩu mới không được trùng mật khẩu cũ', 400);

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: 'Đổi mật khẩu thành công' });
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
