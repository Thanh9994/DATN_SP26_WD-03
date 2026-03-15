import { CleanupLog } from '@api/modules/admin-dashboard/dashboard.model';
import { SeatTime } from '@api/modules/cinema-catalog/showtime/showtimeSeat.model';
import { Booking } from '@api/modules/sales-operations/booking/booking.model';
import { Payment } from '@api/modules/sales-operations/payments/payment.model';
import mongoose from 'mongoose';
import cron from 'node-cron';

let isProcessing = false;
export const initBookingCron = () => {
  // Chạy mỗi 30 giây
  cron.schedule('*/30 * * * * *', async () => {
    const session = await mongoose.startSession();
    if (isProcessing) return;
    isProcessing = true;
    try {
      session.startTransaction();
      const now = new Date();
      const expiredBookings = await Booking.find({
        status: 'pending',
        holdExpiresAt: { $lt: now },
      }).session(session);

      if (expiredBookings.length > 0) {
        const bookingIds = expiredBookings.map((b) => b._id);

        // Thu thập tất cả Seat IDs từ các booking hết hạn
        const allSeatIds = expiredBookings.flatMap((b) => b.seats);

        await Booking.updateMany(
          { _id: { $in: bookingIds } },
          { $set: { status: 'expired' } },
          { session },
        );

        await SeatTime.updateMany(
          {
            _id: { $in: allSeatIds },
            trang_thai: 'hold',
          },
          {
            $set: { trang_thai: 'empty' },
            $unset: { heldBy: '', holdExpiresAt: '', bookingId: '' },
          },
          { session },
        );

        console.log(`[Cron]: Đã xử lý ${bookingIds.length} đơn hàng và các ghế liên quan hết hạn.`);
      }

      await session.commitTransaction();
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.error('[Cron Error]:', error);
    } finally {
      isProcessing = false;
      session.endSession();
    }
  });

  //"Xóa booking đã hủy/hết hạn sau 2 ngày"
  cron.schedule('0 * * * *', async () => {
    const session = await mongoose.startSession();
    if (isProcessing) return;
    isProcessing = true;
    try {
      session.startTransaction();
      const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

      const expiredBookings = await Booking.find({
        status: 'expired',
        updatedAt: { $lt: cutoff },
      }).session(session);

      const cancelledBookings = await Booking.find({
        status: 'cancelled',
        updatedAt: { $lt: cutoff },
      }).session(session);

      const allBookings = [...expiredBookings, ...cancelledBookings];
      if (allBookings.length > 0) {
        const bookingIds = allBookings.map((b) => b._id);
        const allSeatIds = allBookings.flatMap((b) => b.seats);

        await SeatTime.updateMany(
          {
            _id: { $in: allSeatIds },
            bookingId: { $in: bookingIds },
            trang_thai: 'hold',
          },
          {
            $set: { trang_thai: 'empty' },
            $unset: { heldBy: '', holdExpiresAt: '', bookingId: '' },
          },
          { session },
        );

        await Booking.deleteMany({ _id: { $in: bookingIds } }, { session });

        console.log(
          `[Cron]: Đã xóa ${expiredBookings.length} expired, ${cancelledBookings.length} cancelled quá 2 ngày.`,
        );
        await CleanupLog.create({
          type: 'booking',
          details: {
            expired: expiredBookings.length,
            cancelled: cancelledBookings.length,
          },
        });
      }

      // --- Payment cleanup ---
      const failedPayments = await Payment.find({
        status: 'failed',
        updatedAt: { $lt: cutoff },
      }).session(session);

      if (failedPayments.length > 0) {
        const paymentIds = failedPayments.map((p) => p._id);

        await Payment.deleteMany({ _id: { $in: paymentIds } }, { session });

        console.log(
          `[Cron]: Đã xóa ${failedPayments.length} failed payments quá 2 ngày.`,
        );
        await CleanupLog.create({
          type: 'payment',
          details: {
            failed: failedPayments.length,
          },
        });
      }

      await session.commitTransaction();
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.error('[Cron Error]:', error);
    } finally {
      isProcessing = false;
      session.endSession();
    }
  });
};
