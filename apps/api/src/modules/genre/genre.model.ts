import { IGenre } from "@shared/schemas";
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema<IGenre>(
    {
        name: String,
    },
    { timestamps: true }
);

export const Genre = mongoose.model<IGenre>("genre", genreSchema);