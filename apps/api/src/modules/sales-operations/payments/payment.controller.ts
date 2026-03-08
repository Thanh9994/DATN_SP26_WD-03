import { Request, Response } from "express";
import { processIpn } from "./payment.service";
import { catchAsync } from "@api/utils/catchAsync";

const vnpayIpn = catchAsync(async (req: Request, res: Response) => {
  const result = await processIpn(req.query as any);
  res.json(result);
});

const createPaymentUrl = catchAsync(async (req: Request, res: Response) => {
  const ipnUrl = process.env.VNP_IPN_URL;

  console.log("Kiểm tra biến môi trường VNP_IPN_URL:", ipnUrl);

  res.json({
    message: "Kiểm tra console của server để thấy giá trị VNP_IPN_URL.",
    ipnUrl: ipnUrl,
    paymentUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_IpnUrl=${ipnUrl}&...`,
  });
});

export const paymentController = {
  vnpayIpn,
  createPaymentUrl,
};
