import * as dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "./config/db";
import { initAllCrons } from "./utils/initCron";

const startServer = async () => {
  try {
    await connectDB();
    console.log("🔗 MongoDB: Connected");
    const cloudStatus = process.env.CLOUD_NAME ? "Connected" : "Missing";
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      initAllCrons();
      console.log(
        `🚀 API Ready |🌐 Port: ${process.env.PORT} |🔗 MongoDB: Connected |🖼️  Cloudinary: ${cloudStatus}`,
      );
    });
  } catch (error) {
    console.error("❌ Không thể khởi động server:", error);
    process.exit(1); // Dừng nếu lỗi nghiêm trọng
  }
};
startServer();
