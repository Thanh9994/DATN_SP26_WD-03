import { Request, Response } from "express";
import { movieService } from "./movie.service";
import { calcMovieStatus } from "@shared/utils/movieStatus";
import movieModel from "./movie.model";

export const movieController = {
  async getAllMovie(_req: Request, res: Response) {
    try {
      const movies = await movieService.getAllMovie();

      const moviesWithStatus = movies.map((movie) => ({
        ...movie.toObject(),
        trang_thai: calcMovieStatus(movie.ngay_cong_chieu, movie.ngay_ket_thuc),
      }));
      res.status(200).json({
        message: "Lấy danh sách phim thành công",
        data: moviesWithStatus,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },

  async getMovieById(req: Request, res: Response) {
    try {
      const movie = await movieService.getMovieById(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Không tìm thấy phim" });
      }
      res.status(200).json({
        message: "Lấy thông tin phim thành công",
        data: movie,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },

  async createMovie(req: Request, res: Response) {
    try {
      //   console.log("REQ BODY POSTER:", req.body.poster);
      const movieData = req.body;
      const newMovie = await movieService.createMovie(movieData);
      res.status(201).json({
        message: "Tạo phim mới thành công",
        data: newMovie,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },

  async updateMovie(req: Request, res: Response) {
    try {
      const movie = await movieService.getMovieById(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Không tìm thấy phim" });
      }
      const data = {
        ...req.body,
        poster: req.body.poster || movie.poster,
      };
      const updatedMovie = await movieService.updateMovie(req.params.id, data);

      res.status(200).json({
        message: "Cập nhật phim thành công",
        data: updatedMovie,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },

  async deleteMovie(req: Request, res: Response) {
    try {
      const deletedMovie = await movieService.deleteMovie(req.params.id);
      if (!deletedMovie) {
        return res.status(404).json({ message: "Không tìm thấy phim để xóa" });
      }
      res.status(200).json({
        message: "Xóa phim thành công",
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
};
