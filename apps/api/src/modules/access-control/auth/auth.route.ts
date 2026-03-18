import { Router } from 'express';
import {
  forgotPassword,
  Login,
  Register,
  resendOtp,
  resetPassword,
  verifyOtp,
  changePassword,
} from './auth.controller';
import { protect } from '@api/middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/register', Register);
authRouter.post('/login', Login);
authRouter.post('/forgot-password', forgotPassword);

authRouter.post('/change-password', protect, changePassword);
authRouter.post('/reset-password/:token', resetPassword);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/resend-otp', resendOtp);

export default authRouter;
