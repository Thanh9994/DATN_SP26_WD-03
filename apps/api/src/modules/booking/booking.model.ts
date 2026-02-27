import mongoose from "mongoose";
import { BookingStatus } from "@shared/schemas";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    showTimeId: { type: String, required: true },
    seats: [{ type: String }],
    totalAmount: Number,
    status: {
      type: String,
      enum: BookingStatus.options,
      default: "pending",
    },
    paymentId: String,
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);