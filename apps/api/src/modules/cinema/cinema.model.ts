import { RoomType, SeatsStatus, SeatType } from "@shared/schemas";
import mongoose from "mongoose";

const SeatsSchema = new mongoose.Schema(
  {
    hang_ghe: String,
    so_ghe: Number,
    loai_ghe: { type: String, enum: SeatType.options, required: true },
    trang_thai: {
      type: String,
      enum: SeatsStatus.options,
      default: "trong", // 🔥 thêm default cho chắc
    },
  },
  { _id: false },
);

const phongSchema = new mongoose.Schema(
  {
    ten_phong: String,
    loai_phong: { type: String, enum: RoomType.options, required: true },
    ghe: { type: [SeatsSchema], default: [] },
  },
  { _id: true },
);

const cinemaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phong_chieu: { type: [phongSchema], default: [] },
  },
  { timestamps: true },
);
export type CinemaDoc = mongoose.InferSchemaType<typeof cinemaSchema>;

export default mongoose.model<CinemaDoc>("Cinema", cinemaSchema);
