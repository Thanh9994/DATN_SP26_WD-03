import { Request, Response } from 'express';
import { BadRequestError } from '@api/middlewares/error.middleware';
import { catchAsync } from '@api/utils/catchAsync';
import { ResendOtp } from '@shared/src/schemas';
import * as AuthService from './auth.service';
import { UserPresenter } from '../user/dtos/user.presenter';

export const Register = catchAsync(async (req: Request, res: Response) => {
  await AuthService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP.',
  });
});

export const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await AuthService.verifyOtp(email, otp);

  res.status(200).json({
    success: true,
    message: 'Xác thực tài khoản thành công!',
  });
});

export const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = ResendOtp.parse(req.body);
  await AuthService.resendOtp(email);
  res.status(200).json({ success: true, message: 'Mã OTP mới đã được gửi.' });
});

export const Login = catchAsync(async (req: Request, res: Response) => {
  const { token, user } = await AuthService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Đăng nhập thành công',
    token,
    user: UserPresenter.toProfile(user),
  });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body.email);
  res.status(200).json({ success: true, message: 'Nếu email tồn tại, link reset đã được gửi.' });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) throw new BadRequestError('Mật khẩu không được để trống');

  await AuthService.resetPassword(token, password);
  res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công.' });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) throw new BadRequestError('Mật khẩu không được để trống');

  await AuthService.resetPassword(token, password);
  res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công.' });
});
