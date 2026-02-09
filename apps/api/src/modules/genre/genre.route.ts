import express from "express";
import genreModel from "./genre.model";

const genreRouter = express.Router();

genreRouter.get("/", async (_req, res) => {
  try {
    const genres = await genreModel.find();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

genreRouter.post("/", async (req, res) => {
  try {
    const genre = new genreModel(req.body);
    await genre.save();
    res.status(201).json(genre);
  } catch (error) {
    res.status(400).json({ error: "Failed" });
  }
});

genreRouter.delete("/:id", async (req, res) => {
  try {
    const genre = await genreModel.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).json({ error: "Genre Không thấy" });
    res.json({ message: "Genre xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: "Xóa không thành công genre" });
  }
});

export default genreRouter;