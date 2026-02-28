import mongoose from "mongoose";
import { BookingStatus } from "@shared/schemas";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    showTimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowTime",
      required: true,
    },
    // Chứa danh sách các ID của ghế từ bảng ShowTimeSeat
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShowTimeSeat",
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: BookingStatus.options,
      default: "pending",
    },
    paymentId: {
      type: String, // Mã giao dịch từ Stripe/ZaloPay/Momo
    },
  },
  { timestamps: true },
);

bookingSchema.index({ userId: 1, createdAt: -1 });
export const Booking = mongoose.model("Booking", bookingSchema);
