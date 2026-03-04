import mongoose from "mongoose";
import { SeatTime } from "../../cinema-catalog/showtime/showtimeSeat.model";
import { Booking } from "./booking.model";

export const bookingService = {
  async holdSeats(showTimeId: string, seatCodes: string[], userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const holdExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

      const result = await SeatTime.updateMany(
        {
          showTimeId,
          seatCode: { $in: seatCodes },
          trang_thai: "empty",
        },
        {
          $set: {
            trang_thai: "hold",
            heldBy: userId,
            holdExpiresAt: holdExpires,
          },
        },
        { session },
      );
      // Nếu số lượng ghế update không khớp với số lượng yêu cầu -> Có ghế đã bị tranh chấp
      if (result.modifiedCount !== seatCodes.length) {
        throw new Error("Một số ghế đã được chọn hoặc không còn trống.");
      }
      const seats = await SeatTime.find({
        showTimeId,
        seatCode: { $in: seatCodes },
      }).session(session);

      const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);

      // TẠO LUÔN BOOKING PENDING
      const [newBooking] = await Booking.create(
        [
          {
            userId,
            showTimeId,
            seats: seats.map((s) => s._id),
            seatCodes,
            totalAmount,
            finalAmount: totalAmount, // Tạm thời bằng nhau nếu chưa có voucher
            status: "pending",
            holdExpiresAt: holdExpires,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return { booking: newBooking, expiresAt: holdExpires };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  //Xác nhận đặt vé và tạo hóa đơn

  async confirmBooking(bookingId: string, paymentId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findById(bookingId)
        .populate("userId")
        .populate({
          path: "showTimeId",
          populate: { path: "movieId" },
        })
        .session(session);
      if (!booking || booking.status !== "pending") {
        throw new Error("Giao dịch không hợp lệ.");
      }
      // Chuyển trạng thái ghế sang 'booked'
      const seats = await SeatTime.updateMany(
        { _id: { $in: booking.seats }, trang_thai: "hold" },
        {
          $set: { trang_thai: "booked" },
          $unset: { heldBy: "", holdExpiresAt: "" },
        },
        { session },
      );

      booking.status = "paid";
      booking.paymentId = paymentId;
      booking.ticketCode = `TIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
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
      const allSeatIds = expiredBookings.flatMap((b) => b.seats);

      await SeatTime.updateMany(
        {
          _id: { $in: allSeatIds },
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
      console.log(`[Release] Đã hủy ${result.modifiedCount} đơn hàng hết hạn.`);
      return result.modifiedCount;
    } catch (error) {
      await session.abortTransaction();
      console.error("Lỗi khi giải phóng ghế:", error);
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
        throw new Error("Không thể hủy đơn hàng này.");
      }

      await SeatTime.updateMany(
        { _id: { $in: booking.seats } },
        {
          $set: { trang_thai: "empty" },
          $unset: { heldBy: "", holdExpiresAt: "", bookingId: "" },
        },
        { session },
      );

      // Đổi trạng thái đơn
      booking.status = "cancelled";
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
};
