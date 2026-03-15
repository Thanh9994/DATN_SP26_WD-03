import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    summary: {
      type: String,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      enum: ['promotion', 'event', 'news'],
      default: 'promotion',
    },

    startDate: Date,
    endDate: Date,
  },
  { timestamps: true },
);

export const Post = mongoose.model('Post', postSchema);
