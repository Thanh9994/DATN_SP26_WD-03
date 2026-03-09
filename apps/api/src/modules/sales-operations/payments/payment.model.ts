import mongoose, { Document, Schema } from "mongoose";
import { Booking } from "../booking/booking.model";
import { User } from "@api/modules/access-control/user/user.model";

export interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  method: string; // 'vnpay', 'momo', etc.
  status: "pending" | "success" | "failed";
  transactionNo?: string; // ID from the payment gateway
  gatewayData?: any; // Raw data from gateway for debugging
}

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    transactionNo: { type: String },
    gatewayData: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
