import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuXqeIFfJ3K9cX43NXgLGxfWvV8G5Fby9Rpg&s",
    },
    originalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCombo: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "products",
  }
);

export default mongoose.model("Product", productSchema);