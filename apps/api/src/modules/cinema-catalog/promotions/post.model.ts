import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: "promotion",
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["promotion", "event", "news"],
      default: "promotion",
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);