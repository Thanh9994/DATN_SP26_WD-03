import * as dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "./config/db";

connectDB();
const cloudStatus = process.env.CLOUD_NAME ? "Connected" : "Missing";

app.listen(process.env.PORT, () => {
  console.log(
    `🚀 API Ready |🌐 Port: ${process.env.PORT} |🔗 MongoDB: Connected |🖼️  Cloudinary: ${cloudStatus}`,
  );
});
