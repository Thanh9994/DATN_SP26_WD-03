import * as MailService from '@api/common/mail.service';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@api/middlewares/error.middleware';

export const register = async (userData: any) => {
  const { email, password, ho_ten, phone } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email này đã được đăng ký trên hệ thống');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000)
    .toString()
    .padStart(6, '0');

  const newUser = await User.create({
    ho_ten,
    email,
    phone,
    password: hashedPassword,
    otpCode: otp,
    otpExpire: new Date(Date.now() + 10 * 60 * 1000),
  });

  MailService.sendMail(MailService.getOtpTemplate(email, otp)).catch(console.error);

  return newUser;
};

export const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({
    email,
    otpCode: otp,
    otpExpire: { $gt: new Date() },
  });

  if (!user) {
    throw new BadRequestError('Mã OTP không chính xác hoặc đã hết hạn');
  }

  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpire = undefined;
  user.trang_thai = 'active';
  await user.save();

  return user;
};

export const resendOtp = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError('Không tìm thấy người dùng với email này');
  if (user.isVerified) throw new BadRequestError('Tài khoản này đã được xác thực rồi');

  const newOtp = Math.floor(100000 + Math.random() * 900000)
    .toString()
    .padStart(6, '0');
  user.otpCode = newOtp;
  user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  MailService.sendMail(MailService.getOtpTemplate(email, newOtp)).catch(console.error);
};

export const login = async (credentials: any) => {
  const { email, password } = credentials;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError('Email hoặc mật khẩu không chính xác');
  }

  if (user.trang_thai === 'banned') {
    throw new ForbiddenError('Tài khoản của bạn đã bị khóa');
  }

  const token = Jwt.sign(
    { _id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as Jwt.SignOptions['expiresIn'] },
  );

  return { token, user };
};

export const resetPassword = async (token: string, password: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new BadRequestError('Token không hợp lệ hoặc đã hết hạn');

  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) throw new BadRequestError('Mật khẩu mới không được trùng mật khẩu cũ');

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) return; // Bảo mật: không báo lỗi nếu email không tồn tại

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  MailService.sendMail(MailService.getResetPasswordTemplate(email, resetUrl)).catch(console.error);

  return resetToken; 
};