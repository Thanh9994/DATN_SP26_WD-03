import mongoose from "mongoose";
import { SeatTime } from "../../cinema-catalog/showtime/showtimeSeat.model";
import { Booking } from "./booking.model";
import { randomUUID } from "crypto";
import * as MailService from "@api/common/mail.service";

import { AppError } from "@api/middlewares/error.middleware";

export const bookingService = {
  async holdSeats(showTimeId: string, seatCodes: string[], userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const holdDuration = 7 * 60 * 1000; // 7 phút
      const holdExpires = new Date(Date.now() + holdDuration);
      const now = new Date();
      const holdToken = randomUUID();
      //hủy booking đang giữ cũ

      const existingBooking = await Booking.findOne(
        {
          userId,
          showTimeId,
          status: "pending",
          holdExpiresAt: { $gt: new Date() },
        },
        null,
        { session },
      );

      const newSeatCodes = seatCodes;

      if (existingBooking) {
        // release ghế cũ
        await SeatTime.updateMany(
          {
            _id: { $in: existingBooking.seats },
            bookingId: existingBooking._id,
          },
          {
            $set: { trang_thai: "empty" },
            $unset: { heldBy: "", holdExpiresAt: "", bookingId: "" },
          },
          { session },
        );
      }

      const seats = await SeatTime.find({
        showTimeId,
        seatCode: { $in: newSeatCodes },
      }).session(session);

      if (seats.length !== newSeatCodes.length) {
        throw new AppError("Một số ghế không tồn tại.", 404);
      }
      const seatIds = seats.map((s) => s._id);

      // khóa ghế
      for (const seat of seats) {
        const seatLock = await SeatTime.findOneAndUpdate(
          {
            _id: seat._id,
            showTimeId,
            $or: [
              { trang_thai: "empty" },
              {
                trang_thai: "hold",
                heldBy: userId,
              },
              {
                trang_thai: "hold",
                holdExpiresAt: { $lt: now },
              },
            ],
          },
          {
            $set: {
              trang_thai: "hold",
              heldBy: userId,
              holdExpiresAt: holdExpires,
            },
          },
          { session, new: true },
        );

        if (!seatLock) {
          throw new AppError(
            "Một số ghế vừa được người khác chọn. Vui lòng chọn lại.",
            400,
          );
        }
      }

      const totalAmount = seats.reduce((sum, s) => sum + (s.price || 0), 0);

      let booking;

      if (existingBooking) {
        existingBooking.seats = seatIds;
        existingBooking.seatCodes = newSeatCodes;
        existingBooking.totalAmount = totalAmount;
        existingBooking.finalAmount = totalAmount;
        existingBooking.holdExpiresAt = holdExpires;
        existingBooking.holdToken = holdToken;

        booking = await existingBooking.save({ session });
      } else {
        [booking] = await Booking.create(
          [
            {
              userId,
              showTimeId,
              seats: seatIds,
              seatCodes: newSeatCodes,
              totalAmount,
              finalAmount: totalAmount,
              status: "pending",
              holdToken,
              holdExpiresAt: holdExpires,
            },
          ],
          { session },
        );
      }

      await SeatTime.updateMany(
        { _id: { $in: seatIds } },
        {
          $set: {
            bookingId: booking._id,
          },
        },
        { session },
      );

      await session.commitTransaction();

      return {
        booking,
        holdToken,
        expiresAt: holdExpires,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error; // catchAsync bắt và đẩy về globalErrorHandler
    } finally {
      session.endSession();
    }
  },

  //Xác nhận đặt vé và tạo hóa đơn

  async updateBookingItems(
    bookingId: string,
    holdToken: string,
    userId: string,
    items: Array<{
      snackDrinkId: string;
      name: string;
      quantity: number;
      price: number;
    }>,
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findOne({
        _id: bookingId,
        userId,
      }).session(session);

      if (!booking) {
        throw new AppError("Booking khong ton tai.", 404);
      }

      if (booking.status !== "pending") {
        throw new AppError("Chi cap nhat combo khi booking dang pending.", 400);
      }

      if (booking.holdToken !== holdToken) {
        throw new AppError("Phien giu ghe khong hop le.", 400);
      }

      if (booking.holdExpiresAt && booking.holdExpiresAt < new Date()) {
        throw new AppError("Phien giu ghe da het han.", 400);
      }

      const normalizedItems = (items || [])
        .filter((item) => item && item.snackDrinkId && Number(item.quantity) > 0)
        .map((item) => ({
          snackDrinkId: item.snackDrinkId,
          name: item.name,
          quantity: Number(item.quantity),
          price: Math.max(Number(item.price || 0), 0),
        }));

      const seats = await SeatTime.find({
        _id: { $in: booking.seats },
      })
        .select("price")
        .session(session);

      const ticketTotal = seats.reduce((sum, seat) => sum + Number(seat.price || 0), 0);
      const comboTotal = normalizedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      booking.items = normalizedItems as any;
      booking.totalAmount = ticketTotal + comboTotal;
      booking.finalAmount = Math.max(booking.totalAmount - Number(booking.discountAmount || 0), 0);

      await booking.save({ session });
      await session.commitTransaction();

      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async confirmBooking(bookingId: string, paymentId: string, userId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    }).session(session);

    if (!booking) {
      throw new AppError("Booking không tồn tại.", 404);
    }

    const now = new Date();
    if (booking.holdExpiresAt && booking.holdExpiresAt < now) {
      throw new AppError("Booking đã hết thời gian thanh toán.", 400);
    }

    if (booking.status === "paid") {
      await session.commitTransaction();
      return booking;
    }

    if (booking.status !== "pending") {
      await session.commitTransaction();
      return booking;
    }

    const seatUpdate = await SeatTime.updateMany(
      {
        _id: { $in: booking.seats },
        bookingId: booking._id,
        trang_thai: "hold",
        heldBy: booking.userId,
      },
      {
        $set: { trang_thai: "booked" },
        $unset: { heldBy: "", holdExpiresAt: "" },
      },
      { session },
    );

    if (seatUpdate.modifiedCount !== booking.seats.length) {
      throw new AppError("Một số ghế không còn hợp lệ để xác nhận.", 400);
    }

    booking.status = "paid";
    booking.paymentId = paymentId;
    booking.transactionCode = paymentId;
    booking.ticketCode =
      "TIC-" + randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

    await booking.save({ session });
    await session.commitTransaction();

    const fullBooking = await Booking.findById(booking._id)
      .populate("userId", "ho_ten email")
      .populate({
        path: "showTimeId",
        populate: [
          { path: "movieId", select: "ten_phim" },
          {
            path: "roomId",
            select: "ten_phong cinema_id",
            populate: {
              path: "cinema_id",
              select: "name",
            },
          },
        ],
      });

    if (fullBooking) {
      const user = fullBooking.userId as any;
      const showTime = fullBooking.showTimeId as any;
      const movie = showTime?.movieId as any;
      const room = showTime?.roomId as any;
      const cinema = room?.cinema_id as any;

      if (user?.email) {
        MailService.sendMail(
          MailService.getBookingSuccessTemplate({
            email: user.email,
            customerName: user?.ho_ten || "Khach hang",
            ticketCode: fullBooking.ticketCode || "---",
            movieName: movie?.ten_phim || "---",
            seatCodes: fullBooking.seatCodes || [],
            showDate: showTime?.startTime
              ? new Date(showTime.startTime).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "---",
            showTime: showTime?.startTime
              ? new Date(showTime.startTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "---",
            cinemaName: cinema?.name || "---",
            roomName: room?.ten_phong || "---",
            totalAmount: fullBooking.finalAmount || fullBooking.totalAmount || 0,
            paymentMethod: fullBooking.paymentMethod || "---",
            bookedAt: fullBooking.createdAt ? new Date(fullBooking.createdAt) : undefined,
          }),
        ).catch((error) => {
          console.error("Send booking success mail failed:", error);
        });
      }
    }

    return booking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
},

  //Tự động giải phóng ghế hết hạn (Dùng cho Cron job)
  async releaseExpiredBookings() {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const now = new Date();

      const expiredBookings = await Booking.find({
        status: "pending",
        holdExpiresAt: { $lt: now },
      }).session(session);

      if (expiredBookings.length === 0) {
        await session.commitTransaction();
        return 0;
      }

      const bookingIds = expiredBookings.map((b) => b._id);

      await SeatTime.updateMany(
        {
          bookingId: { $in: bookingIds },
          trang_thai: "hold",
        },
        {
          $set: { trang_thai: "empty" },
          $unset: { heldBy: "", holdExpiresAt: "", bookingId: "" },
        },
        { session },
      );

      const result = await Booking.updateMany(
        { _id: { $in: bookingIds } },
        { $set: { status: "expired" } },
        { session },
      );

      await session.commitTransaction();
      // console.log(`[Release] Đã hủy ${result.modifiedCount} đơn hàng hết hạn.`);
      return result.modifiedCount;
    } catch (error) {
      await session.abortTransaction();
      // console.error("Lỗi khi giải phóng ghế:", error);
      throw error;
    } finally {
      session.endSession();
    }
  },

  async cancelBooking(bookingId: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const booking = await Booking.findOne({ _id: bookingId, userId }).session(
        session,
      );

      if (!booking || booking.status !== "pending") {
        throw new AppError(
          "Không thể hủy đơn hàng này hoặc đơn hàng không tồn tại.",
          400,
        );
      }
      if (!booking) return;

      booking.status = "cancelled";

      await SeatTime.updateMany(
        { _id: { $in: booking.seats }, bookingId: booking._id },
        {
          $set: { trang_thai: "empty" },
          $unset: { heldBy: "", holdExpiresAt: "", bookingId: "" },
        },
        { session },
      );

      // Đổi trạng thái đơn
      await booking.save({ session });

      await session.commitTransaction();
      return { success: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async expireBooking(bookingId: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const booking = await Booking.findOne({ _id: bookingId, userId }).session(
        session,
      );

      if (!booking || booking.status !== "pending") {
        throw new AppError(
          "Không thể hủy đơn hàng này hoặc đơn hàng không tồn tại.",
          400,
        );
      }

      await SeatTime.updateMany(
        { _id: { $in: booking.seats }, bookingId: booking._id },
        {
          $set: { trang_thai: "empty" },
          $unset: { heldBy: "", holdExpiresAt: "", bookingId: "" },
        },
        { session },
      );

      booking.status = "expired";
      await booking.save({ session });

      await session.commitTransaction();
      return { success: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

 async checkinTicketByCode(ticketCode: string) {
  const normalizedCode = ticketCode?.trim().toUpperCase();

  if (!normalizedCode) {
    throw new AppError("Ticket code khong hop le.", 400);
  }

  const booking = await Booking.findOne({ ticketCode: normalizedCode })
    .populate("userId", "ho_ten email")
    .populate({
      path: "showTimeId",
      populate: [
        { path: "movieId", select: "ten_phim" },
        {
          path: "roomId",
          select: "ten_phong cinema_id",
          populate: {
            path: "cinema_id",
            select: "name",
          },
        },
      ],
    });

  if (!booking) {
    throw new AppError("Khong tim thay ve voi ticket code nay.", 404);
  }

  if (booking.status === "da_lay_ve" || booking.status === "picked_up") {
    return booking;
  }

  if (booking.status !== "paid") {
    throw new AppError("Ve chua o trang thai co the check-in.", 400);
  }

  booking.status = "da_lay_ve";
  booking.pickedUpAt = new Date();
  await booking.save();

  const user = booking.userId as any;
  const showTime = booking.showTimeId as any;
  const movie = showTime?.movieId as any;
  const room = showTime?.roomId as any;
  const cinema = room?.cinema_id as any;

  const userEmail = user?.email;
  if (userEmail) {
    MailService.sendMail(
      MailService.getTicketPickupTemplate({
        email: userEmail,
        customerName: user?.ho_ten || "Khach hang",
        ticketCode: booking.ticketCode || normalizedCode,
        pickedUpAt: booking.pickedUpAt,
        movieName: movie?.ten_phim || "---",
        seatCodes: booking.seatCodes || [],
        showDate: showTime?.startTime
          ? new Date(showTime.startTime).toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "---",
        showTime: showTime?.startTime
          ? new Date(showTime.startTime).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "---",
        cinemaName: cinema?.name || "---",
        roomName: room?.ten_phong || "---",
        status: "Da nhan ve",
      }),
    ).catch((error) => {
      console.error("Send pickup mail failed:", error);
    });
  }

  return booking;
},
};
