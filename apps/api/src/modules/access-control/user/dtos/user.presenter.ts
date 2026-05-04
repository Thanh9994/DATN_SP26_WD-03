import { IUser } from '@shared/src/schemas';

export class UserPresenter {
  static toAdminList(user: any) {
    return {
      _id: user._id,
      id: user._id,
      ho_ten: user.ho_ten,
      email: user.email,
      phone: user.phone,
      role: user.role,
      trang_thai: user.trang_thai,
      workAt: user.workAt,
      bookingCount: user.bookingCount || 0,
      createdAt: user.createdAt,
    };
  }

  static toProfile(user: IUser) {
    return {
      id: user._id,
      ho_ten: user.ho_ten,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    };
  }
}
