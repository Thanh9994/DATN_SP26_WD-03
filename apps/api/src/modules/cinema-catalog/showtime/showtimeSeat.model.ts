import mongoose, { Schema } from "mongoose";
import { IShowTimeSeat, SeatsStatus, SeatType } from "@shared/schemas";

const showTimeSeatSchema = new Schema<IShowTimeSeat>(
  {
    showTimeId: {
      type: Schema.Types.ObjectId,
      ref: "ShowTime",
      required: true,
      index: true,
    },
    seatCode: { type: String, required: true },
    row: { type: String, required: true },
    number: { type: Number, required: true },
    loai_ghe: {
      type: String,
      enum: SeatType.options,
      required: true,
    },
    price: { type: Number, required: true },
    trang_thai: {
      type: String,
      enum: SeatsStatus.options,
      default: "empty",
      index: true,
    },
    heldBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    holdExpiresAt: Date,
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  { timestamps: true },
);

showTimeSeatSchema.index({ showTimeId: 1, seatCode: 1 }, { unique: true });
showTimeSeatSchema.index({ showTimeId: 1, trang_thai: 1 });
showTimeSeatSchema.index({ holdExpiresAt: 1 });

export const SeatTime = mongoose.model<IShowTimeSeat>(
  "ShowTimeSeat",
  showTimeSeatSchema,
);
