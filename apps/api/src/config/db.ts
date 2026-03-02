import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/daten";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`🚀 MongoDB connected at ${MONGO_URI}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    // exit or rethrow depending on desired behavior:
    process.exit(1);
  }
};
