import mongoose, { Schema } from "mongoose";
import { BookingStatus, IBooking, PaymentMethod } from "@shared/schemas";

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    showTimeId: {
      type: Schema.Types.ObjectId,
      ref: "ShowTime",
      required: true,
    },
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShowTimeSeat",
        required: true,
      },
    ],
    movieName: String,
    showTimeString: String,
    theaterName: String,
    seatCodes: {
      type: [String],
      required: true,
    },
    items: {
      type: [
        {
          snackDrinkId: {
            type: Schema.Types.ObjectId,
            ref: "SnackDrink",
          },
          name: String,
          quantity: Number,
          price: Number,
        },
      ],
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: BookingStatus.options,
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: PaymentMethod.options,
      default: "vnpay",
    },
    paymentId: {
      type: String,
    },
    transactionCode: {
      type: String,
    },
    holdExpiresAt: {
      type: Date,
    },
    ticketCode: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);
bookingSchema.index({ userId: 1, createdAt: -1 });

// Index phục vụ cho cron-job quét các booking hết hạn thanh toán
bookingSchema.index({ status: 1, holdExpiresAt: 1 });
bookingSchema.index({ createdAt: 1, status: 1 });
export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
