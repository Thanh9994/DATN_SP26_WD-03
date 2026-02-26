import { generateSeats } from "@shared/script/seatsGenerate";
import { Request, Response } from "express";
import cinemaModel from "./cinema.model";
import { CreateCinema } from "@shared/schemas";

export const AllCinemas = async (_req: Request, res: Response) => {
  try {
    const cinemas = await cinemaModel.find();
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
    const cinemas = await cinemaModel.findById(id);
    if (!cinemas) {
      return res.status(404).json({ message: "Rạp không tồn tại" });
    }
    res.status(200).json({
      message: "Lấy thông tin rạp thành công",
      data: cinemas,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const createCinema = async (req: Request, res: Response) => {
  try {
    const cinema = CreateCinema.parse(req.body);

    const successRooms = cinema.phong_chieu.map((room) => {
      const seats = generateSeats(
        room.rows,
        room.seatsPerRow,
        room.vipRows || [],
        2,
      );

      return {
        ten_phong: room.ten_phong,
        loai_phong: room.loai_phong,
        ghe: seats,
      };
    });

    const newCinema = await cinemaModel.create({
      name: cinema.name,
      address: cinema.address,
      city: cinema.city,
      phong_chieu: successRooms,
    });

    res.status(201).json({
      message: "Tạo rạp thành công",
      data: newCinema,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      error,
    });
  }
};

export const updateCinema = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedCinemas = await cinemaModel.findByIdAndUpdate(
      id,
      { ...updateData, $inc: { views: 1 } },
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
    await cinemaModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Xóa rạp thành công",
    });
  } catch (error) {
    res.status(400).json({ message: "Xóa thất bại", error });
  }
};

export const bookSeats = async (req: Request, res: Response) => {
  try {
    const { cinemaId, roomId } = req.params;
    const { seats } = req.body; 

    const cinema = await cinemaModel.findById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ message: "Không tìm thấy rạp" });
    }

    const room = cinema.phong_chieu.id(roomId);
    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    for (const seatToBook of seats) {
      const seat = room.ghe.find(
        (s: any) =>
          s.hang_ghe === seatToBook.hang_ghe &&
          s.so_ghe === seatToBook.so_ghe
      );

      if (!seat) {
        return res.status(400).json({
          message: `Ghế ${seatToBook.hang_ghe}${seatToBook.so_ghe} không tồn tại`,
        });
      }

      if (seat.trang_thai === "da_dat") {
        return res.status(400).json({
          message: `Ghế ${seat.hang_ghe}${seat.so_ghe} đã được đặt`,
        });
      }

      seat.trang_thai = "da_dat";
    }

    await cinema.save();

    res.status(200).json({
      message: "Đặt ghế thành công",
      data: room.ghe,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const holdSeats = async (req: Request, res: Response) => {
  try {
    const { cinemaId, roomId } = req.params;
    const { seats } = req.body;

    const cinema = await cinemaModel.findById(cinemaId);
    if (!cinema) return res.status(404).json({ message: "Không tìm thấy rạp" });

    const room = cinema.phong_chieu.id(roomId);
    if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });

    const heldSeats: any[] = [];

    for (const seatReq of seats) {
      const seat = room.ghe.find(
        (s: any) =>
          s.hang_ghe === seatReq.hang_ghe &&
          s.so_ghe === seatReq.so_ghe
      );

      if (!seat)
        return res.status(400).json({ message: "Ghế không tồn tại" });

      if (seat.trang_thai !== "trong")
        return res.status(400).json({
          message: `Ghế ${seat.hang_ghe}${seat.so_ghe} không khả dụng`,
        });

      seat.trang_thai = "dang_giu";
      heldSeats.push(seat);

      // ⏳ Auto release sau 5 phút
      setTimeout(async () => {
        const updatedCinema = await cinemaModel.findById(cinemaId);
        if (!updatedCinema) return;

        const updatedRoom = updatedCinema.phong_chieu.id(roomId);
        if (!updatedRoom) return;

        const seatToRelease = updatedRoom.ghe.find(
          (s: any) =>
            s.hang_ghe === seatReq.hang_ghe &&
            s.so_ghe === seatReq.so_ghe
        );

        if (seatToRelease && seatToRelease.trang_thai === "dang_giu") {
          seatToRelease.trang_thai = "trong";
          await updatedCinema.save();
          console.log(`⏰ Ghế ${seatReq.hang_ghe}${seatReq.so_ghe} đã được trả`);
        }
      }, 5 * 60 * 1000); // 5 phút
    }

    await cinema.save();

    res.json({
      message: "Giữ ghế thành công (5 phút)",
      data: heldSeats,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const confirmSeats = async (req: Request, res: Response) => {
  try {
    const { cinemaId, roomId } = req.params;
    const { seats } = req.body;

    const cinema = await cinemaModel.findById(cinemaId);
    if (!cinema) return res.status(404).json({ message: "Không tìm thấy rạp" });

    const room = cinema.phong_chieu.id(roomId);
    if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });

    const confirmedSeats: any[] = [];

    for (const seatReq of seats) {
      const seat = room.ghe.find(
        (s: any) =>
          s.hang_ghe === seatReq.hang_ghe &&
          s.so_ghe === seatReq.so_ghe
      );

      if (!seat)
        return res.status(400).json({ message: "Ghế không tồn tại" });

      if (seat.trang_thai !== "dang_giu")
        return res.status(400).json({
          message: `Ghế ${seat.hang_ghe}${seat.so_ghe} không ở trạng thái giữ`,
        });

      seat.trang_thai = "da_dat";
      confirmedSeats.push(seat);
    }

    await cinema.save();

    res.json({
      message: "Xác nhận đặt ghế thành công",
      data: confirmedSeats,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};