import mongoose from 'mongoose';
import { Booking } from '@api/modules/sales-operations/booking/booking.model';

type GetAdminTicketsQuery = {
  keyword?: string;
  status?: string;
  cinemaId?: string;
  date?: string;
  page?: number;
  limit?: number;
};

const isValidObjectId = (value?: string) => {
  return !!value && mongoose.Types.ObjectId.isValid(value);
};

export const ticketService = {
  async getAdminTickets(query: GetAdminTicketsQuery) {
    const {
      keyword = '',
      status,
      cinemaId,
      date,
      page = 1,
      limit = 10,
    } = query;

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'showtimes',
          localField: 'showTimeId',
          foreignField: '_id',
          as: 'showtime',
        },
      },
      {
        $unwind: {
          path: '$showtime',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'showtime.movieId',
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
        $lookup: {
          from: 'rooms',
          localField: 'showtime.roomId',
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
          localField: 'room.cinema_id',
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
    ];

    const matchStage: Record<string, any> = {};

    if (keyword?.trim()) {
      matchStage.$or = [
        { ticketCode: { $regex: keyword.trim(), $options: 'i' } },
        { 'user.ho_ten': { $regex: keyword.trim(), $options: 'i' } },
        { 'user.email': { $regex: keyword.trim(), $options: 'i' } },
        { 'movie.ten_phim': { $regex: keyword.trim(), $options: 'i' } },
      ];
    }

    if (status?.trim()) {
      matchStage.status = status.trim();
    }

    if (isValidObjectId(cinemaId)) {
      matchStage['cinema._id'] = new mongoose.Types.ObjectId(cinemaId);
    }

    if (date?.trim()) {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(`${date}T23:59:59.999Z`);

      matchStage['showtime.startTime'] = {
        $gte: start,
        $lte: end,
      };
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        $project: {
          _id: 1,
          ticketCode: 1,
          status: 1,
          paymentMethod: 1,
          totalAmount: '$finalAmount',
          finalAmount: 1,
          discountAmount: 1,
          createdAt: 1,
          pickedUpAt: 1,
          seatCodes: 1,
          items: 1,
          customer: {
            _id: '$user._id',
            ho_ten: '$user.ho_ten',
            email: '$user.email',
            phone: '$user.phone',
          },
          movie: {
            _id: '$movie._id',
            ten_phim: '$movie.ten_phim',
            poster: '$movie.poster',
            thoi_luong: '$movie.thoi_luong',
          },
          cinema: {
            _id: '$cinema._id',
            name: '$cinema.name',
            city: '$cinema.city',
            address: '$cinema.address',
          },
          room: {
            _id: '$room._id',
            ten_phong: '$room.ten_phong',
            loai_phong: '$room.loai_phong',
          },
          showtime: {
            _id: '$showtime._id',
            startTime: '$showtime.startTime',
            endTime: '$showtime.endTime',
            status: '$showtime.status',
          },
        },
      },
      { $sort: { createdAt: -1 } }
    );

    const countPipeline = [...pipeline, { $count: 'total' }];
    const listPipeline = [
      ...pipeline,
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) },
    ];

    const [countResult, tickets] = await Promise.all([
      Booking.aggregate(countPipeline),
      Booking.aggregate(listPipeline),
    ]);

    const total = countResult[0]?.total || 0;

    return {
      tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  },

  async getAdminTicketDetail(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID vé không hợp lệ');
    }

    const pipeline: any[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'showtimes',
          localField: 'showTimeId',
          foreignField: '_id',
          as: 'showtime',
        },
      },
      {
        $unwind: {
          path: '$showtime',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'showtime.movieId',
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
        $lookup: {
          from: 'rooms',
          localField: 'showtime.roomId',
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
          localField: 'room.cinema_id',
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
          _id: 1,
          ticketCode: 1,
          status: 1,
          paymentMethod: 1,
          totalAmount: 1,
          finalAmount: 1,
          discountAmount: 1,
          createdAt: 1,
          updatedAt: 1,
          pickedUpAt: 1,
          seatCodes: 1,
          items: 1,
          customer: {
            _id: '$user._id',
            ho_ten: '$user.ho_ten',
            email: '$user.email',
            phone: '$user.phone',
          },
          movie: {
            _id: '$movie._id',
            ten_phim: '$movie.ten_phim',
            poster: '$movie.poster',
            thoi_luong: '$movie.thoi_luong',
            do_tuoi: '$movie.do_tuoi',
          },
          cinema: {
            _id: '$cinema._id',
            name: '$cinema.name',
            city: '$cinema.city',
            address: '$cinema.address',
          },
          room: {
            _id: '$room._id',
            ten_phong: '$room.ten_phong',
            loai_phong: '$room.loai_phong',
          },
          showtime: {
            _id: '$showtime._id',
            startTime: '$showtime.startTime',
            endTime: '$showtime.endTime',
            status: '$showtime.status',
          },
        },
      },
    ];

    const result = await Booking.aggregate(pipeline);
    return result[0] || null;
  },
};