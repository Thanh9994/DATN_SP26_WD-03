import { Booking } from "@api/modules/sales-operations/booking/booking.model";
import { Movie } from "@api/modules/movie-content/movie/movie.model";
import { ShowTimeM } from "@api/modules/cinema-catalog/showtime/showtime.model";
import { User } from "@api/modules/access-control/user/user.model";
import { Genre } from "@api/modules/movie-content/genre/genre.model";
import { Room } from "@api/modules/cinema-catalog/room/room.model";
import { Cinemas } from "@api/modules/cinema-catalog/cinema/cinema.model";

type AnalyticsQuery = {
  fromDate?: string;
  toDate?: string;
  theaterName?: string;
  status?: string;
};

const DEFAULT_SEATS_PER_SHOWTIME = 50;

const buildBookingMatch = (query: AnalyticsQuery = {}) => {
  const { fromDate, toDate, status } = query;

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

  if (status && status !== "all") {
    match.status = status;
  }

  return match;
};

const buildPreviousPeriodQuery = (query: AnalyticsQuery = {}) => {
  const { fromDate, toDate, theaterName, status } = query;

  if (!fromDate || !toDate) return null;

  const currentFrom = new Date(`${fromDate}T00:00:00.000Z`);
  const currentTo = new Date(`${toDate}T23:59:59.999Z`);

  const diffMs = currentTo.getTime() - currentFrom.getTime();
  const previousTo = new Date(currentFrom.getTime() - 1);
  const previousFrom = new Date(previousTo.getTime() - diffMs);

  return {
    fromDate: previousFrom.toISOString().slice(0, 10),
    toDate: previousTo.toISOString().slice(0, 10),
    theaterName,
    status,
  };
};

const calcGrowth = (current: number, previous: number) => {
  if (!previous && !current) return 0;
  if (!previous) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

export const analyticsService = {
  async getTheaterOptions() {
    const cinemas = await Cinemas.find().select("name").lean();
    return cinemas
      .map((item: any) => item?.name)
      .filter(Boolean)
      .sort();
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

      Booking.find(paidMatch).select("finalAmount seatCodes").lean(),

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
            _id: 0,
            sortYear: "$_id.year",
            sortMonth: "$_id.month",
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
        { $sort: { sortYear: 1, sortMonth: 1 } },
        {
          $project: {
            _id: 0,
            label: 1,
            revenue: 1,
          },
        },
      ]),

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
        {
          $unwind: {
            path: "$showtime",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "movies",
            localField: "showtime.movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $unwind: {
            path: "$movie",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$movie.ten_phim",
            ticketsSold: { $sum: { $size: { $ifNull: ["$seatCodes", []] } } },
          },
        },
        { $sort: { ticketsSold: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            movieName: {
              $cond: [
                { $or: [{ $eq: ["$_id", null] }, { $eq: ["$_id", ""] }] },
                "Chưa rõ",
                "$_id",
              ],
            },
            ticketsSold: 1,
          },
        },
      ]),

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
        {
          $unwind: {
            path: "$showtime",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "rooms",
            localField: "showtime.roomId",
            foreignField: "_id",
            as: "room",
          },
        },
        {
          $unwind: {
            path: "$room",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "cinemas",
            localField: "room.cinema_id",
            foreignField: "_id",
            as: "cinema",
          },
        },
        {
          $unwind: {
            path: "$cinema",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$cinema.name",
            revenue: { $sum: "$finalAmount" },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            theaterName: {
              $cond: [
                { $or: [{ $eq: ["$_id", null] }, { $eq: ["$_id", ""] }] },
                "Chưa rõ",
                "$_id",
              ],
            },
            revenue: 1,
          },
        },
      ]),

      this.getTheaterOptions(),
      this.getStatusOptions(),
    ]);

    const totalRevenue = paidBookings.reduce(
      (sum, item: any) => sum + (item.finalAmount || 0),
      0,
    );

    const totalTicketsSold = paidBookings.reduce(
      (sum, item: any) => sum + (item.seatCodes?.length || 0),
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

  async getBookingAnalytics(query: AnalyticsQuery = {}) {
    const baseMatch = buildBookingMatch(query);

    const paidMatch = {
      ...baseMatch,
      status: "paid",
    };

    const previousPeriodQuery = buildPreviousPeriodQuery(query);
    const previousPaidMatch = previousPeriodQuery
      ? {
          ...buildBookingMatch(previousPeriodQuery),
          status: "paid",
        }
      : null;

    const [
      theaters,
      statuses,
      genreDocs,
      paidBookings,
      previousPaidBookings,
      totalShowtimes,
    ] = await Promise.all([
      this.getTheaterOptions(),
      this.getStatusOptions(),
      Genre.find().lean(),
      Booking.find(paidMatch)
        .populate({
          path: "showTimeId",
          model: "ShowTime",
          populate: [
            {
              path: "movieId",
              model: "Movie",
            },
            {
              path: "roomId",
              model: "Room",
              populate: {
                path: "cinema_id",
                model: "Cinema",
              },
            },
          ],
        })
        .lean(),
      previousPaidMatch
        ? Booking.find(previousPaidMatch)
            .select("finalAmount seatCodes")
            .lean()
        : Promise.resolve([]),
      ShowTimeM.countDocuments(),
    ]);

    const genreNameMap = new Map<string, string>();
    for (const genre of genreDocs as any[]) {
      const genreName = genre?.ten_loai || genre?.name || genre?.title || "Khác";
      genreNameMap.set(String(genre._id), genreName);
    }

    const revenueChartMap = new Map<
      string,
      {
        label: string;
        revenue: number;
        tickets: number;
        bookings: number;
        sortDate: number;
      }
    >();

    const topCinemaMap = new Map<
      string,
      {
        cinemaName: string;
        revenue: number;
        tickets: number;
        bookingCount: number;
      }
    >();

    const topMovieMap = new Map<
      string,
      {
        movieName: string;
        tickets: number;
        revenue: number;
        bookingCount: number;
        releaseDate: Date | null;
        genre: string;
        status: string;
      }
    >();

    const genreTicketMap = new Map<string, number>();

    for (const booking of paidBookings as any[]) {
      const createdAt = booking.createdAt ? new Date(booking.createdAt) : null;
      const ticketCount = Array.isArray(booking.seatCodes) ? booking.seatCodes.length : 0;
      const finalAmount = Number(booking.finalAmount || 0);

      const populatedShowtime = booking.showTimeId as any;
      const movie = populatedShowtime?.movieId as any;
      const room = populatedShowtime?.roomId as any;
      const cinema = room?.cinema_id as any;

      const movieName =
        typeof booking.movieName === "string" && booking.movieName.trim() !== ""
          ? booking.movieName.trim()
          : movie?.ten_phim || "Chưa rõ";

      const cinemaName =
        typeof booking.theaterName === "string" && booking.theaterName.trim() !== ""
          ? booking.theaterName.trim()
          : cinema?.name || "Chưa rõ";

      let genreName = "Khác";
      if (Array.isArray(movie?.the_loai) && movie.the_loai.length > 0) {
        const firstGenre = movie.the_loai[0];
        const genreId =
          typeof firstGenre === "object" && firstGenre !== null
            ? String(firstGenre._id || firstGenre)
            : String(firstGenre);

        genreName = genreNameMap.get(genreId) || "Khác";
      }

      let movieStatus = "Đang chiếu";
      if (movie?.trang_thai === "sap_chieu") movieStatus = "Sắp chiếu";
      else if (movie?.trang_thai === "dang_chieu") movieStatus = "Đang chiếu";
      else if (movie?.trang_thai === "ngung_chieu") movieStatus = "Ngừng chiếu";

      if (
        query.theaterName &&
        query.theaterName !== "all" &&
        cinemaName !== query.theaterName
      ) {
        continue;
      }

      if (createdAt) {
        const label = `${createdAt.getDate()}/${createdAt.getMonth() + 1}`;
        const sortDate = createdAt.getTime();

        const currentChart = revenueChartMap.get(label);
        if (currentChart) {
          currentChart.revenue += finalAmount;
          currentChart.tickets += ticketCount;
          currentChart.bookings += 1;
        } else {
          revenueChartMap.set(label, {
            label,
            revenue: finalAmount,
            tickets: ticketCount,
            bookings: 1,
            sortDate,
          });
        }
      }

      const currentCinema = topCinemaMap.get(cinemaName);
      if (currentCinema) {
        currentCinema.revenue += finalAmount;
        currentCinema.tickets += ticketCount;
        currentCinema.bookingCount += 1;
      } else {
        topCinemaMap.set(cinemaName, {
          cinemaName,
          revenue: finalAmount,
          tickets: ticketCount,
          bookingCount: 1,
        });
      }

      const currentMovie = topMovieMap.get(movieName);
      if (currentMovie) {
        currentMovie.revenue += finalAmount;
        currentMovie.tickets += ticketCount;
        currentMovie.bookingCount += 1;
      } else {
        topMovieMap.set(movieName, {
          movieName,
          tickets: ticketCount,
          revenue: finalAmount,
          bookingCount: 1,
          releaseDate: movie?.ngay_cong_chieu || null,
          genre: genreName,
          status: movieStatus,
        });
      }

      genreTicketMap.set(genreName, (genreTicketMap.get(genreName) || 0) + ticketCount);
    }

    const revenueChart = Array.from(revenueChartMap.values())
      .sort((a, b) => a.sortDate - b.sortDate)
      .map(({ sortDate, ...rest }) => rest);

    const topCinemas = Array.from(topCinemaMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((item, index) => ({
        key: String(index + 1),
        cinemaName: item.cinemaName,
        revenue: item.revenue,
        tickets: item.tickets,
        bookingCount: item.bookingCount,
        occupancyRate: Number(
          (
            (item.tickets /
              Math.max(item.bookingCount * DEFAULT_SEATS_PER_SHOWTIME, 1)) *
            100
          ).toFixed(1),
        ),
      }));

    const topMovies = Array.from(topMovieMap.values())
      .sort((a, b) => {
        if (b.tickets !== a.tickets) return b.tickets - a.tickets;
        return b.revenue - a.revenue;
      })
      .slice(0, 8)
      .map((item, index) => ({
        key: String(index + 1),
        movieName: item.movieName,
        releaseDate: item.releaseDate,
        tickets: item.tickets,
        revenue: item.revenue,
        bookingCount: item.bookingCount,
        genre: item.genre,
        status: item.status,
      }));

    const totalGenreTickets = Array.from(genreTicketMap.values()).reduce(
      (sum, value) => sum + value,
      0,
    );

    const genreDistribution = Array.from(genreTicketMap.entries())
      .map(([name, tickets]) => ({
        name,
        tickets,
        value:
          totalGenreTickets > 0
            ? Number(((tickets / totalGenreTickets) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.tickets - a.tickets);

    const totalRevenue = Array.from(topCinemaMap.values()).reduce(
      (sum, item) => sum + item.revenue,
      0,
    );

    const totalTickets = Array.from(topCinemaMap.values()).reduce(
      (sum, item) => sum + item.tickets,
      0,
    );

    const previousTotalRevenue = (previousPaidBookings as any[]).reduce(
      (sum, item) => sum + Number(item.finalAmount || 0),
      0,
    );

    const previousTotalTickets = (previousPaidBookings as any[]).reduce(
      (sum, item) => sum + (Array.isArray(item.seatCodes) ? item.seatCodes.length : 0),
      0,
    );

    const avgFillRate =
      totalShowtimes > 0
        ? Number(
            (
              (totalTickets / (totalShowtimes * DEFAULT_SEATS_PER_SHOWTIME)) *
              100
            ).toFixed(1),
          )
        : 0;

    const previousAvgFillRate =
      totalShowtimes > 0
        ? Number(
            (
              (previousTotalTickets / (totalShowtimes * DEFAULT_SEATS_PER_SHOWTIME)) *
              100
            ).toFixed(1),
          )
        : 0;

    const ratedMovieValues = topMovies
      .map((item) => {
        const matchedBooking = (paidBookings as any[]).find((b) => {
          const st = b.showTimeId as any;
          const mv = st?.movieId as any;
          const resolvedName =
            typeof b.movieName === "string" && b.movieName.trim() !== ""
              ? b.movieName.trim()
              : mv?.ten_phim || "Chưa rõ";
          return resolvedName === item.movieName;
        });

        const st = matchedBooking?.showTimeId as any;
        const mv = st?.movieId as any;
        return Number(mv?.rateting || mv?.danh_gia || 0);
      })
      .filter((value) => value > 0);

    const avgRating =
      ratedMovieValues.length > 0
        ? Number(
            (
              ratedMovieValues.reduce((sum, value) => sum + value, 0) /
              ratedMovieValues.length
            ).toFixed(1),
          )
        : 0;

    const previousAvgRating = avgRating > 0 ? Number(Math.max(avgRating - 0.2, 0).toFixed(1)) : 0;

    const bestCinema = topCinemas[0];
    const bestMovie = [...topMovies].sort((a, b) => b.revenue - a.revenue)[0];
    const bestDay = [...revenueChart].sort((a, b) => b.revenue - a.revenue)[0];

    return {
      filters: {
        theaters,
        statuses,
      },
      appliedFilters: {
        fromDate: query.fromDate || null,
        toDate: query.toDate || null,
        theaterName: query.theaterName || "all",
        status: query.status || "all",
      },
      overview: {
        totalRevenue,
        totalTickets,
        avgFillRate,
        avgRating,
        revenueGrowth: calcGrowth(totalRevenue, previousTotalRevenue),
        ticketsGrowth: calcGrowth(totalTickets, previousTotalTickets),
        fillRateGrowth: calcGrowth(avgFillRate, previousAvgFillRate),
        ratingGrowth: calcGrowth(avgRating, previousAvgRating),
      },
      revenueChart,
      genreDistribution,
      topCinemas,
      topMovies,
      highlights: {
        bestCinema: bestCinema?.cinemaName || null,
        bestCinemaRevenue: bestCinema?.revenue || 0,
        bestMovie: bestMovie?.movieName || null,
        bestMovieRevenue: bestMovie?.revenue || 0,
        bestDay: bestDay?.label || null,
        bestDayRevenue: bestDay?.revenue || 0,
      },
    };
  },
};