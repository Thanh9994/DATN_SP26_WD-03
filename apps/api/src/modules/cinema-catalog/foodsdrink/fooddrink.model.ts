import mongoose, { Schema } from "mongoose";

const foodDrinkSchema = new Schema(
  {
    ten_mon: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    mo_ta: {
      type: String,
      default: "",
    },

    loai: {
      type: String,
      enum: ["food", "drink", "combo"],
      required: true,
    },

    gia_ban: {
      type: Number,
      required: true,
      min: 0,
    },

    hinh_anh: {
      type: String,
      default: "",
    },

    la_noi_bat: {
      type: Boolean,
      default: false,
    },

    kha_dung: {
      type: Boolean,
      default: true,
    },

    so_luong_ton: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const FoodDrink = mongoose.model(
  "snackdrinks",
  foodDrinkSchema
);