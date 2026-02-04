import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { connectDB } from "./config/db";
import testRoute from "./modules/test/test.route";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/test", testRoute);

app.listen(process.env.PORT, () => {
  console.log(`🚀 API running at http://localhost:${process.env.PORT}`);
});
