import { ICinema, IPhong, ISeats, RoomType, SeatType } from "@shared/schemas";
import mongoose from "mongoose";

const SeatsSchema = new mongoose.Schema<ISeats>({
    hang_ghe: String,
    so_ghe: Number,
    loai_ghe: { type: String, enum: SeatType.options }
})

const phongSchema = new mongoose.Schema<IPhong>({
    ten_phong: String,
    loai_phong: { type: String, enum: RoomType.options },
    ghe: [SeatsSchema],
})

const cinemaSchema = new mongoose.Schema<ICinema>({
    name: String,
    address: String,
    city: String,
    phong_chieu: [phongSchema],
},
    {timestamps: true}
);

export default mongoose.model("cinema", cinemaSchema)
