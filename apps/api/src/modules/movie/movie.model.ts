import { CloudinaryImage } from "./../../../../../packages/shared/schemas/index";
import { AgeRating, IMovie, MovieStatus } from "@shared/schemas";
import mongoose, { Types } from "mongoose";

const MovieSchema = new mongoose.Schema<IMovie>(
  {
    ten_phim: String,
    mo_ta: String,
    thoi_luong: Number,

    ngay_cong_chieu: Date,
    ngay_ket_thuc: Date,

    poster: {
        url: String,
        public_id: String,
    },
    trailer: String,
    danh_gia: {
      type: Number,
      default: 0,
    },

    trang_thai: {
      type: String,
      enum: MovieStatus.options,
      default: "sap_chieu",
    },
    the_loai: [
      {
        type: Types.ObjectId,
        ref: "genre",
        required: true,
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
    dien_vien: [String],
    do_tuoi: {
      type: String,
      enum: AgeRating.options,
    },

    ngon_ngu: String,
    phu_de: [String],
  },
  { timestamps: true },
);

export default mongoose.model<IMovie>("Movie", MovieSchema);
