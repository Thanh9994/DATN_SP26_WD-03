import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "./config/db";
import { initAllCrons } from "./utils/initCron";

const startServer = async () => {
  try {
    await connectDB();
    const cloudStatus = process.env.CLOUD_NAME ? "Connected" : "Missing";
    const PORT = process.env.PORT;
    const ENV = process.env.NODE_ENV;

    app.listen(PORT, () => {
      initAllCrons();
      console.log(
        `🚀 API Ready |🌐 Port: ${process.env.PORT} |🔗 MongoDB: Connected |🖼️  Cloudinary: ${cloudStatus} |🚀 Mode: ${ENV?.toUpperCase()}`,
      );
      console.log(`🚀 Mode: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Không thể khởi động server:", error);
    process.exit(1); // Dừng nếu lỗi nghiêm trọng
  }
};
startServer();
