import { IUser, UserRole, UserStatus } from '@shared/src/schemas';
import mongoose from 'mongoose';

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

    workAt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: function () {
        return this.role !== 'khach_hang' && this.role !== 'admin';
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: UserRole.options,
      default: 'khach_hang',
    },
    trang_thai: {
      type: String,
      enum: UserStatus.options,
      default: 'inactive',
    },
    isVerified: { type: Boolean, default: false },
    lastLogin: Date,
    otpCode: {
      type: String,
    },
    otpExpire: {
      type: Date,
    },
  },

  { timestamps: true },
);

userSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'userId',
});

export const User = mongoose.model<IUser>('User', userSchema);
