import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
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

    thumbnail: {
      url: String,
      public_id: String,
    },

    type: {
      type: String,
      enum: ["promotion", "event", "news"],
      default: "promotion",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    startDate: Date,
    endDate: Date,
  },
  { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);
