import mongoose from "mongoose";
import { ICinema, IPhong, ISeats } from "@shared/types/interface";

const SeatsSchema = new mongoose.Schema<ISeats>({
    hang_ghe: String,
    so_ghe: Number,
    loai_ghe: { type: String, enum: ['thuong', 'vip', 'couple'] }
})

const phongSchema = new mongoose.Schema<IPhong>({
    ten_phong: String,
    loai_phong: { type: String, enum: ['2D', '3D', 'IMAX', '4DX'] },
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
