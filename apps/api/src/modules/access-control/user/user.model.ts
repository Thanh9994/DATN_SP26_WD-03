import { IUser, UserRole, UserStatus } from "@shared/schemas";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    ho_ten: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: UserRole.options,
      default: "khach_hang",
    },
    trang_thai: {
      type: String,
      enum: UserStatus.options,
      default: "active",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
