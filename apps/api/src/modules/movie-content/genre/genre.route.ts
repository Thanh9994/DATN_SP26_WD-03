import express from "express";
// import express, { NextFunction, Request, Response } from "express";
import { Genre } from "./genre.model";
import { catchAsync } from "@api/utils/catchAsync";
import { AppError } from "@api/middlewares/error.middleware";

const genreRouter = express.Router();

genreRouter.get(
  "/",
  catchAsync(async (_req, res) => {
    const genres = await Genre.find();
    res.json({ success: true, data: genres });
  }),
);

genreRouter.post(
  "/",
  catchAsync(async (req, res) => {
    const genre = new Genre(req.body);
    await genre.save();
    res.status(201).json({ success: true, data: genre });
  }),
);

genreRouter.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) {
      return next(new AppError("Không tìm thấy thể loại này", 404));
    }
    res.json({ success: true, message: "Genre xóa thành công" });
  }),
);

export default genreRouter;
