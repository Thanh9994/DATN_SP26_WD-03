import { movieService } from "./movie.service";
import { ShowTimeM } from "../../cinema-catalog/showtime/showtime.model";
import { calcMovieStatus } from "@api/utils/assets/movie.status";
import { catchAsync } from "@api/utils/catchAsync";
import { AppError } from "@api/middlewares/error.middleware";

export const movieController = {
  getAllMovie: catchAsync(async (_req, res) => {
    const movies = await movieService.getAllMovie();
    const movieIdStrings = movies.map((movie) => movie._id.toString());
    const showtimeCounts = await ShowTimeM.aggregate([
      { $addFields: { movieIdStr: { $toString: "$movieId" } } },
      { $match: { movieIdStr: { $in: movieIdStrings } } },
      { $group: { _id: "$movieIdStr", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      showtimeCounts.map((item) => [item._id.toString(), item.count]),
    );

    const moviesWithStatus = movies.map((movie) => ({
      ...movie.toObject(),
      trang_thai: calcMovieStatus(movie.ngay_cong_chieu, movie.ngay_ket_thuc),
      showtimeCount: countMap.get(movie._id.toString()) ?? 0,
    }));
    res.status(200).json({
      success: true,
      message: "Lấy danh sách phim thành công",
      data: moviesWithStatus,
    });
  }),

  getMovieById: catchAsync(async (req, res, next) => {
    const movie = await movieService.getMovieById(req.params.id);

    if (!movie) {
      return next(new AppError("Không tìm thấy phim này", 404));
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  }),

  createMovie: catchAsync(async (req, res) => {
    const movieData = req.body;
    const newMovie = await movieService.createMovie(movieData);

    res.status(201).json({
      success: true,
      message: "Tạo phim mới thành công",
      data: newMovie,
    });
  }),

  updateMovie: catchAsync(async (req, res, next) => {
    const updatedMovie = await movieService.updateMovie(
      req.params.id,
      req.body,
    );

    if (!updatedMovie) {
      return next(new AppError("Không tìm thấy phim để cập nhật", 404));
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật phim thành công",
      data: updatedMovie,
    });
  }),

  deleteMovie: catchAsync(async (req, res, next) => {
    const deletedMovie = await movieService.deleteMovie(req.params.id);

    if (!deletedMovie) {
      return next(new AppError("Không tìm thấy phim để xóa", 404));
    }

    res.status(200).json({
      success: true,
      message: "Xóa phim thành công",
    });
  }),
};
