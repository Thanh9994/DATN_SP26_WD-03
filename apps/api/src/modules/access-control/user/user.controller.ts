import { catchAsync } from '@api/utils/catchAsync';
import { Request, Response } from 'express';
import { User } from './user.model';
import { UpdateUser } from '@shared/src/schemas';
import { UserPresenter } from './dtos/user.presenter';
import { AppError, NotFoundError } from '@api/middlewares/error.middleware';
import { findAllUsersWithStats, updateUserInfo } from './user.service';

export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await findAllUsersWithStats();
  const formattedUsers = users.map(UserPresenter.toAdminList);
  res.status(200).json(formattedUsers);
});

export const me = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('User không tồn tại', 404);
  res.json(UserPresenter.toProfile(req.user));
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = UpdateUser.parse(req.body);
  const updatedUser = await updateUserInfo(id, validatedData);
  res.status(200).json(UserPresenter.toProfile(updatedUser));
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng để xóa');
  }
  res.status(200).json({ message: 'Xóa Thành Công' });
});
