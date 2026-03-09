import { IMovie } from "@shared/schemas";
import { Movie } from "./movie.model";

export const movieService = {
  async getAllMovie() {
    return await Movie.find().populate("the_loai", "name");
  },
  async getMovieById(id: string) {
    return await Movie.findById(id).populate("the_loai", "name");
  },
  async createMovie(data: IMovie) {
    return await Movie.create(data);
  },
  async updateMovie(id: string, data: Partial<IMovie>) {
    const oldMovie = await Movie.findById(id);
    if (!oldMovie) return null;
    const updateData = {
      ...data,
      poster: data.poster ?? oldMovie.poster, // ✅ giữ poster cũ
    };
    return await Movie.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  },
  async deleteMovie(id: string) {
    return await Movie.findByIdAndDelete(id);
  },
};
