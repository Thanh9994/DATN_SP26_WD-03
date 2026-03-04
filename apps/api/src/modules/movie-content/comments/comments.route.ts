import express from "express";
import { Comments } from "./comments.model";
import { AppError } from "@api/middlewares/error.middleware";
import { catchAsync } from "@api/utils/catchAsync";

const commentRouter = express.Router();

commentRouter.post(
  "/",
  catchAsync(async (req, res, next) => {
    const { content, rating, userId, movieId } = req.body;
    if (!content || !rating || !userId || !movieId) {
      return next(
        new AppError("Vui lòng cung cấp đầy đủ thông tin bình luận", 400),
      );
    }
    const newComment = await Comments.create({
      content,
      rating,
      userId,
      movieId,
    });

    res.status(201).json({
      success: true,
      message: "Đã đăng bình luận thành công",
      data: newComment,
    });
  }),
);

commentRouter.get(
  "/movie/:movieId",
  catchAsync(async (req, res, next) => {
    const { movieId } = req.params;
    // .populate("userId", "name avatar") giúp lấy thêm tên và ảnh của người dùng thay vì chỉ có ID
    const comments = await Comments.find({ movieId })
      .populate("userId", "name avatar")
      .sort("-createdAt"); // Bình luận mới nhất lên đầu

    res.status(200).json({
      success: true,
      results: comments.length,
      data: comments,
    });
  }),
);

commentRouter.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const comment = await Comments.findById(req.params.id).populate(
      "userId",
      "name",
    );

    if (!comment) {
      return next(new AppError("Không tìm thấy bình luận này", 404));
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  }),
);

export default commentRouter;
