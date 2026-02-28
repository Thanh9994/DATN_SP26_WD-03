import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import testRoute from "./modules/test/test.route";
import genreRouter from "./modules/movie-content/genre/genre.route";
import uploadRouter from "./middlewares/upload";
import movieRouter from "./modules/movie-content/movie/movie.route";
import productRouter from "./modules/products/product.route";
import catalogRouter from "./modules/cinema-catalog";
import accessRouter from "./modules/access-control";
import contentRouter from "./modules/movie-content";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/test", testRoute);
app.use("/api/uploads", uploadRouter);
app.use("/api/product", productRouter);
app.use("/api/access", accessRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/content", contentRouter);

app.listen(process.env.PORT, () => {
  console.log(`🚀 API running at http://localhost:${process.env.PORT}`);
});
