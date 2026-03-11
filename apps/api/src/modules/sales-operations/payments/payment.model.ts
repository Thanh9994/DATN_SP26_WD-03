import { IPaymentStatus, PaymentMethod, PaymentStatus } from "@shared/schemas";
import mongoose from "mongoose";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  finalAmount: number;
  paymentMethod: string; // 'vnpay', 'momo', etc.
  status: IPaymentStatus;
  transactionNo?: string; // ID from the payment gateway
  gatewayDataResponse?: any; // Raw data from gateway for debugging
}

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    finalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: PaymentMethod.options,
      required: true,
    },
    status: {
      type: String,
      enum: PaymentStatus.options,
      default: "pending",
    },
    transactionNo: { type: String, unique: true, sparse: true },
    gatewayDataResponse: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
export const Payment = mongoose.model<IPayment>("Payments", paymentSchema);
