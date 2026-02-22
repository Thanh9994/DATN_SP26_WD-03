import { IGenre } from "@shared/schemas";
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema<IGenre>(
    {
        name: String,
    },
    { timestamps: true }
);

export default mongoose.model<IGenre>("Genre", genreSchema);