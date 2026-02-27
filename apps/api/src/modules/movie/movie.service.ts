import { IMovie } from "@shared/schemas";
import movieModel from "./movie.model";

export const movieService = {
  async getAllMovie() {
    return await movieModel.find().populate("the_loai", "name");
  },
  async getMovieById(id: string) {
    return await movieModel.findById(id);
  },
  async createMovie(data: IMovie) {
    const movie = new movieModel(data);
    return await movie.save();
  },
  async updateMovie(id: string, data: IMovie) {
    const oldMovie = await movieModel.findById(id);
    if (!oldMovie) return null;
    const updateData = {
      ...data,
      poster: data.poster ?? oldMovie.poster, // ✅ giữ poster cũ
    };
    return await movieModel.findByIdAndUpdate(id, updateData, { new: true });
  },
  async deleteMovie(id: string) {
    return await movieModel.findByIdAndDelete(id);
  },
};
