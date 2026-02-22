import { IMovie } from "@shared/schemas";
import movieModel from "./movie.model"

export const movieService = {
    async getAllMovie() {
        return await movieModel.find()
    },
    async getMovieById(id: string) {
        return await movieModel.findById(id);
    },
    async createMovie(data: IMovie) {
        const movie = new movieModel(data)
        return await movie.save()
    },
    async updateMovie(id: string, data: IMovie) {
        return await movieModel.findByIdAndUpdate(id, data, {new: true});
    },
    async deleteMovie(id: string) {
        return await movieModel.findByIdAndDelete(id)
    }
}
