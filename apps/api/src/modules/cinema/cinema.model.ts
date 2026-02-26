import mongoose, { Schema, Types } from "mongoose";
import { RoomType } from "@shared/schemas";

const phongSchema = new Schema(
  {
    ten_phong: { type: String, required: true },
    loai_phong: {
      type: String,
      enum: RoomType.options,
      required: true,
    },
    rows: { type: [String], required: true },
    seatsPerRow: { type: Number, required: true },
    vipRows: { type: [String], default: [] },
  },
  { _id: true },
);

const cinemaSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phong_chieu: { type: [phongSchema], default: [] },
  },
  { timestamps: true },
);

export interface CinemaDocument extends mongoose.Document {
  name: string;
  address: string;
  city: string;
  phong_chieu: Types.DocumentArray<any>;
}

export const Cinemas = mongoose.model<CinemaDocument>(
  "Cinema",
  cinemaSchema,
);