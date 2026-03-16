import { Router } from 'express';
import {
  forgotPassword,
  Login,
  Register,
  resendOtp,
  resetPassword,
  verifyOtp,
} from './auth.controller';

const authRouter = Router();

authRouter.post('/register', Register);
authRouter.post('/login', Login);
authRouter.post('/forgot-password', forgotPassword);

authRouter.post('/reset-password/:token', resetPassword);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/resend-otp', resendOtp);

export default authRouter;
