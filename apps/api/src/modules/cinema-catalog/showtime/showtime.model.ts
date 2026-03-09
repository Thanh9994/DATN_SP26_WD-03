import { ShowTimeStatus } from "@shared/schemas";
import mongoose, { Schema } from "mongoose";
import { IShowTime } from "@shared/schemas";

const showTimeSchema = new Schema<IShowTime>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    status: {
      type: String,
      // Ép kiểu enum để chỉ nhận các giá trị trong IShowTimeStatus
      enum: ShowTimeStatus.options,
      default: "upcoming",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    priceNormal: { type: Number, required: true },
    priceVip: { type: Number, required: true },
    priceCouple: { type: Number, required: true },
  },
  { timestamps: true },
);

export const ShowTimeM = mongoose.model<IShowTime>("ShowTime", showTimeSchema);
