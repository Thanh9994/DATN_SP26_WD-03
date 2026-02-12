import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import testRoute from "./modules/test/test.route";
import genreRouter from "./modules/genre/genre.route";
import cinemaRouter from "./modules/cinema/cinema.route";
import uploadRouter from "./middlewares/upload";



const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/test", testRoute);
app.use("/api/genres", genreRouter);
app.use("/api/cinemas", cinemaRouter);
app.use("/api/uploads", uploadRouter);

app.listen(process.env.PORT, () => {
  console.log(`🚀 API running at http://localhost:${process.env.PORT}`);
});
