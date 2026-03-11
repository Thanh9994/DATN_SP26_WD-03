import mongoose, { Schema } from "mongoose";
import { ICinema } from "@shared/schemas";

const cinemaSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    danh_sach_phong: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  },
  { timestamps: true },
);

export const Cinemas = mongoose.model<ICinema>("Cinema", cinemaSchema);
