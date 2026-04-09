import { Booking } from "../../sales-operations/booking/booking.model";
import { ShowTimeM } from "../../cinema-catalog/showtime/showtime.model";
import { Room } from "../../cinema-catalog/room/room.model";
import { Cinemas } from "../../cinema-catalog/cinema/cinema.model";
import { SeatTime } from "../../cinema-catalog/showtime/showtimeSeat.model";

type Filters = {
  fromDate?: string;
  toDate?: string;
};

type OverviewFilters = {
  cinemaId?: string;
  fromDate?: string;
  toDate?: string;
};

const buildDateMatch = (fromDate?: string, toDate?: string) => {
  const match: any = {};

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) match.createdAt.$lte = new Date(toDate);
  }

  return match;
};

const getTodayRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const getRoomCapacity = (room: any) => {
  const rowsCount = Array.isArray(room?.rows) ? room.rows.length : 0;
  const vipCount = Array.isArray(room?.vip) ? room.vip.length : 0;
  const coupleCount = Array.isArray(room?.couple) ? room.couple.length : 0;

  return rowsCount + vipCount + coupleCount;
};

const mapOccupancyStatus = (occupancyRate: number) => {
  if (occupancyRate >= 90) return "Gần đầy";
  if (occupancyRate >= 75) return "Tốt";
  if (occupancyRate >= 50) return "Ổn định";
  return "Thấp";
};

const getSeatCountByShowTime = async () => {
  const seatAgg = await SeatTime.aggregate([
    {
      $group: {
        _id: "$showTimeId",
        totalSeats: { $sum: 1 },
      },
    },
  ]);

  return new Map(
    seatAgg.map((item: any) => [String(item._id), item.totalSeats])
  );
};

const getCinemaBasicInfo = async (cinemaId?: string) => {
  if (!cinemaId) return null;
  return Cinemas.findById(cinemaId).lean();
};

const getCinemaRoomIds = async (cinemaId?: string) => {
  if (!cinemaId) return [];

  const rooms = await Room.find({ cinema_id: cinemaId }).select("_id").lean();
  return rooms.map((room: any) => room._id);
};

const getShowTimeIdsByCinema = async (cinemaId?: string) => {
  const roomIds = await getCinemaRoomIds(cinemaId);

  if (!roomIds.length) return [];

  const showTimes = await ShowTimeM.find({
    roomId: { $in: roomIds },
  })
    .select("_id")
    .lean();

  return showTimes.map((showTime: any) => showTime._id);
};

const getCinemaOverview = async (filters: OverviewFilters) => {
  const { cinemaId, fromDate, toDate } = filters;
  const showTimeIds = await getShowTimeIdsByCinema(cinemaId);

  if (!showTimeIds.length) {
    return {
      totalRevenue: 0,
      occupancyRate: 0,
      ticketsSoldToday: 0,
      totalBookingsToday: 0,
      totalTickets: 0,
      topMovie: null,
    };
  }

  const bookingDateMatch = buildDateMatch(fromDate, toDate);
  const { start, end } = getTodayRange();

  const [summaryAgg, todayAgg, seatAgg, topMovieAgg] = await Promise.all([
    Booking.aggregate([
      {
        $match: {
          ...bookingDateMatch,
          showTimeId: { $in: showTimeIds },
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalAmount" },
          totalTickets: { $sum: { $size: "$seats" } },
          totalBookings: { $sum: 1 },
        },
      },
    ]),

    Booking.aggregate([
      {
        $match: {
          showTimeId: { $in: showTimeIds },
          status: "paid",
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          ticketsSoldToday: { $sum: { $size: "$seats" } },
          totalBookingsToday: { $sum: 1 },
        },
      },
    ]),

    SeatTime.aggregate([
      {
        $match: {
          showTimeId: { $in: showTimeIds },
        },
      },
      {
        $group: {
          _id: null,
          totalSeats: { $sum: 1 },
        },
      },
    ]),

    ShowTimeM.aggregate([
      {
        $match: {
          _id: { $in: showTimeIds },
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "showTimeId",
          as: "bookings",
        },
      },
      {
        $unwind: {
          path: "$bookings",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          "bookings.status": "paid",
          ...(fromDate || toDate
            ? {
                "bookings.createdAt": {
                  ...(fromDate ? { $gte: new Date(fromDate) } : {}),
                  ...(toDate ? { $lte: new Date(toDate) } : {}),
                },
              }
            : {}),
        },
      },
      {
        $group: {
          _id: "$movieId",
          soldTickets: { $sum: { $size: "$bookings.seats" } },
        },
      },
      {
        $sort: { soldTickets: -1 },
      },
      {
        $limit: 1,
      },
    ]),
  ]);

  const totalRevenue = summaryAgg[0]?.totalRevenue || 0;
  const totalTickets = summaryAgg[0]?.totalTickets || 0;
  const ticketsSoldToday = todayAgg[0]?.ticketsSoldToday || 0;
  const totalBookingsToday = todayAgg[0]?.totalBookingsToday || 0;
  const totalSeats = seatAgg[0]?.totalSeats || 0;

  const occupancyRate =
    totalSeats > 0 ? Number(((totalTickets / totalSeats) * 100).toFixed(1)) : 0;

  return {
    totalRevenue,
    totalTickets,
    occupancyRate,
    ticketsSoldToday,
    totalBookingsToday,
    topMovie: topMovieAgg[0]
      ? {
          movieId: topMovieAgg[0]._id,
          soldTickets: topMovieAgg[0].soldTickets,
        }
      : null,
  };
};

const getHourlyTraffic = async (filters: OverviewFilters) => {
  const { cinemaId, fromDate, toDate } = filters;
  const showTimeIds = await getShowTimeIdsByCinema(cinemaId);

  if (!showTimeIds.length) return [];

  const match: any = {
    showTimeId: { $in: showTimeIds },
    status: "paid",
  };

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) match.createdAt.$lte = new Date(toDate);
  }

  return Booking.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%H:00",
            date: "$createdAt",
          },
        },
        tickets: {
          $sum: { $size: "$seats" },
        },
      },
    },
    {
      $project: {
        _id: 0,
        hour: "$_id",
        tickets: 1,
      },
    },
    {
      $sort: { hour: 1 },
    },
  ]);
};

const getRecentActivities = async (filters: OverviewFilters) => {
  const { cinemaId, fromDate, toDate } = filters;
  const showTimeIds = await getShowTimeIdsByCinema(cinemaId);

  if (!showTimeIds.length) return [];

  const match: any = {
    showTimeId: { $in: showTimeIds },
  };

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) match.createdAt.$lte = new Date(toDate);
  }

  return Booking.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
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
        path: "$userInfo",
        preserveNullAndEmptyArrays: true,
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
      $project: {
        _id: 1,
        userName: "$userInfo.ho_ten",
        userEmail: "$userInfo.email",
        showTimeId: 1,
        movieId: "$showTimeInfo.movieId",
        roomName: "$roomInfo.ten_phong",
        ticketCount: { $size: "$seats" },
        finalAmount: 1,
        status: 1,
        paymentMethod: 1,
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: 8,
    },
  ]);
};

const getHallPerformance = async (filters: OverviewFilters) => {
  const { cinemaId, fromDate, toDate } = filters;
  const roomIds = await getCinemaRoomIds(cinemaId);

  if (!roomIds.length) return [];

  const rooms = await Room.find({
    _id: { $in: roomIds },
  }).lean();

  const roomMap = new Map(
    rooms.map((room: any) => [
      String(room._id),
      {
        roomId: room._id,
        roomName: room.ten_phong,
        roomType: room.loai_phong,
        capacity: getRoomCapacity(room),
      },
    ])
  );

  const showTimes = await ShowTimeM.find({
    roomId: { $in: roomIds },
    ...(fromDate || toDate
      ? {
          startTime: {
            ...(fromDate ? { $gte: new Date(fromDate) } : {}),
            ...(toDate ? { $lte: new Date(toDate) } : {}),
          },
        }
      : {}),
  }).lean();

  if (!showTimes.length) return [];

  const showTimeIds = showTimes.map((showTime: any) => showTime._id);

  const soldByShowTime = await Booking.aggregate([
    {
      $match: {
        showTimeId: { $in: showTimeIds },
        status: "paid",
      },
    },
    {
      $group: {
        _id: "$showTimeId",
        soldTickets: { $sum: { $size: "$seats" } },
      },
    },
  ]);

  const soldMap = new Map(
    soldByShowTime.map((item: any) => [String(item._id), item.soldTickets])
  );

  const groupedByRoom = new Map<string, any>();

  for (const showTime of showTimes as any[]) {
    const roomKey = String(showTime.roomId);
    const roomInfo = roomMap.get(roomKey);

    if (!roomInfo) continue;

    const soldTickets = soldMap.get(String(showTime._id)) || 0;

    if (!groupedByRoom.has(roomKey)) {
      groupedByRoom.set(roomKey, {
        roomId: roomInfo.roomId,
        roomName: roomInfo.roomName,
        roomType: roomInfo.roomType,
        capacity: roomInfo.capacity,
        soldTickets: 0,
        showTimeCount: 0,
        movieId: showTime.movieId,
      });
    }

    const current = groupedByRoom.get(roomKey);
    current.soldTickets += soldTickets;
    current.showTimeCount += 1;
  }

  return Array.from(groupedByRoom.values()).map((item: any) => {
    const totalCapacity = item.capacity * item.showTimeCount;
    const occupancyRate =
      totalCapacity > 0
        ? Number(((item.soldTickets / totalCapacity) * 100).toFixed(1))
        : 0;

    return {
      ...item,
      occupancyRate,
      status: mapOccupancyStatus(occupancyRate),
    };
  });
};

export const analyticsCinemasService = {
  async getAllCinemas(filters: Filters) {
    const bookingMatch = {
      ...buildDateMatch(filters.fromDate, filters.toDate),
      status: "paid",
    };

    const seatMap = await getSeatCountByShowTime();

    const bookings = await Booking.aggregate([
      {
        $match: bookingMatch,
      },
      {
        $lookup: {
          from: "showtimes",
          localField: "showTimeId",
          foreignField: "_id",
          as: "showTimeInfo",
        },
      },
      {
        $unwind: "$showTimeInfo",
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
        $unwind: "$roomInfo",
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
        $unwind: "$cinemaInfo",
      },
      {
        $group: {
          _id: "$cinemaInfo._id",
          cinemaName: { $first: "$cinemaInfo.name" },
          city: { $first: "$cinemaInfo.city" },
          address: { $first: "$cinemaInfo.address" },
          totalRevenue: { $sum: "$finalAmount" },
          totalTickets: { $sum: { $size: "$seats" } },
          totalBookings: { $sum: 1 },
          roomIds: { $addToSet: "$roomInfo._id" },
          showTimeIds: { $addToSet: "$showTimeInfo._id" },
        },
      },
      {
        $project: {
          _id: 0,
          cinemaId: "$_id",
          cinemaName: 1,
          city: 1,
          address: 1,
          totalRevenue: 1,
          totalTickets: 1,
          totalBookings: 1,
          roomCount: { $size: "$roomIds" },
          showTimeIds: 1,
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ]);

    const items = bookings.map((item: any) => {
      const totalSeats = (item.showTimeIds || []).reduce(
        (sum: number, showTimeId: any) =>
          sum + (seatMap.get(String(showTimeId)) || 0),
        0
      );

      const occupancyRate =
        totalSeats > 0
          ? Number(((item.totalTickets / totalSeats) * 100).toFixed(1))
          : 0;

      return {
        cinemaId: item.cinemaId,
        cinemaName: item.cinemaName,
        city: item.city,
        address: item.address,
        totalRevenue: item.totalRevenue,
        totalTickets: item.totalTickets,
        totalBookings: item.totalBookings,
        roomCount: item.roomCount,
        occupancyRate,
      };
    });

    const summary = items.reduce(
      (acc: any, item: any) => {
        acc.totalRevenue += item.totalRevenue || 0;
        acc.totalTickets += item.totalTickets || 0;
        acc.totalBookings += item.totalBookings || 0;
        acc.totalRooms += item.roomCount || 0;
        return acc;
      },
      {
        totalRevenue: 0,
        totalTickets: 0,
        totalBookings: 0,
        totalRooms: 0,
      }
    );

    const avgOccupancyRate =
      items.length > 0
        ? Number(
            (
              items.reduce(
                (sum: number, item: any) => sum + (item.occupancyRate || 0),
                0
              ) / items.length
            ).toFixed(1)
          )
        : 0;

    const topCinema = items.length > 0 ? items[0] : null;

    return {
      summary: {
        totalCinemas: items.length,
        totalRevenue: summary.totalRevenue,
        totalTickets: summary.totalTickets,
        totalBookings: summary.totalBookings,
        totalRooms: summary.totalRooms,
        avgOccupancyRate,
        topCinema: topCinema
          ? {
              cinemaId: topCinema.cinemaId,
              cinemaName: topCinema.cinemaName,
              totalRevenue: topCinema.totalRevenue,
            }
          : null,
      },
      items,
    };
  },

  async getOverview(filters: OverviewFilters) {
    const [cinemaInfo, summary, hourlyTraffic, recentActivities, hallPerformance] =
      await Promise.all([
        getCinemaBasicInfo(filters.cinemaId),
        getCinemaOverview(filters),
        getHourlyTraffic(filters),
        getRecentActivities(filters),
        getHallPerformance(filters),
      ]);

    return {
      cinemaInfo: cinemaInfo
        ? {
            cinemaId: cinemaInfo._id,
            cinemaName: cinemaInfo.name,
            address: cinemaInfo.address,
            city: cinemaInfo.city,
          }
        : null,
      summary,
      hourlyTraffic,
      recentActivities,
      hallPerformance,
    };
  },

  async getCinemaOptions() {
    const cinemas = await Cinemas.find({})
      .select("_id name city address")
      .sort({ name: 1 })
      .lean();

    return cinemas.map((item: any) => ({
      cinemaId: item._id,
      cinemaName: item.name,
      city: item.city,
      address: item.address,
    }));
  },
};