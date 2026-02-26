import mongoose, { Schema } from "mongoose";
import { IShowTimeSeat } from "@shared/schemas";

const showTimeSeatSchema = new Schema<IShowTimeSeat>(
  {
    showTimeId: { type: String, required: true, index: true },
    seatCode: { type: String, required: true },
    row: { type: String, required: true },
    number: { type: Number, required: true },
    loai_ghe: { type: String, required: true },
    price: { type: Number, required: true },
    trang_thai: { type: String, default: "empty" },
    heldBy: { type: String },
    holdExpiresAt: { type: Date },
  },
  { timestamps: true },
);

showTimeSeatSchema.index({ showTimeId: 1, seatCode: 1 }, { unique: true });

export const SeatTime = mongoose.model<IShowTimeSeat>(
  "ShowTimeSeat",
  showTimeSeatSchema,
);