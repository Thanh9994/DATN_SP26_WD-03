import mongoose from 'mongoose';

const cleanupLogSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['booking', 'payment'], required: true },
    details: { type: Object, required: true }, // { expired: 10, cancelled: 5, failed: 2 }
    createdAt: { type: Date, default: Date.now },
    notified: { type: Boolean, default: false }, // đã gửi notify cho admin chưa
  },
  { timestamps: true },
);

export const CleanupLog = mongoose.model('CleanupLog', cleanupLogSchema);
