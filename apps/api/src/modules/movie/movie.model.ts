import mongoose from "mongoose";
import { IMovie } from "@shared/types/interface";

const MovieSchema = new mongoose.Schema<IMovie> ( 
    {
        ten_phim: String,
        mo_ta: String,
        thoi_luong: Number,

        ngay_cong_chieu: Date,
        ngay_ket_thuc: Date,

        poster: {
            public_id: String,
            url: String,
        },
        trailer: String,
        danh_gia: Number,

        trang_thai: {
            type: String,
            enum: ["sap_chieu", "dang_chieu", "ngung_chieu"],
            default: 'sap_chieu',
        },
        the_loai: [
            { name: String }
        ],

        rap_chieu: [
            {
                name: String,
                address: String,
                city: String,
                phong_chieu: Array,
            },
        ],
    },
    { timestamps: true }
)

export default mongoose.model("movie", MovieSchema)