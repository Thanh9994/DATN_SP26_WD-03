import { PaymentMethod } from "@shared/schemas";
import mongoose from "mongoose";

export interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  finalAmount: number;
  paymentMethod: string; // 'vnpay', 'momo', etc.
  status: "pending" | "success" | "failed";
  transactionNo?: string; // ID from the payment gateway
  gatewayData?: any; // Raw data from gateway for debugging
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
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    transactionNo: { type: String, unique: true, sparse: true },
    gatewayData: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Payment = mongoose.model<IPayment>("Payments", paymentSchema);
