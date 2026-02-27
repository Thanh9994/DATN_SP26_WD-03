import { SeatType } from "@shared/schemas";
import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema(
  {
    hang_ghe: String,
    so_ghe: Number,
    loai_ghe: {
      type: String,
      enum: SeatType.options,
      required: true,
    },
  },
  { _id: false }
);

const RoomSchema = new mongoose.Schema(
  {
    cinema_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
      index: true,
    },

    ten_phong: { type: String, required: true },
    loai_phong: { type: String, required: true },

    ghe_layout: [SeatSchema], // layout ghế gốc
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", RoomSchema);