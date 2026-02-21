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
        danh_gia: { 
            type: Number, 
            default: 0 
        },

        trang_thai: {
            type: String,
            enum: ["sap_chieu", "dang_chieu", "ngung_chieu"],
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
            enum: ['P', 'C13', 'C16', 'C18']
        },

        ngon_ngu: String,
        phu_de: [ String ],
    },
    { timestamps: true }
)

export default mongoose.model<IMovie>("movie", MovieSchema)
