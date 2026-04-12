import { Booking } from '@api/modules/sales-operations/booking/booking.model';
import { ShowTimeM } from '@api/modules/cinema-catalog/showtime/showtime.model';
import * as MailService from '@api/common/mail.service';
import { AppError } from '@api/middlewares/error.middleware';

export const staffService = {
  buildCheckinLateMeta(booking: any) {
    const showTime = booking?.showTimeId as any;
    const movie = showTime?.movieId as any;
    const room = showTime?.roomId as any;
    const cinema = room?.cinema_id as any;

    const startTime = showTime?.startTime ? new Date(showTime.startTime) : null;
    const now = new Date();

    const diffMs = startTime ? now.getTime() - startTime.getTime() : 0;
    const isLateCheckin = !!startTime && diffMs > 0;
    const lateMinutes = isLateCheckin ? Math.floor(diffMs / (1000 * 60)) : 0;

    return {
      isLateCheckin,
      lateMinutes,
      warningMessage: isLateCheckin
        ? `Khach da check-in tre ${lateMinutes} phut sau gio chieu.`
        : null,
      movieName: movie?.ten_phim || '---',
      roomName: room?.ten_phong || '---',
      cinemaName: cinema?.name || '---',
      startTime: showTime?.startTime || null,
    };
  },

  async checkinTicketWithWarning(ticketCode: string) {
    const normalizedCode = ticketCode?.trim().toUpperCase();

    if (!normalizedCode) {
      throw new AppError('Ticket code khong hop le.', 400);
    }

    const booking = await Booking.findOne({ ticketCode: normalizedCode })
      .populate('userId', 'ho_ten email')
      .populate({
        path: 'showTimeId',
        populate: [
          { path: 'movieId', select: 'ten_phim' },
          {
            path: 'roomId',
            select: 'ten_phong cinema_id',
            populate: {
              path: 'cinema_id',
              select: 'name',
            },
          },
        ],
      });

    if (!booking) {
      throw new AppError('Khong tim thay ve voi ticket code nay.', 404);
    }

    const meta = this.buildCheckinLateMeta(booking);

    if (booking.status === 'da_lay_ve' || booking.status === 'picked_up') {
      return {
        success: true,
        message: 'Ve da duoc check-in truoc do.',
        status: booking.status,
        ticketCode: booking.ticketCode,
        pickedUpAt: booking.pickedUpAt,
        ...meta,
      };
    }

    if (booking.status !== 'paid') {
      throw new AppError('Ve chua o trang thai co the check-in.', 400);
    }

    booking.status = 'da_lay_ve';
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
          customerName: user?.ho_ten || 'Khach hang',
          ticketCode: booking.ticketCode || normalizedCode,
          pickedUpAt: booking.pickedUpAt,
          movieName: movie?.ten_phim || '---',
          seatCodes: booking.seatCodes || [],
          showDate: showTime?.startTime
            ? new Date(showTime.startTime).toLocaleDateString('vi-VN', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '---',
          showTime: showTime?.startTime
            ? new Date(showTime.startTime).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '---',
          cinemaName: cinema?.name || '---',
          roomName: room?.ten_phong || '---',
          status: 'Da nhan ve',
        }),
      ).catch((error) => {
        console.error('Send pickup mail failed:', error);
      });
    }

    return {
      success: true,
      message: meta.isLateCheckin
        ? `Check-in thanh cong, nhung khach da den tre ${meta.lateMinutes} phut.`
        : 'Check-in ve thanh cong.',
      status: booking.status,
      ticketCode: booking.ticketCode,
      pickedUpAt: booking.pickedUpAt,
      ...meta,
    };
  },

  async getUpcomingShowtimeAlerts() {
    const now = new Date();
    const next10Minutes = new Date(now.getTime() + 10 * 60 * 1000);
    const past30Minutes = new Date(now.getTime() - 30 * 60 * 1000);

    const showtimes = await ShowTimeM.find({
      startTime: { $gte: past30Minutes, $lte: next10Minutes },
    })
      .populate('movieId', 'ten_phim')
      .populate({
        path: 'roomId',
        select: 'ten_phong cinema_id',
        populate: {
          path: 'cinema_id',
          select: 'name',
        },
      })
      .sort({ startTime: 1 });

    return showtimes.map((showtime: any) => {
      const start = new Date(showtime.startTime);
      const diffMinutes = Math.floor((start.getTime() - now.getTime()) / (1000 * 60));

      if (diffMinutes >= 0) {
        return {
          showTimeId: showtime._id,
          movieName: showtime.movieId?.ten_phim || '---',
          roomName: showtime.roomId?.ten_phong || '---',
          cinemaName: showtime.roomId?.cinema_id?.name || '---',
          startTime: showtime.startTime,
          diffMinutes,
          type: 'sap_bat_dau',
          message: `${showtime.roomId?.ten_phong || 'Phong'} con ${diffMinutes} phut nua chieu`,
        };
      }

      return {
        showTimeId: showtime._id,
        movieName: showtime.movieId?.ten_phim || '---',
        roomName: showtime.roomId?.ten_phong || '---',
        cinemaName: showtime.roomId?.cinema_id?.name || '---',
        startTime: showtime.startTime,
        diffMinutes,
        type: 'da_bat_dau',
        message: `${showtime.roomId?.ten_phong || 'Phong'} da chieu ${Math.abs(diffMinutes)} phut`,
      };
    });
  },
};