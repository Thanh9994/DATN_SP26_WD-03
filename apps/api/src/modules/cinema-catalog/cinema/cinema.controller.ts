import { Request, Response } from "express";
import { Cinemas } from "./cinema.model";

export const AllCinemas = async (_req: Request, res: Response) => {
  try {
    const cinemas = await Cinemas.find().populate("danh_sach_phong");
    res.status(200).json({
      message: "Lấy danh sách rạp thành công",
      data: cinemas,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const getCinemaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cinema = await Cinemas.findById(id);
    if (!cinema) {
      return res.status(404).json({ message: "Rạp không tồn tại" });
    }
    res.status(200).json({
      message: "Lấy thông tin rạp thành công",
      data: cinema,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const createCinema = async (req: Request, res: Response) => {
  try {

    const newCinema = await Cinemas.create(req.body);
    res.status(201).json({
      message: "Tạo rạp thành công",
      data: newCinema,
    });
  } catch (error) {
    res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      error,
    });
  }
};

export const updateCinema = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { _id, ...updateData } = req.body;

    const updatedCinemas = await Cinemas.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedCinemas) {
      return res.status(404).json({ message: "Rạp không tồn tại" });
    }
    res.status(200).json({
      message: "Cập nhật rạp thành công",
      data: updatedCinemas,
    });
  } catch (error) {
    res.status(400).json({ message: "Cập nhật thất bại", error });
  }
};

export const addRoomsToCinema = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { phongIds } = req.body; 

    const updatedCinema = await Cinemas.findByIdAndUpdate(
      id,
      { $addToSet: { danh_sach_phong: { $each: phongIds } } }, // Tránh add trùng ID phòng
      { new: true }
    ).populate("danh_sach_phong");

    if (!updatedCinema) {
      return res.status(404).json({ message: "Rạp không tồn tại" });
    }

    res.status(200).json({
      message: "Đã thêm phòng vào rạp thành công",
      data: updatedCinema,
    });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm phòng", error });
  }
};

export const deleteCinema = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Cinemas.findByIdAndDelete(id);
    res.status(200).json({
      message: "Xóa rạp thành công",
    });
  } catch (error) {
    res.status(400).json({ message: "Xóa thất bại", error });
  }
};
