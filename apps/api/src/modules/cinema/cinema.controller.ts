import { generateSeats } from "@shared/script/seatsGenerate";
import { Request, Response } from "express";
import { CreateCinema } from "@shared/schemas";
import { Cinemas } from "./cinema.model";

export const AllCinemas = async (_req: Request, res: Response) => {
  try {
    const cinemas = await Cinemas.find();
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
    const cinemaPayload = CreateCinema.parse(req.body);

    const newCinema = await Cinemas.create({
      name: cinemaPayload.name,
      address: cinemaPayload.address,
      city: cinemaPayload.city,
      phong_chieu: cinemaPayload.phong_chieu.map((room) => ({
        ten_phong: room.ten_phong,
        loai_phong: room.loai_phong,
        rows: room.rows,
        seatsPerRow: room.seatsPerRow,
        vipRows: room.vipRows || [],
      })),
    });


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
    const updatedCinemas = await Cinemas.findByIdAndUpdate(
      id,
      req.body,
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
