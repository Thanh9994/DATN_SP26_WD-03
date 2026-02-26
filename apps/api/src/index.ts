import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import testRoute from "./modules/test/test.route";
import genreRouter from "./modules/genre/genre.route";
import cinemaRouter from "./modules/cinema/cinema.route";
import uploadRouter from "./middlewares/upload";
import movieRouter from "./modules/movie/movie.route";
import productRouter from "./modules/products/product.route";
import usersRouter from "./modules/auth/user.route";
import roomRouter from "./modules/room/room.route";
import showTimeRouter from "./modules/showtime/showtime.route";



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/test", testRoute);
app.use("/api/genres", genreRouter);
app.use("/api/cinemas", cinemaRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/movies", movieRouter);
app.use("/api/product", productRouter);
app.use("/api/auth", usersRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/showtimes", showTimeRouter);

app.listen(process.env.PORT, () => {
  console.log(`🚀 API running at http://localhost:${process.env.PORT}`);
});
