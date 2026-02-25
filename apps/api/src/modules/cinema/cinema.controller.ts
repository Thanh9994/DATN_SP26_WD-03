import { Request, Response } from "express";
import cinemaModel from "./cinema.model";

export const AllCinemas = async (_req: Request, res: Response) => {
  try {
    const cinemas = await cinemaModel.find();
    res.status(200).json({
      message: "Lấy danh sách rạp thành công",
      data: cinemas,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getCinemaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cinema = await cinemaModel.findById(id);
    if (!cinema) {
      return res.status(404).json({ message: "Rạp không tồn tại" });
    }
    res.status(200).json({
      message: "Lấy thông tin rạp thành công",
      data: cinema,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
  try {
    const { id } = req.params;
    const cinema = await cinemaModel.findById(id);
    if (!cinema) {
      return res.status(404).json({ message: "Rạp không tồn tại" });
    }
    res.status(200).json({
      message: "Lấy thông tin rạp thành công",
      data: cinema,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const createCinema = async (req: Request, res: Response) => {
  try {
    const newCinema = await cinemaModel.create(req.body);
    res.status(201).json({
      message: "Tạo rạp mới thành công",
      data: newCinema,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
  try {
    const newCinema = await cinemaModel.create(req.body);
    res.status(201).json({
      message: "Tạo rạp mới thành công",
      data: newCinema,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const updateCinema = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedCinema = await cinemaModel.findByIdAndUpdate(
      id,
      { ...updateData, $inc: { views: 1 } },
      { new: true },
    );
    if (!updatedCinema) {
      return res.status(404).json({ message: "Rạp không tồn tại" });
    }
    res.status(200).json({
      message: "Cập nhật rạp thành công",
      data: updatedCinema,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedCinema = await cinemaModel.findByIdAndUpdate(
      id,
      { ...updateData, $inc: { views: 1 } },
      { new: true },
    );
    if (!updatedCinema) {
      return res.status(404).json({ message: "Rạp không tồn tại" });
    }
    res.status(200).json({
      message: "Cập nhật rạp thành công",
      data: updatedCinema,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteCinema = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await cinemaModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Xóa rạp thành công",
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};