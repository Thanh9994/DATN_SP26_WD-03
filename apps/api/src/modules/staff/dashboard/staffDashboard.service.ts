import { Booking } from '../../sales-operations/booking/booking.model';
import { ShowTimeM } from '../../cinema-catalog/showtime/showtime.model';

export const staffDashboardService = {
  getTodayRange() {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return { now, startOfDay, endOfDay };
  },

  async getOverview() {
    const { now, startOfDay, endOfDay } = this.getTodayRange();

    const [todayPaidTickets, todayCheckedInTickets, upcomingShowtimes, todayLateCheckins] =
      await Promise.all([
        Booking.countDocuments({
          status: 'paid',
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        }),
        Booking.countDocuments({
          status: 'da_lay_ve',
          pickedUpAt: { $gte: startOfDay, $lte: endOfDay },
        }),
        ShowTimeM.countDocuments({
          startTime: {
            $gte: now,
            $lte: new Date(now.getTime() + 10 * 60 * 1000),
          },
        }),
        Booking.aggregate([
          {
            $match: {
              status: 'da_lay_ve',
              pickedUpAt: { $gte: startOfDay, $lte: endOfDay },
            },
          },
          {
            $lookup: {
              from: 'showtimes',
              localField: 'showTimeId',
              foreignField: '_id',
              as: 'showTime',
            },
          },
          { $unwind: '$showTime' },
          {
            $match: {
              $expr: {
                $gt: ['$pickedUpAt', '$showTime.startTime'],
              },
            },
          },
          { $count: 'total' },
        ]),
      ]);

    return {
      todayPaidTickets,
      todayCheckedInTickets,
      upcomingShowtimes,
      todayLateCheckins: todayLateCheckins[0]?.total || 0,
    };
  },

  async getUpcomingShows() {
    const now = new Date();
    const next60Minutes = new Date(now.getTime() + 60 * 60 * 1000);

    const showtimes = await ShowTimeM.find({
      startTime: { $gte: now, $lte: next60Minutes },
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
      .sort({ startTime: 1 })
      .limit(10);

    return showtimes.map((item: any) => {
      const diffMinutes = Math.max(
        0,
        Math.floor((new Date(item.startTime).getTime() - now.getTime()) / (1000 * 60)),
      );

      return {
        _id: item._id,
        movieName: item.movieId?.ten_phim || '---',
        roomName: item.roomId?.ten_phong || '---',
        cinemaName: item.roomId?.cinema_id?.name || '---',
        startTime: item.startTime,
        diffMinutes,
      };
    });
  },

  async getRecentCheckins() {
    const { startOfDay, endOfDay } = this.getTodayRange();

    const bookings = await Booking.find({
      status: 'da_lay_ve',
      pickedUpAt: { $gte: startOfDay, $lte: endOfDay },
    })
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
      })
      .sort({ pickedUpAt: -1 })
      .limit(10);

    return bookings.map((booking: any) => {
      const showTime = booking.showTimeId as any;
      const movie = showTime?.movieId as any;
      const room = showTime?.roomId as any;
      const cinema = room?.cinema_id as any;

      const pickedUpAt = booking.pickedUpAt ? new Date(booking.pickedUpAt) : null;
      const startTime = showTime?.startTime ? new Date(showTime.startTime) : null;

      const isLateCheckin =
        !!pickedUpAt && !!startTime && pickedUpAt.getTime() > startTime.getTime();

      const lateMinutes =
        isLateCheckin && pickedUpAt && startTime
          ? Math.floor((pickedUpAt.getTime() - startTime.getTime()) / (1000 * 60))
          : 0;

      return {
        _id: booking._id,
        ticketCode: booking.ticketCode,
        pickedUpAt: booking.pickedUpAt,
        movieName: movie?.ten_phim || '---',
        roomName: room?.ten_phong || '---',
        cinemaName: cinema?.name || '---',
        isLateCheckin,
        lateMinutes,
      };
    });
  },
};