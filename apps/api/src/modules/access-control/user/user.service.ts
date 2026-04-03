import { NotFoundError } from '@api/middlewares/error.middleware';
import { User } from './user.model';
import { IUpdateUser } from '@shared/src/schemas';

export const findAllUsersWithStats = async () => {
  // Lưu ý: Dùng đúng tên collection 'bookings' từ DB
  return await User.aggregate([
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'userId',
        pipeline: [
          { $match: { status: 'paid' } }, // Lọc ngay trong lúc lookup
          { $project: { _id: 1 } }, // Chỉ lấy ID cho nhẹ
        ],
        as: 'paidBookings',
      },
    },
    {
      $addFields: {
        bookingCount: { $size: '$paidBookings' },
      },
    },
    { $project: { paidBookings: 0, password: 0 } }, // Ẩn password và mảng tạm
    { $sort: { createdAt: -1 } },
  ]);
};

export const updateUserInfo = async (id: string, data: IUpdateUser) => {
  const updatedUser = await User.findByIdAndUpdate(id, { $set: data }, { new: true }).select(
    '-password',
  );

  if (!updatedUser) {
    throw new NotFoundError('Không tìm thấy người dùng để cập nhật');
  }
  return updatedUser;
};
