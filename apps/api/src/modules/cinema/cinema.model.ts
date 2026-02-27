import mongoose, { InferSchemaType, Schema} from "mongoose";
import { ICinema, RoomType } from "@shared/schemas";

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
    coupleRows: { type: [String], default: [] },
  },
  { _id: true },
);

const cinemaSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true },
);

// export type IPhong = InferSchemaType<typeof phongSchema>;
// export type ICinema = InferSchemaType<typeof cinemaSchema>;

export const Cinemas = mongoose.model<ICinema>(
  "Cinema",
  cinemaSchema,
);