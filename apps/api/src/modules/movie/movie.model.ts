import { AgeRating, IMovie, MovieStatus } from "@shared/schemas";
import mongoose from "mongoose";

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
        danh_gia: { 
            type: Number, 
            default: 0 
        },

        trang_thai: {
            type: String,
            enum: MovieStatus.options,
            default: 'sap_chieu',
        },
        the_loai: [
            {
                name: String,
            },
        ],

        rap_chieu: [
            {
                name: String,
                address: String,
                city: String,
                phong_chieu: Array,
            },
        ],
        
        quoc_gia: String,
        dao_dien: String,
        dien_vien: [ String ],
        do_tuoi: {
            type: String,
            enum: AgeRating.options,
        },

        ngon_ngu: String,
        phu_de: [ String ],
    },
    { timestamps: true }
)

export default mongoose.model<IMovie>("movie", MovieSchema)
