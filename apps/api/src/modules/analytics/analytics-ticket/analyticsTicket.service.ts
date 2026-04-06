import { Booking } from "@api/modules/sales-operations/booking/booking.model";
import { Movie } from "@api/modules/movie-content/movie/movie.model";
import { ShowTimeM } from "@api/modules/cinema-catalog/showtime/showtime.model";
import { User } from "@api/modules/access-control/user/user.model";

type AnalyticsTicketQuery = {
  fromDate?: string;
  toDate?: string;
  theaterName?: string;
  status?: string;
};

const buildBookingMatch = (query: AnalyticsTicketQuery = {}) => {
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

export const analyticsTicketService = {
  async getFilterOptions() {
    const [theaters, statuses] = await Promise.all([
      Booking.distinct("theaterName", {
        theaterName: { $exists: true, $ne: "" },
      }),
      Booking.distinct("status", {
        status: { $exists: true, $ne: "" },
      }),
    ]);

    return {
      theaters: theaters.filter(Boolean).sort(),
      statuses: statuses.filter(Boolean).sort(),
    };
  },

  async getOverview(query: AnalyticsTicketQuery = {}) {
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
      filters,
      bookingStatusRaw,
      revenueTrendRaw,
      topMoviesRaw,
      topTheatersRaw,
      recentBookingsRaw,
      ticketByWeekdayRaw,
      comboStatsRaw,
      topCustomersRaw,
    ] = await Promise.all([
      Movie.countDocuments(),
      User.countDocuments(),
      ShowTimeM.countDocuments(),

      Booking.find(paidMatch)
        .select("finalAmount totalAmount seatCodes seats items")
        .lean(),

      this.getFilterOptions(),

      Booking.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            name: "$_id",
            value: "$count",
            _id: 0,
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
              day: { $dayOfMonth: "$createdAt" },
            },
            revenue: {
              $sum: { $ifNull: ["$finalAmount", "$totalAmount"] },
            },
            ticketsSold: {
              $sum: {
                $size: { $ifNull: ["$seatCodes", []] },
              },
            },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        {
          $project: {
            label: {
              $concat: [
                { $toString: "$_id.day" },
                "/",
                { $toString: "$_id.month" },
              ],
            },
            revenue: 1,
            ticketsSold: 1,
            bookings: 1,
            _id: 0,
          },
        },
      ]),

      // TOP MOVIES
      Booking.aggregate([
        { $match: paidMatch },
        {
          $lookup: {
            from: "showtimes",
            localField: "showTimeId",
            foreignField: "_id",
            as: "showtime",
          },
        },
        { $unwind: { path: "$showtime", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "movies",
            localField: "showtime.movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        { $unwind: { path: "$movie", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            movieNameResolved: {
              $cond: [
                {
                  $gt: [
                    {
                      $strLenCP: {
                        $trim: {
                          input: { $ifNull: ["$movieName", ""] },
                        },
                      },
                    },
                    0,
                  ],
                },
                "$movieName",
                {
                  $ifNull: ["$movie.ten_phim", "Không rõ phim"],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$movieNameResolved",
            ticketsSold: {
              $sum: {
                $size: { $ifNull: ["$seatCodes", []] },
              },
            },
            revenue: {
              $sum: { $ifNull: ["$finalAmount", "$totalAmount"] },
            },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { ticketsSold: -1, revenue: -1 } },
        { $limit: 5 },
        {
          $project: {
            movieName: "$_id",
            ticketsSold: 1,
            revenue: 1,
            bookings: 1,
            _id: 0,
          },
        },
      ]),

      // TOP THEATERS
      Booking.aggregate([
        { $match: paidMatch },
        {
          $lookup: {
            from: "showtimes",
            localField: "showTimeId",
            foreignField: "_id",
            as: "showtime",
          },
        },
        { $unwind: { path: "$showtime", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "rooms",
            localField: "showtime.roomId",
            foreignField: "_id",
            as: "room",
          },
        },
        { $unwind: { path: "$room", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "cinemas",
            localField: "room.cinemaId",
            foreignField: "_id",
            as: "cinema",
          },
        },
        { $unwind: { path: "$cinema", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            theaterNameResolved: {
              $cond: [
                {
                  $gt: [
                    {
                      $strLenCP: {
                        $trim: {
                          input: { $ifNull: ["$theaterName", ""] },
                        },
                      },
                    },
                    0,
                  ],
                },
                "$theaterName",
                {
                  $ifNull: ["$cinema.name", "Không rõ rạp"],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$theaterNameResolved",
            revenue: {
              $sum: { $ifNull: ["$finalAmount", "$totalAmount"] },
            },
            ticketsSold: {
              $sum: {
                $size: { $ifNull: ["$seatCodes", []] },
              },
            },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        {
          $project: {
            theaterName: "$_id",
            revenue: 1,
            ticketsSold: 1,
            bookings: 1,
            _id: 0,
          },
        },
      ]),

      // RECENT BOOKINGS
      Booking.aggregate([
        { $match: baseMatch },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "showtimes",
            localField: "showTimeId",
            foreignField: "_id",
            as: "showtime",
          },
        },
        { $unwind: { path: "$showtime", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "movies",
            localField: "showtime.movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        { $unwind: { path: "$movie", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "rooms",
            localField: "showtime.roomId",
            foreignField: "_id",
            as: "room",
          },
        },
        { $unwind: { path: "$room", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "cinemas",
            localField: "room.cinemaId",
            foreignField: "_id",
            as: "cinema",
          },
        },
        { $unwind: { path: "$cinema", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            movieNameResolved: {
              $cond: [
                {
                  $gt: [
                    {
                      $strLenCP: {
                        $trim: {
                          input: { $ifNull: ["$movieName", ""] },
                        },
                      },
                    },
                    0,
                  ],
                },
                "$movieName",
                {
                  $ifNull: ["$movie.ten_phim", "Không rõ phim"],
                },
              ],
            },
            theaterNameResolved: {
              $cond: [
                {
                  $gt: [
                    {
                      $strLenCP: {
                        $trim: {
                          input: { $ifNull: ["$theaterName", ""] },
                        },
                      },
                    },
                    0,
                  ],
                },
                "$theaterName",
                {
                  $ifNull: ["$cinema.name", "Không rõ rạp"],
                },
              ],
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 8 },
        {
          $project: {
            userName: {
              $ifNull: ["$user.ho_ten", "$user.name", "Ẩn danh"],
            },
            movieName: "$movieNameResolved",
            theaterName: "$theaterNameResolved",
            amount: {
              $ifNull: ["$finalAmount", "$totalAmount", 0],
            },
            seatsCount: {
              $size: { $ifNull: ["$seatCodes", []] },
            },
            status: {
              $ifNull: ["$status", "unknown"],
            },
            createdAt: 1,
            _id: 0,
          },
        },
      ]),

      Booking.aggregate([
        { $match: paidMatch },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            revenue: {
              $sum: { $ifNull: ["$finalAmount", "$totalAmount"] },
            },
            ticketsSold: {
              $sum: {
                $size: { $ifNull: ["$seatCodes", []] },
              },
            },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
        {
          $project: {
            weekday: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id", 1] }, then: "CN" },
                  { case: { $eq: ["$_id", 2] }, then: "T2" },
                  { case: { $eq: ["$_id", 3] }, then: "T3" },
                  { case: { $eq: ["$_id", 4] }, then: "T4" },
                  { case: { $eq: ["$_id", 5] }, then: "T5" },
                  { case: { $eq: ["$_id", 6] }, then: "T6" },
                  { case: { $eq: ["$_id", 7] }, then: "T7" },
                ],
                default: "Khác",
              },
            },
            revenue: 1,
            ticketsSold: 1,
            bookings: 1,
            _id: 0,
          },
        },
      ]),

      Booking.aggregate([
        { $match: paidMatch },
        {
          $project: {
            comboRevenue: {
              $sum: {
                $map: {
                  input: { $ifNull: ["$items", []] },
                  as: "item",
                  in: {
                    $multiply: [
                      { $ifNull: ["$$item.quantity", 0] },
                      { $ifNull: ["$$item.price", 0] },
                    ],
                  },
                },
              },
            },
            hasCombo: {
              $gt: [{ $size: { $ifNull: ["$items", []] } }, 0],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalComboRevenue: { $sum: "$comboRevenue" },
            bookingWithCombo: {
              $sum: { $cond: ["$hasCombo", 1, 0] },
            },
            totalPaidBookings: { $sum: 1 },
          },
        },
      ]),

      Booking.aggregate([
        { $match: paidMatch },
        {
          $group: {
            _id: "$userId",
            totalBookings: { $sum: 1 },
            totalRevenue: {
              $sum: { $ifNull: ["$finalAmount", "$totalAmount"] },
            },
            totalTickets: {
              $sum: {
                $size: { $ifNull: ["$seatCodes", []] },
              },
            },
          },
        },
        { $sort: { totalBookings: -1, totalRevenue: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            userName: {
              $ifNull: ["$user.ho_ten", "$user.name", "Ẩn danh"],
            },
            totalBookings: 1,
            totalRevenue: 1,
            totalTickets: 1,
            _id: 0,
          },
        },
      ]),
    ]);

    const totalRevenue = paidBookings.reduce(
      (sum, item: any) => sum + (item.finalAmount || item.totalAmount || 0),
      0,
    );

    const totalTicketsSold = paidBookings.reduce((sum, item: any) => {
      return sum + (item.seatCodes?.length || 0);
    }, 0);

    const totalBookings = paidBookings.length;

    const avgTicketsPerBooking =
      totalBookings > 0 ? Number((totalTicketsSold / totalBookings).toFixed(1)) : 0;

    const averageOrderValue =
      totalBookings > 0 ? Number((totalRevenue / totalBookings).toFixed(0)) : 0;

    const totalComboRevenue = comboStatsRaw?.[0]?.totalComboRevenue || 0;
    const bookingWithCombo = comboStatsRaw?.[0]?.bookingWithCombo || 0;
    const totalPaidBookings = comboStatsRaw?.[0]?.totalPaidBookings || 0;

    const comboAttachRate =
      totalPaidBookings > 0
        ? Number(((bookingWithCombo / totalPaidBookings) * 100).toFixed(1))
        : 0;

    const paidCount =
      bookingStatusRaw.find((item: any) => item.name === "paid")?.value || 0;
    const cancelledCount =
      bookingStatusRaw.find((item: any) => item.name === "cancelled")?.value || 0;
    const pendingCount =
      bookingStatusRaw.find((item: any) => item.name === "pending")?.value || 0;

    const totalStatusCount = bookingStatusRaw.reduce(
      (sum: number, item: any) => sum + item.value,
      0,
    );

    const conversionRate =
      totalStatusCount > 0 ? Number(((paidCount / totalStatusCount) * 100).toFixed(1)) : 0;

    const cancelRate =
      totalStatusCount > 0
        ? Number(((cancelledCount / totalStatusCount) * 100).toFixed(1))
        : 0;

    const pendingRate =
      totalStatusCount > 0
        ? Number(((pendingCount / totalStatusCount) * 100).toFixed(1))
        : 0;

    return {
      filters,
      summary: {
        totalRevenue,
        totalTicketsSold,
        totalBookings,
        totalMovies,
        totalUsers,
        totalShowtimes,
        avgTicketsPerBooking,
        averageOrderValue,
        totalComboRevenue,
        comboAttachRate,
        conversionRate,
        cancelRate,
        pendingRate,
      },
      charts: {
        revenueTrend: revenueTrendRaw,
        bookingStatus: bookingStatusRaw,
        topMovies: topMoviesRaw,
        topTheaters: topTheatersRaw,
        ticketByWeekday: ticketByWeekdayRaw,
      },
      recentBookings: recentBookingsRaw,
      insights: {
        topCustomers: topCustomersRaw,
      },
    };
  },
};