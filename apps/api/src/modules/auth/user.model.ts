import { IUser, UserRole, UserStatus } from "@shared/schemas";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<IUser>(
  {
    ho_ten: String,
    email: String,
    password: String,
    phone: Number,
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

export const UserModel = mongoose.model<IUser>("User", userSchema);
