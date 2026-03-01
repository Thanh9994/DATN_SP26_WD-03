import mongoose, { ClientSession } from "mongoose";
import { SeatTime } from "../../cinema-catalog/showtime/showtimeSeat.model";
import { Booking } from "./booking.model";

export const bookingService = {
  /**
   * Giữ ghế tạm thời
   */
  async holdSeats(showTimeId: string, seatCodes: string[], userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const holdExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

      // Cập nhật trạng thái ghế: Chỉ update những ghế đang là 'empty'
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

      await session.commitTransaction();
      return { success: true, expiresAt: holdExpires };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Xác nhận đặt vé và tạo hóa đơn
   */
  async confirmBooking(payload: {
    showTimeId: string;
    seatCodes: string[];
    userId: string;
    paymentId?: string;
  }) {
    const { showTimeId, seatCodes, userId, paymentId } = payload;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Kiểm tra và lấy thông tin ghế (đảm bảo vẫn đang được giữ bởi đúng User)
      const seatDocs = await SeatTime.find({
        showTimeId,
        seatCode: { $in: seatCodes },
        heldBy: userId,
        trang_thai: "hold",
      }).session(session);

      if (seatDocs.length !== seatCodes.length) {
        throw new Error("Phiên giữ ghế đã hết hạn hoặc không hợp lệ.");
      }

      // 2. Chuyển trạng thái ghế sang 'booked'
      await SeatTime.updateMany(
        { _id: { $in: seatDocs.map((s) => s._id) } },
        {
          $set: { trang_thai: "booked" },
          $unset: { heldBy: "", holdExpiresAt: "" },
        },
        { session },
      );

      // 3. Tính tổng tiền
      const totalAmount = seatDocs.reduce((sum, s) => sum + s.price, 0);

      // 4. Tạo Booking record (Lưu mảng ObjectId của ghế)
      const [newBooking] = await Booking.create(
        [
          {
            userId,
            showTimeId,
            seats: seatDocs.map((s) => s._id), // Lưu ObjectId thay vì seatCode
            totalAmount,
            status: "paid",
            paymentId,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return newBooking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Tự động giải phóng ghế hết hạn (Dùng cho Cron job)
   */
  async releaseExpiredSeats() {
    const result = await SeatTime.updateMany(
      {
        trang_thai: "hold",
        holdExpiresAt: { $lt: new Date() },
      },
      {
        $set: { trang_thai: "empty" },
        $unset: { heldBy: "", holdExpiresAt: "" },
      },
    );
    return result.modifiedCount;
  },
};
