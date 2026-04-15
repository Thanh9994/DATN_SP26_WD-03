import { bookingService } from './booking.service';
import { Booking } from './booking.model';
import { getBookingAnalytics } from '@api/utils/booking/booking.analytics';
import { catchAsync } from '@api/utils/catchAsync';
import { AppError } from '@api/middlewares/error.middleware';
import QRCode from 'qrcode';

export const bookingController = {
  holdSeats: catchAsync(async (req, res, next) => {
    const userId = req.user?._id;
    const { showTimeId, seats } = req.body;

    if (!userId) {
      return next(new AppError('Bạn cần đăng nhập để thực hiện hành động này', 401));
    }
    if (!showTimeId || !seats || seats.length === 0) {
      return next(new AppError('Thiếu thông tin suất chiếu hoặc ghế', 400));
    }
    const result = await bookingService.holdSeats(showTimeId, seats, userId);

    console.log(`✅ Booking created: ${result.booking._id}, amount: ${result.booking.totalAmount}`);

    res.status(201).json({
      success: true,
      message: 'Ghế đã được giữ trong 5 phút. Vui lòng thanh toán.',
      data: {
        bookingId: result.booking._id,
        holdToken: result.booking.holdToken,
        totalAmount: result.booking.totalAmount,
        expiresAt: result.expiresAt,
      },
    });
  }),

  confirmBooking: catchAsync(async (req, res, next) => {
    const userId = req.user!._id!.toString();
    const { bookingId, paymentId } = req.body;

    if (!bookingId) {
      return next(new AppError('Không tìm thấy mã đặt vé', 400));
    }

    const result = await bookingService.confirmBooking(bookingId, paymentId, userId);

    res.json({
      success: true,
      message: 'Thanh toán thành công! Vé đã được gửi vào email.',
      data: result,
    });
  }),

  updateBookingItems: catchAsync(async (req, res, next) => {
    const userId = req.user?._id;
    const { bookingId, holdToken, items = [] } = req.body;

    if (!userId) {
      return next(new AppError('Ban can dang nhap de thuc hien hanh dong nay', 401));
    }

    if (!bookingId || !holdToken) {
      return next(new AppError('Thieu bookingId hoac holdToken', 400));
    }

    const booking = await bookingService.updateBookingItems(bookingId, holdToken, userId, items);

    res.json({
      success: true,
      message: 'Cap nhat combo thanh cong',
      data: {
        bookingId: booking._id,
        totalAmount: booking.totalAmount,
        finalAmount: booking.finalAmount,
        items: booking.items,
      },
    });
  }),

  checkinTicket: catchAsync(async (req, res, next) => {
    const { ticketCode } = req.body;
    if (!ticketCode) {
      return next(new AppError('Thieu ticketCode', 400));
    }

    const result = await bookingService.checkinTicketByCode(ticketCode);

    res.json({
      success: true,
      message: 'Check-in ve thanh cong',
      data: result,
    });
  }),

  getBookingDetail: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate({
        path: 'showTimeId',
        populate: [
          { path: 'movieId' }, // Lấy thông tin phim
          {
            path: 'roomId', // Lấy thông tin phòng
            populate: { path: 'cinema_id' }, // Lấy thông tin rạp từ phòng
          },
        ],
      })
      .populate('userId', 'ho_ten email');

    if (!booking) return next(new AppError('Không tìm thấy đơn hàng', 404));

    let qrCodeDataUrl: string | null = null;
    if (['paid', 'da_lay_ve', 'picked_up'].includes(booking.status)) {
      const qrPayload = JSON.stringify({
        bookingId: booking._id?.toString(),
        ticketCode: booking.ticketCode || '',
        paymentId: booking.paymentId?.toString?.() || '',
      });
      qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 280,
      });
    }

    res.json({
      success: true,
      data: {
        ...booking.toObject(),
        qrCodeDataUrl,
      },
    });
  }),

  cancelBooking: catchAsync(async (req, res, next) => {
    const userId = req.user?._id;
    const { bookingId } = req.body;

    if (!userId) {
      return next(new AppError('Bạn cần đăng nhập để thực hiện hành động này', 401));
    }

    await bookingService.cancelBooking(bookingId, userId);

    res.json({
      success: true,
      message: 'Đã hủy giữ ghế thành công',
    });
  }),

  expireBooking: catchAsync(async (req, res, next) => {
    const userId = req.user?._id;
    const { bookingId } = req.body;

    if (!userId) {
      return next(new AppError('Bạn cần đăng nhập để thực hiện hành động này', 401));
    }

    await bookingService.expireBooking(bookingId, userId);

    res.json({
      success: true,
      message: 'Đã hủy giữ ghế thành công',
    });
  }),

  getPendingBooking: catchAsync(async (req, res) => {
    const { showtimeId } = req.params;
    const userId = req.user?._id;

    const booking = await Booking.findOne({
      userId,
      showTimeId: showtimeId,
      status: 'pending',
      holdExpiresAt: { $gt: new Date() },
    });

    if (!booking) {
      return res.json({
        success: true,
        data: null,
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  }),

  getMyBookings: catchAsync(async (req, res) => {
    const userId = req.user?._id;
    const status = (req.query.status as string) || 'paid';

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const statusFilter =
      status === 'paid' ? { $in: ['paid', 'da_lay_ve', 'picked_up'] } : status;

    const bookings = await Booking.find({ userId, status: statusFilter })
      .populate({
        path: 'showTimeId',
        populate: [
          { path: 'movieId', select: 'ten_phim poster' },
          {
            path: 'roomId',
            select: 'ten_phong cinema_id',
            populate: { path: 'cinema_id', select: 'name address' },
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  }),

  getDashboardStats: catchAsync(async (req, res) => {
    const { days = 7 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - Number(days));

    const stats = await getBookingAnalytics(startDate, endDate);

    const summary = stats.reduce(
      (acc, curr) => ({
        totalRevenue: acc.totalRevenue + curr.revenue,
        totalPaidOrders: acc.totalPaidOrders + curr.totalPaid,
        totalFailedOrders: acc.totalFailedOrders + curr.totalCancelled + curr.totalExpired,
      }),
      { totalRevenue: 0, totalPaidOrders: 0, totalFailedOrders: 0 },
    );

    res.status(200).json({
      success: true,
      summary,
      details: stats,
    });
  }),
};
