import { z } from 'zod';
import { UserRole, UserStatus } from './enums';
import { Base, CloudinaryImage } from './core';

export const User = Base.extend({
  ho_ten: z.string().min(2),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải ít nhất 6 kí tự'),
  phone: z.string().regex(/^(03|05|07|08|09)\d{8}$/, 'Số điện thoại không hợp lệ'),
  avatar: CloudinaryImage.optional(),
  workAt: z
    .union([
      z.string(),
      z.object({
        _id: z.string().optional(),
        name: z.string().optional(),
      }),
    ])
    .optional(),
  role: UserRole.default('khach_hang'),
  trang_thai: UserStatus.default('active'),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpire: z.coerce.date().optional(),
  isVerified: z.boolean().default(false),
  otpCode: z.string().optional(),
  otpExpire: z.coerce.date().optional(),
});
export const VerifyOtp = z.object({
  email: z.string().email('Email không hợp lệ'),
  otp: z.string().length(6, 'Mã OTP phải là 6 số'),
});

export const ResendOtp = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export const UpdateUser = z.object({
  role: UserRole.optional(),
  trang_thai: UserStatus.optional(),
  workAt: z.string().nullable().optional(),
});

export const UserLog = User.pick({
  ho_ten: true,
  phone: true,
  role: true,
  trang_thai: true,
}).partial();

export const Login = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const Register = z.object({
  ho_ten: z.string().min(2, 'Họ tên phải ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải tối thiểu 8 ký tự')
    .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
    .regex(/\d/, 'Phải có ít nhất 1 số')
    .regex(/[@$!%*?&]/, 'Phải có ít nhất 1 ký tự đặc biệt'),

  phone: z.string().regex(/^(03|05|07|08|09)\d{8}$/, 'Số điện thoại không hợp lệ'),
});

export const AuthResponse = z.object({
  user: User,
  token: z.string(),
  remember: z.boolean().optional(),
});

export const CleanupLog = z.object({
  _id: z.string().optional(),
  type: z.enum(['booking', 'payment']),
  details: z.array(z.any()),
  notified: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
