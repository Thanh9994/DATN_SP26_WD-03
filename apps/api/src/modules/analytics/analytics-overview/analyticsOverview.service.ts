import { Booking } from '../../sales-operations/booking/booking.model';

type OverviewQuery = {
  startDate?: string;
  endDate?: string;
};

type MatchStage = {
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
};

type SummaryResult = {
  totalRevenue: number;
  totalTickets: number;
  totalBookings: number;
};

type RevenueByDateResult = {
  _id: string;
  revenue: number;
  tickets: number;
  bookings: number;
};

type TopMovieResult = {
  movieName: string;
  revenue: number;
  tickets: number;
  bookings: number;
};

type TopCinemaResult = {
  theaterName: string;
  revenue: number;
  tickets: number;
  bookings: number;
};

class AnalyticsOverviewService {
  async getOverview(query: OverviewQuery) {
    const matchStage = this.buildMatchStage(query);

    const [summary, revenueByDate, topMovies, topCinemas] = await Promise.all([
      this.getSummary(matchStage),
      this.getRevenueByDate(matchStage),
      this.getTopMovies(matchStage),
      this.getTopCinemas(matchStage),
    ]);

    return {
      summary,
      charts: {
        revenueByDate,
      },
      topMovies,
      topCinemas,
    };
  }

  private buildMatchStage(query: OverviewQuery): MatchStage {
    const { startDate, endDate } = query;
    const matchStage: MatchStage = {};

    if (startDate || endDate) {
      matchStage.createdAt = {};

      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchStage.createdAt.$lte = end;
      }
    }

    return matchStage;
  }

  private async getSummary(matchStage: MatchStage) {
    const result = (await Booking.aggregate([
      { $match: matchStage },
      {
        $project: {
          totalAmount: { $ifNull: ['$totalAmount', 0] },
          ticketCount: {
            $size: { $ifNull: ['$seatCodes', []] },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalTickets: { $sum: '$ticketCount' },
          totalBookings: { $sum: 1 },
        },
      },
    ])) as SummaryResult[];

    const summary = result[0] || {
      totalRevenue: 0,
      totalTickets: 0,
      totalBookings: 0,
    };

    return {
      totalRevenue: summary.totalRevenue,
      totalTickets: summary.totalTickets,
      totalBookings: summary.totalBookings,
      avgRevenuePerBooking:
        summary.totalBookings > 0
          ? summary.totalRevenue / summary.totalBookings
          : 0,
    };
  }

  private async getRevenueByDate(matchStage: MatchStage) {
    const result = (await Booking.aggregate([
      { $match: matchStage },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          totalAmount: { $ifNull: ['$totalAmount', 0] },
          ticketCount: {
            $size: { $ifNull: ['$seatCodes', []] },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          revenue: { $sum: '$totalAmount' },
          tickets: { $sum: '$ticketCount' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])) as RevenueByDateResult[];

    return result.map((item) => ({
      date: item._id,
      revenue: item.revenue,
      tickets: item.tickets,
      bookings: item.bookings,
    }));
  }

  private async getTopMovies(matchStage: MatchStage) {
  return Booking.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: 'showtimes',
        localField: 'showTimeId',
        foreignField: '_id',
        as: 'showTime',
      },
    },
    {
      $unwind: {
        path: '$showTime',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'movies',
        localField: 'showTime.movieId',
        foreignField: '_id',
        as: 'movie',
      },
    },
    {
      $unwind: {
        path: '$movie',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        movieName: {
          $ifNull: ['$movie.name', { $ifNull: ['$movie.title', 'Không xác định'] }],
        },
        totalAmount: { $ifNull: ['$finalAmount', '$totalAmount'] },
        ticketCount: { $size: { $ifNull: ['$seatCodes', []] } },
      },
    },
    {
      $group: {
        _id: '$movieName',
        revenue: { $sum: '$totalAmount' },
        tickets: { $sum: '$ticketCount' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1, tickets: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        movieName: '$_id',
        revenue: 1,
        tickets: 1,
        bookings: 1,
      },
    },
  ]);
}

private async getTopCinemas(matchStage: MatchStage) {
  return Booking.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: 'showtimes',
        localField: 'showTimeId',
        foreignField: '_id',
        as: 'showTime',
      },
    },
    {
      $unwind: {
        path: '$showTime',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'rooms',
        localField: 'showTime.roomId',
        foreignField: '_id',
        as: 'room',
      },
    },
    {
      $unwind: {
        path: '$room',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'cinemas',
        localField: 'room.cinemaId',
        foreignField: '_id',
        as: 'cinema',
      },
    },
    {
      $unwind: {
        path: '$cinema',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        theaterName: {
          $ifNull: ['$cinema.name', { $ifNull: ['$cinema.ten_rap', 'Không xác định'] }],
        },
        totalAmount: { $ifNull: ['$finalAmount', '$totalAmount'] },
        ticketCount: { $size: { $ifNull: ['$seatCodes', []] } },
      },
    },
    {
      $group: {
        _id: '$theaterName',
        revenue: { $sum: '$totalAmount' },
        tickets: { $sum: '$ticketCount' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1, tickets: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        theaterName: '$_id',
        revenue: 1,
        tickets: 1,
        bookings: 1,
      },
    },
  ]);
}
}

export const analyticsOverviewService = new AnalyticsOverviewService();