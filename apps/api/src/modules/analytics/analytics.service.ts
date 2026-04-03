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

    return theaters
      .filter(Boolean)
      .sort((a, b) => String(a).localeCompare(String(b)));
  },

  async getStatusOptions() {
    const statuses = await Booking.distinct("status", {
      status: { $exists: true, $ne: "" },
    });

    return statuses
      .filter(Boolean)
      .sort((a, b) => String(a).localeCompare(String(b)));
  },

  async getOverview(query: AnalyticsQuery = {}) {
    const baseMatch = buildBookingMatch(query);

    const paidOnlyMatch = {
      ...buildBookingMatch({
        ...query,
        status: "paid",
      }),
    };

    const [
      totalMovies,
      totalUsers,
      totalShowtimes,
      paidBookings,
      bookingStatusRaw,
      revenueTrendRaw,
      topMoviesRaw,
      theaters,
      statuses,
    ] = await Promise.all([
      Movie.countDocuments(),
      User.countDocuments(),
      ShowTimeM.countDocuments(),
      Booking.find(paidOnlyMatch).select("finalAmount seatCodes"),
      Booking.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
      Booking.aggregate([
        { $match: paidOnlyMatch },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$finalAmount" },
            bookings: { $sum: 1 },
            tickets: {
              $sum: { $size: { $ifNull: ["$seatCodes", []] } },
            },
          },
        },
        {
          $project: {
            _id: 0,
            label: {
              $concat: [
                { $toString: "$_id.month" },
                "/",
                { $toString: "$_id.year" },
              ],
            },
            year: "$_id.year",
            month: "$_id.month",
            revenue: 1,
            bookings: 1,
            tickets: 1,
          },
        },
        { $sort: { year: 1, month: 1 } },
      ]),
      Booking.aggregate([
        { $match: paidOnlyMatch },
        {
          $group: {
            _id: "$movieName",
            revenue: { $sum: "$finalAmount" },
            bookings: { $sum: 1 },
            ticketsSold: {
              $sum: { $size: { $ifNull: ["$seatCodes", []] } },
            },
          },
        },
        {
          $project: {
            _id: 0,
            movieName: "$_id",
            revenue: 1,
            bookings: 1,
            ticketsSold: 1,
          },
        },
        { $sort: { ticketsSold: -1, revenue: -1 } },
        { $limit: 5 },
      ]),
      this.getTheaterOptions(),
      this.getStatusOptions(),
    ]);

    const totalRevenue = paidBookings.reduce(
      (sum, item) => sum + (item.finalAmount || 0),
      0,
    );

    const totalPaidBookings = paidBookings.length;

    const totalTicketsSold = paidBookings.reduce(
      (sum, item) => sum + (item.seatCodes?.length || 0),
      0,
    );

    const bookingStatus = bookingStatusRaw.map((item) => ({
      status: item._id || "unknown",
      count: item.count,
    }));

    return {
      filters: {
        theaters,
        statuses,
      },
      summary: {
        totalRevenue,
        totalPaidBookings,
        totalTicketsSold,
        totalMovies,
        totalUsers,
        totalShowtimes,
      },
      charts: {
        revenueTrend: revenueTrendRaw,
        bookingStatus,
        topMovies: topMoviesRaw,
      },
    };
  },
};