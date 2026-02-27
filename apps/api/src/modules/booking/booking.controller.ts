import { Request, Response } from 'express';
import mongoose from "mongoose";
import { SeatTime } from "../showtime/showtimeSeat.model";
import { Booking } from './booking.model';

export const holdSeats = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { showTimeId, seats, userId } = req.body;

    const now = new Date();
    const holdExpires = new Date(now.getTime() + 5 * 60 * 1000);

    const seatDocs = await SeatTime.find({
      showTimeId,
      seatCode: { $in: seats },
      trang_thai: "empty",
    }).session(session);

    if (seatDocs.length !== seats.length) {
      throw new Error("Có ghế đã bị giữ hoặc đặt");
    }

    await SeatTime.updateMany(
      {
        showTimeId,
        seatCode: { $in: seats },
      },
      {
        trang_thai: "hold",
        heldBy: userId,
        holdExpiresAt: holdExpires,
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({ message: "Giữ ghế thành công" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: err });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { showTimeId, seats, userId, paymentId } = req.body;

    const seatDocs = await SeatTime.find({
      showTimeId,
      seatCode: { $in: seats },
      heldBy: userId,
      trang_thai: "hold",
    }).session(session);

    if (seatDocs.length !== seats.length) {
      throw new Error("Ghế không hợp lệ hoặc hết hạn giữ");
    }

    await SeatTime.updateMany(
      {
        showTimeId,
        seatCode: { $in: seats },
      },
      {
        trang_thai: "booked",
        $unset: { heldBy: "", holdExpiresAt: "" },
      },
      { session },
    );

    const total = seatDocs.reduce((sum, s) => sum + s.price, 0);

    const booking = await Booking.create(
      [
        {
          userId,
          showTimeId,
          seats,
          totalAmount: total,
          status: "paid",
          paymentId,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Đặt vé thành công",
      data: booking,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: err });
  }
};