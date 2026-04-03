import mongoose, { Schema, Document } from 'mongoose';

export interface ITrackingEvent extends Document {
  eventType: 'play' | 'pause' | 'exit' | 'click_banner' | 'search' | 'visit_page' | 'watch_time';
  movieId?: mongoose.Types.ObjectId;
  movieName?: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  duration?: number;
  userAgent?: string;
  ip?: string;
  referrer?: string;
  extraData?: any;
}

const TrackingEventSchema = new Schema<ITrackingEvent>(
  {
    eventType: {
      type: String,
      enum: ['play', 'pause', 'exit', 'click_banner', 'search', 'visit_page', 'watch_time'],
      required: true,
    },
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie' },
    movieName: { type: String },
    userId: { type: String },
    sessionId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Number },
    userAgent: { type: String },
    ip: { type: String },
    referrer: { type: String },
    extraData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Index cho query nhanh
TrackingEventSchema.index({ timestamp: -1 });
TrackingEventSchema.index({ eventType: 1, timestamp: -1 });
TrackingEventSchema.index({ movieId: 1 });

export const TrackingEvent = mongoose.model<ITrackingEvent>('TrackingEvent', TrackingEventSchema);