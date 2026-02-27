import { ISnackDrink } from "@shared/schemas";
import mongoose from "mongoose";

const snackDrinkSchema = new mongoose.Schema<ISnackDrink>({
  name: String,
  price: Number,
  image: {
    public_id: String,
    url: String,
  },
});

export default mongoose.model("product", snackDrinkSchema);
