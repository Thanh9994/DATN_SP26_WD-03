import { IUser, UserRole, UserStatus } from "@shared/schemas";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<IUser>(
  {
    ho_ten: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
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
    avatar: {
      public_id: String,
      url: String,
      customName: String,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
