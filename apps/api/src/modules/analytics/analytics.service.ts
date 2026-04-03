import { Booking } from "@api/modules/sales-operations/booking/booking.model";
import { Movie } from "@api/modules/movie-content/movie/movie.model";
import { ShowTimeM } from "@api/modules/cinema-catalog/showtime/showtime.model";
import { User } from "@api/modules/access-control/user/user.model";

type AnalyticsQuery = {
  fromDate?: string;
  toDate?: string;
  theaterName?: string;
  status?: string;
};

const buildBookingMatch = (query: AnalyticsQuery = {}) => {
  const { fromDate, toDate, theaterName, status } = query;

  const match: Record<string, any> = {};

  if (fromDate || toDate) {
    match.createdAt = {};

    if (fromDate) {
      match.createdAt.$gte = new Date(`${fromDate}T00:00:00.000Z`);
    }

    if (toDate) {
      match.createdAt.$lte = new Date(`${toDate}T23:59:59.999Z`);
    }
  }

  if (theaterName && theaterName !== "all") {
    match.theaterName = theaterName;
  }

  if (status && status !== "all") {
    match.status = status;
  }

  return match;
};

export const analyticsService = {
  async getTheaterOptions() {
    const theaters = await Booking.distinct("theaterName", {
      theaterName: { $exists: true, $ne: "" },
    });

    return theaters.filter(Boolean).sort();
  },

  async getStatusOptions() {
    const statuses = await Booking.distinct("status", {
      status: { $exists: true, $ne: "" },
    });

    return statuses.filter(Boolean).sort();
  },

  async getOverview(query: AnalyticsQuery = {}) {
    const baseMatch = buildBookingMatch(query);

    const paidMatch = {
      ...baseMatch,
      status: "paid",
    };

    const [
      totalMovies,
      totalUsers,
      totalShowtimes,
      paidBookings,
      bookingStatusRaw,
      revenueTrendRaw,
      topMoviesRaw,
      topTheatersRaw,
      theaters,
      statuses,
    ] = await Promise.all([
      Movie.countDocuments(),
      User.countDocuments(),
      ShowTimeM.countDocuments(),

      Booking.find(paidMatch).select("finalAmount seatCodes"),

      Booking.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Booking.aggregate([
        { $match: paidMatch },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$finalAmount" },
          },
        },
        {
          $project: {
            label: {
              $concat: [
                { $toString: "$_id.month" },
                "/",
                { $toString: "$_id.year" },
              ],
            },
            revenue: 1,
          },
        },
      ]),

      Booking.aggregate([
        { $match: paidMatch },
        {
          $group: {
            _id: "$movieName",
            ticketsSold: { $sum: { $size: "$seatCodes" } },
          },
        },
        { $sort: { ticketsSold: -1 } },
        { $limit: 5 },
        {
          $project: {
            movieName: "$_id",
            ticketsSold: 1,
            _id: 0,
          },
        },
      ]),

      Booking.aggregate([
        { $match: paidMatch },
        {
          $group: {
            _id: "$theaterName",
            revenue: { $sum: "$finalAmount" },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        {
          $project: {
            theaterName: "$_id",
            revenue: 1,
            _id: 0,
          },
        },
      ]),

      this.getTheaterOptions(),
      this.getStatusOptions(),
    ]);

    const totalRevenue = paidBookings.reduce(
      (sum, item) => sum + (item.finalAmount || 0),
      0,
    );

    const totalTicketsSold = paidBookings.reduce(
      (sum, item) => sum + (item.seatCodes?.length || 0),
      0,
    );

    return {
      filters: {
        theaters,
        statuses,
      },
      summary: {
        totalRevenue,
        totalTicketsSold,
        totalMovies,
        totalUsers,
        totalShowtimes,
      },
      charts: {
        revenueTrend: revenueTrendRaw,
        bookingStatus: bookingStatusRaw,
        topMovies: topMoviesRaw,
        topTheaters: topTheatersRaw,
      },
    };
  },
};