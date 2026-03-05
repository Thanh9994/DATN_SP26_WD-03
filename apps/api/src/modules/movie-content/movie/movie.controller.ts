import { movieService } from "./movie.service";
import { calcMovieStatus } from "@api/utils/movie.status";
import { catchAsync } from "@api/utils/catchAsync";
import { AppError } from "@api/middlewares/error.middleware";

export const movieController = {
  getAllMovie: catchAsync(async (_req, res) => {
    const movies = await movieService.getAllMovie();

    const moviesWithStatus = movies.map((movie) => ({
      ...movie.toObject(),
      trang_thai: calcMovieStatus(movie.ngay_cong_chieu, movie.ngay_ket_thuc),
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
