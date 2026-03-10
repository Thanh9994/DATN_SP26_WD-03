import { RoomType, IPhong } from "@shared/schemas";
import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    cinema_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
      index: true,
    },

    ten_phong: { type: String, required: true },
    loai_phong: {
      type: String,
      enum: RoomType.options,
      required: true,
    },
    rows: [
      {
        name: { type: String, required: true },
        seats: { type: Number, required: true },
        _id: false,
      },
    ],
    vip: { type: [String], default: [] },
    couple: { type: [String], default: [] },
    // ghe_layout: [SeatSchema], // layout ghế gốc
  },
  { timestamps: true },
);

export const Room = mongoose.model<IPhong>("Room", RoomSchema);
