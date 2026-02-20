import mongoose from "mongoose";
import { ISnackDrink } from "@shared/types/interface";

const snackDrinkSchema = new mongoose.Schema<ISnackDrink>({
    name: String,
    price: Number,
    image: {
        public_id: String,
        url: String,
    },
})

export default mongoose.model("product",snackDrinkSchema)