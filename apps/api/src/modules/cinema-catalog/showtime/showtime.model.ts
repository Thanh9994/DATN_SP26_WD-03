import { ShowTimeStatus } from '@shared/src/schemas';
import mongoose, { Schema } from 'mongoose';
import { IShowTime } from '@shared/src/schemas';

const showTimeSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    status: {
      type: String,
      // Ép kiểu enum để chỉ nhận các giá trị trong IShowTimeStatus
      enum: ShowTimeStatus.options,
      default: 'upcoming',
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    showDate: {
      type: String,
      required: true,
    },
    priceNormal: { type: Number, required: true },
    priceVip: { type: Number, required: true },
    priceCouple: { type: Number, required: true },
  },
  { timestamps: true },
);

showTimeSchema.index({ movieId: 1, startTime: 1 });
showTimeSchema.index({ movieId: 1, showDate: 1 });
showTimeSchema.index({ roomId: 1, startTime: 1 });
showTimeSchema.index({ status: 1, startTime: 1 });

export const ShowTimeM = mongoose.model<IShowTime>('ShowTime', showTimeSchema);
