import { Booking } from "../../sales-operations/booking/booking.model";
import { ShowTimeM } from "../../cinema-catalog/showtime/showtime.model";
import { Room } from "../../cinema-catalog/room/room.model";
import { Cinemas } from "../../cinema-catalog/cinema/cinema.model";

type RevenueQuery = {
  fromDate?: string;
  toDate?: string;
  cinemaId?: string;
  theaterName?: string;
  paymentMethod?: string;
};

type DateRange = {
  from?: Date;
  to?: Date;
};

type SummaryStats = {
  totalRevenue: number;
  totalTickets: number;
  totalBookings: number;
  avgOrderValue: number;
};

type GrowthStats = {
  current: number;
  previous: number;
  growthPercent: number;
};

type RevenueSummaryResponse = {
  revenue: GrowthStats;
  tickets: GrowthStats;
  bookings: GrowthStats;
  avgOrderValue: GrowthStats;
};

type BaseMatch = Record<string, any>;

/**
 * Convert input date string to start of day.
 */
const toStartOfDay = (dateString: string) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Convert input date string to end of day.
 */
const toEndOfDay = (dateString: string) => {
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return date;
};

/**
 * Build normalized date range from query params.
 */
const buildDateRange = (fromDate?: string, toDate?: string): DateRange => {
  return {
    from: fromDate ? toStartOfDay(fromDate) : undefined,
    to: toDate ? toEndOfDay(toDate) : undefined,
  };
};

/**
 * Count number of days in selected range.
 * Used to calculate previous comparison period.
 */
const getRangeDays = (range: DateRange) => {
  if (!range.from || !range.to) return null;

  const diffMs = range.to.getTime() - range.from.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  return days > 0 ? days : 1;
};

/**
 * Build previous period range with the same number of days.
 * Example:
 * current: 10/04 -> 16/04
 * previous: 03/04 -> 09/04
 */
const buildPreviousDateRange = (range: DateRange): DateRange => {
  const totalDays = getRangeDays(range);

  if (!range.from || !range.to || !totalDays) {
    return {};
  }

  const prevTo = new Date(range.from);
  prevTo.setMilliseconds(-1);

  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - (totalDays - 1));
  prevFrom.setHours(0, 0, 0, 0);

  return {
    from: prevFrom,
    to: prevTo,
  };
};

/**
 * Build basic Mongo match object for booking collection.
 * Always only count paid bookings for revenue analytics.
 */
const buildBaseMatch = (range: DateRange, paymentMethod?: string): BaseMatch => {
  const match: BaseMatch = {
    status: "paid",
  };

  if (range.from || range.to) {
    match.createdAt = {};

    if (range.from) {
      match.createdAt.$gte = range.from;
    }

    if (range.to) {
      match.createdAt.$lte = range.to;
    }
  }

  if (paymentMethod && paymentMethod !== "all") {
    match.paymentMethod = paymentMethod;
  }

  return match;
};

/**
 * Get room ids that belong to a cinema.
 * This is the most reliable way to filter by cinemaId in your schema.
 */
const getRoomIdsByCinema = async (cinemaId?: string) => {
  if (!cinemaId || cinemaId === "all") return [];

  const rooms = await Room.find({ cinema_id: cinemaId }).select("_id").lean();
  return rooms.map((room: any) => room._id);
};

/**
 * Get showtime ids by cinema through room relation.
 * Booking -> showTimeId
 * ShowTime -> roomId
 * Room -> cinema_id
 */
const getShowTimeIdsByCinema = async (cinemaId?: string) => {
  const roomIds = await getRoomIdsByCinema(cinemaId);

  if (!roomIds.length) return [];

  const showTimes = await ShowTimeM.find({
    roomId: { $in: roomIds },
  })
    .select("_id")
    .lean();

  return showTimes.map((showTime: any) => showTime._id);
};

/**
 * Build extra booking match when cinemaId is provided.
 * This avoids ambiguous text-based cinema filtering.
 */
const buildCinemaIdMatch = async (cinemaId?: string) => {
  if (!cinemaId || cinemaId === "all") return {};

  const showTimeIds = await getShowTimeIdsByCinema(cinemaId);

  if (!showTimeIds.length) {
    return {
      showTimeId: { $in: [] },
    };
  }

  return {
    showTimeId: { $in: showTimeIds },
  };
};

/**
 * Reusable lookup pipeline to resolve cinema name from booking.
 * Priority:
 * 1. booking.theaterName
 * 2. cinema.name
 * 3. cinema.ten_rap
 * 4. "Không rõ rạp"
 */
const getCinemaLookupStages = () => [
  {
    $lookup: {
      from: "showtimes",
      localField: "showTimeId",
      foreignField: "_id",
      as: "showTimeInfo",
    },
  },
  {
    $unwind: {
      path: "$showTimeInfo",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "rooms",
      localField: "showTimeInfo.roomId",
      foreignField: "_id",
      as: "roomInfo",
    },
  },
  {
    $unwind: {
      path: "$roomInfo",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "cinemas",
      localField: "roomInfo.cinema_id",
      foreignField: "_id",
      as: "cinemaInfo",
    },
  },
  {
    $unwind: {
      path: "$cinemaInfo",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      cinemaNameResolved: {
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
            $ifNull: [
              "$cinemaInfo.name",
              {
                $ifNull: ["$cinemaInfo.ten_rap", "Không rõ rạp"],
              },
            ],
          },
        ],
      },
    },
  },
];

/**
 * Reusable lookup pipeline to resolve movie name from booking.
 * Priority:
 * 1. booking.movieName
 * 2. movie.ten_phim
 * 3. movie.name
 * 4. movie.title
 * 5. "Không rõ phim"
 */
const getMovieLookupStages = () => [
  {
    $lookup: {
      from: "showtimes",
      localField: "showTimeId",
      foreignField: "_id",
      as: "showTimeInfo",
    },
  },
  {
    $unwind: {
      path: "$showTimeInfo",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "movies",
      localField: "showTimeInfo.movieId",
      foreignField: "_id",
      as: "movieInfo",
    },
  },
  {
    $unwind: {
      path: "$movieInfo",
      preserveNullAndEmptyArrays: true,
    },
  },
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
            $ifNull: [
              "$movieInfo.ten_phim",
              {
                $ifNull: [
                  "$movieInfo.name",
                  {
                    $ifNull: ["$movieInfo.title", "Không rõ phim"],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
];

/**
 * Build theater name filter after cinema name has been resolved.
 * Only use this after getCinemaLookupStages().
 */
const buildResolvedTheaterMatchStages = (theaterName?: string) => {
  if (!theaterName || theaterName === "all") return [];

  return [
    {
      $match: {
        cinemaNameResolved: theaterName,
      },
    },
  ];
};

/**
 * Convert raw summary to normalized shape.
 */
const normalizeSummary = (raw?: any): SummaryStats => {
  const totalRevenue = raw?.totalRevenue || 0;
  const totalTickets = raw?.totalTickets || 0;
  const totalBookings = raw?.totalBookings || 0;

  return {
    totalRevenue,
    totalTickets,
    totalBookings,
    avgOrderValue:
      totalBookings > 0 ? Number((totalRevenue / totalBookings).toFixed(0)) : 0,
  };
};

/**
 * Calculate growth percent between current and previous values.
 */
const calculateGrowthPercent = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
};

/**
 * Build comparison object for dashboard KPIs.
 */
const buildGrowthMetric = (current: number, previous: number): GrowthStats => {
  return {
    current,
    previous,
    growthPercent: calculateGrowthPercent(current, previous),
  };
};

/**
 * Get summary stats for a given match condition.
 */
const getSummaryStats = async (match: BaseMatch) => {
  const result = await Booking.aggregate([
    { $match: match },
    {
      $project: {
        amount: { $ifNull: ["$finalAmount", "$totalAmount"] },
        tickets: { $size: { $ifNull: ["$seats", []] } },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        totalTickets: { $sum: "$tickets" },
        totalBookings: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalTickets: 1,
        totalBookings: 1,
      },
    },
  ]);

  return normalizeSummary(result[0]);
};

/**
 * Get revenue trend by date for line chart.
 */
const getRevenueTrendByDate = async (
  match: BaseMatch,
  theaterName?: string,
) => {
  return Booking.aggregate([
    { $match: match },
    ...getCinemaLookupStages(),
    ...buildResolvedTheaterMatchStages(theaterName),
    {
      $project: {
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        revenue: { $ifNull: ["$finalAmount", "$totalAmount"] },
        tickets: { $size: { $ifNull: ["$seats", []] } },
      },
    },
    {
      $group: {
        _id: "$date",
        revenue: { $sum: "$revenue" },
        tickets: { $sum: "$tickets" },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: 1,
        tickets: 1,
        bookings: 1,
      },
    },
  ]);
};

/**
 * Get revenue grouped by weekday.
 */
const getRevenueByWeekday = async (
  match: BaseMatch,
  theaterName?: string,
) => {
  return Booking.aggregate([
    { $match: match },
    ...getCinemaLookupStages(),
    ...buildResolvedTheaterMatchStages(theaterName),
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        revenue: { $sum: { $ifNull: ["$finalAmount", "$totalAmount"] } },
        tickets: { $sum: { $size: { $ifNull: ["$seats", []] } } },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
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
        tickets: 1,
        bookings: 1,
      },
    },
  ]);
};

/**
 * Get revenue grouped by hour to find peak hours.
 */
const getRevenueByHour = async (match: BaseMatch, theaterName?: string) => {
  return Booking.aggregate([
    { $match: match },
    ...getCinemaLookupStages(),
    ...buildResolvedTheaterMatchStages(theaterName),
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%H:00",
            date: "$createdAt",
          },
        },
        revenue: { $sum: { $ifNull: ["$finalAmount", "$totalAmount"] } },
        tickets: { $sum: { $size: { $ifNull: ["$seats", []] } } },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        hour: "$_id",
        revenue: 1,
        tickets: 1,
        bookings: 1,
      },
    },
  ]);
};

/**
 * Top cinemas by revenue.
 */
const getTopCinemas = async (match: BaseMatch, theaterName?: string) => {
  return Booking.aggregate([
    { $match: match },
    ...getCinemaLookupStages(),
    ...buildResolvedTheaterMatchStages(theaterName),
    {
      $group: {
        _id: "$cinemaNameResolved",
        revenue: { $sum: { $ifNull: ["$finalAmount", "$totalAmount"] } },
        tickets: { $sum: { $size: { $ifNull: ["$seats", []] } } },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1, tickets: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        cinemaName: "$_id",
        revenue: 1,
        tickets: 1,
        bookings: 1,
      },
    },
  ]);
};

/**
 * Top movies by revenue.
 */
const getTopMovies = async (match: BaseMatch, theaterName?: string) => {
  return Booking.aggregate([
    { $match: match },
    ...getMovieLookupStages(),
    ...getCinemaLookupStages(),
    ...buildResolvedTheaterMatchStages(theaterName),
    {
      $group: {
        _id: "$movieNameResolved",
        revenue: { $sum: { $ifNull: ["$finalAmount", "$totalAmount"] } },
        tickets: { $sum: { $size: { $ifNull: ["$seats", []] } } },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1, tickets: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        movieName: "$_id",
        revenue: 1,
        tickets: 1,
        bookings: 1,
      },
    },
  ]);
};

/**
 * Payment method distribution and revenue share.
 */
const getPaymentMethodStats = async (match: BaseMatch, theaterName?: string) => {
  return Booking.aggregate([
    { $match: match },
    ...getCinemaLookupStages(),
    ...buildResolvedTheaterMatchStages(theaterName),
    {
      $group: {
        _id: {
          $ifNull: ["$paymentMethod", "unknown"],
        },
        revenue: { $sum: { $ifNull: ["$finalAmount", "$totalAmount"] } },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    {
      $project: {
        _id: 0,
        paymentMethod: "$_id",
        revenue: 1,
        bookings: 1,
      },
    },
  ]);
};

/**
 * Combo attachment stats:
 * - total combo revenue
 * - how many bookings bought combos
 * - combo attach rate
 */
const getComboStats = async (match: BaseMatch, theaterName?: string) => {
  const result = await Booking.aggregate([
    { $match: match },
    ...getCinemaLookupStages(),
    ...buildResolvedTheaterMatchStages(theaterName),
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
        totalBookings: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalComboRevenue: 1,
        bookingWithCombo: 1,
        totalBookings: 1,
      },
    },
  ]);

  const raw = result[0] || {
    totalComboRevenue: 0,
    bookingWithCombo: 0,
    totalBookings: 0,
  };

  return {
    totalComboRevenue: raw.totalComboRevenue,
    bookingWithCombo: raw.bookingWithCombo,
    totalBookings: raw.totalBookings,
    comboAttachRate:
      raw.totalBookings > 0
        ? Number(((raw.bookingWithCombo / raw.totalBookings) * 100).toFixed(1))
        : 0,
  };
};

/**
 * Get highest-value recent bookings for quick operational review.
 */
const getRecentHighValueOrders = async (
  match: BaseMatch,
  theaterName?: string,
) => {
  return Booking.aggregate([
    { $match: match },
    ...getMovieLookupStages(),
    ...getCinemaLookupStages(),
    ...buildResolvedTheaterMatchStages(theaterName),
    {
      $project: {
        movieName: "$movieNameResolved",
        cinemaName: "$cinemaNameResolved",
        amount: { $ifNull: ["$finalAmount", "$totalAmount"] },
        tickets: { $size: { $ifNull: ["$seats", []] } },
        paymentMethod: { $ifNull: ["$paymentMethod", "unknown"] },
        createdAt: 1,
      },
    },
    { $sort: { amount: -1, createdAt: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        movieName: 1,
        cinemaName: 1,
        amount: 1,
        tickets: 1,
        paymentMethod: 1,
        createdAt: 1,
      },
    },
  ]);
};

/**
 * Extract quick insights from chart data.
 */
const buildInsights = ({
  revenueTrend,
  revenueByHour,
  topCinemas,
  topMovies,
}: {
  revenueTrend: any[];
  revenueByHour: any[];
  topCinemas: any[];
  topMovies: any[];
}) => {
  const bestDay =
    revenueTrend.length > 0
      ? [...revenueTrend].sort((a, b) => b.revenue - a.revenue)[0]
      : null;

  const bestHour =
    revenueByHour.length > 0
      ? [...revenueByHour].sort((a, b) => b.revenue - a.revenue)[0]
      : null;

  return {
    bestRevenueDay: bestDay
      ? {
          date: bestDay.date,
          revenue: bestDay.revenue,
          bookings: bestDay.bookings,
        }
      : null,
    peakHour: bestHour
      ? {
          hour: bestHour.hour,
          revenue: bestHour.revenue,
          bookings: bestHour.bookings,
        }
      : null,
    topCinema: topCinemas[0] || null,
    topMovie: topMovies[0] || null,
  };
};

/**
 * Build summary comparison block for dashboard header.
 */
const buildComparisonSummary = (
  current: SummaryStats,
  previous: SummaryStats,
): RevenueSummaryResponse => {
  return {
    revenue: buildGrowthMetric(current.totalRevenue, previous.totalRevenue),
    tickets: buildGrowthMetric(current.totalTickets, previous.totalTickets),
    bookings: buildGrowthMetric(current.totalBookings, previous.totalBookings),
    avgOrderValue: buildGrowthMetric(current.avgOrderValue, previous.avgOrderValue),
  };
};

export const analyticsRevenueService = {
  /**
   * Get filter options for UI dropdowns.
   */
  async getFilterOptions() {
    const [cinemas, paymentMethods] = await Promise.all([
      Cinemas.find({})
        .select("_id name ten_rap city address")
        .sort({ name: 1 })
        .lean(),
      Booking.distinct("paymentMethod", {
        paymentMethod: { $exists: true, $ne: "" },
      }),
    ]);

    return {
      cinemas: cinemas.map((item: any) => ({
        cinemaId: item._id,
        cinemaName: item.name || item.ten_rap || "Không rõ rạp",
        city: item.city,
        address: item.address,
      })),
      paymentMethods: paymentMethods.filter(Boolean).sort(),
    };
  },

  /**
   * Main revenue dashboard endpoint.
   * Includes:
   * - summary
   * - comparison with previous period
   * - charts
   * - top lists
   * - combo/payment insights
   * - recent high value orders
   */
  async getOverview(query: RevenueQuery = {}) {
    const currentRange = buildDateRange(query.fromDate, query.toDate);
    const previousRange = buildPreviousDateRange(currentRange);

    const [cinemaIdMatch] = await Promise.all([
      buildCinemaIdMatch(query.cinemaId),
    ]);

    const currentMatch = {
      ...buildBaseMatch(currentRange, query.paymentMethod),
      ...cinemaIdMatch,
    };

    const previousMatch = {
      ...buildBaseMatch(previousRange, query.paymentMethod),
      ...cinemaIdMatch,
    };

    const [
      currentSummary,
      previousSummary,
      revenueTrend,
      revenueByWeekday,
      revenueByHour,
      topCinemas,
      topMovies,
      paymentMethodStats,
      comboStats,
      recentHighValueOrders,
      filterOptions,
    ] = await Promise.all([
      getSummaryStats(currentMatch),
      getSummaryStats(previousMatch),
      getRevenueTrendByDate(currentMatch, query.theaterName),
      getRevenueByWeekday(currentMatch, query.theaterName),
      getRevenueByHour(currentMatch, query.theaterName),
      getTopCinemas(currentMatch, query.theaterName),
      getTopMovies(currentMatch, query.theaterName),
      getPaymentMethodStats(currentMatch, query.theaterName),
      getComboStats(currentMatch, query.theaterName),
      getRecentHighValueOrders(currentMatch, query.theaterName),
      this.getFilterOptions(),
    ]);

    return {
      filters: filterOptions,
      summary: currentSummary,
      comparison: buildComparisonSummary(currentSummary, previousSummary),
      charts: {
        revenueTrend,
        revenueByWeekday,
        revenueByHour,
        paymentMethodStats,
      },
      ranking: {
        topCinemas,
        topMovies,
      },
      combos: comboStats,
      recentHighValueOrders,
      insights: buildInsights({
        revenueTrend,
        revenueByHour,
        topCinemas,
        topMovies,
      }),
    };
  },
};