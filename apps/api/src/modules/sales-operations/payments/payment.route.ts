import express from 'express';
import { paymentController } from './payment.controller';

const router = express.Router();

router.get('/vnpay-ipn', paymentController.vnpayIpn);

router.post('/create-payment', paymentController.createPaymentUrl);

export default router;
