import { IGenre } from "@shared/types/interface";
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema<IGenre>(
    {
        name: String,
    },
    { timestamps: true }
);

export default mongoose.model("Genre", genreSchema);