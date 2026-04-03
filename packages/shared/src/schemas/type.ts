import { z } from 'zod';
import type {
  AgeRating,
  AuthResponse,
  Booking,
  BookingPayment,
  Cinema,
  CinemaWeb,
  CleanupLog,
  CloudinaryImage,
  CreateCinema,
  Genre,
  Login,
  Movie,
  MovieStatus,
  PaymentStatus,
  Register,
  Room,
  RoomCreate,
  RoomWeb,
  RoomType,
  Row,
  Seats,
  SeatsStatus,
  SeatType,
  ShowTime,
  ShowTimeSeat,
  ShowTimeStatus,
  SnackDrink,
  UpdateUser,
  UploadParams,
  User,
  UserLog,
  UserRole,
  UserStatus,
} from './index';

export type IPopulatedShowTime = Omit<IShowTime, 'roomId' | 'movieId'> & {
  movieId: IMovie;
  roomId: IPopulatedRoom;
};
export type IRoomType = z.infer<typeof RoomType>;
export type ISeatType = z.infer<typeof SeatType>;
export type IMovieStatus = z.infer<typeof MovieStatus>;
export type IAgeRating = z.infer<typeof AgeRating>;
export type IUserRole = z.infer<typeof UserRole>;
export type IUserStatus = z.infer<typeof UserStatus>;
export type ISeatsStatus = z.infer<typeof SeatsStatus>;
export type IShowTimeStatus = z.infer<typeof ShowTimeStatus>;

export type ICloudinaryImage = z.infer<typeof CloudinaryImage>;
export type IUploadParams = z.infer<typeof UploadParams>;

export type IGenre = z.infer<typeof Genre>;
export type IMovie = z.infer<typeof Movie>;
export type IUpdateMovie = Partial<ICreateMovie>;
export type ICreateMovie = Omit<IMovie, '_id' | 'createdAt' | 'updatedAt'>;
export type ISnackDrink = z.infer<typeof SnackDrink>;
// export type ICinemaForm = Omit<ICinema, "danh_sach_phong" | "createdAt" | "updatedAt">;

export type IUser = z.infer<typeof User>;
export type IUserDocument = IUser & {
  _id: string;
};
export type IUserLog = z.infer<typeof UserLog>;
export type IUpdateUser = z.infer<typeof UpdateUser>;
export type ILogin = z.infer<typeof Login>;
export type IRegister = z.infer<typeof Register>;
export type IAuthResponse = z.infer<typeof AuthResponse>;
export type ICleanupLog = z.infer<typeof CleanupLog>;

export type ICinema = z.infer<typeof Cinema>;
export type ICreateCinema = z.infer<typeof CreateCinema>;
export type ICinemaWeb = z.infer<typeof CinemaWeb>;
export type IPopulatedCinema = Omit<ICinema, 'danh_sach_phong'> & {
  danh_sach_phong: IPhong[];
};
export type ICinemaRef = {
  _id?: string;
  name?: string;
  city?: string;
  address?: string;
};

export type ISeats = z.infer<typeof Seats>;
export type IRow = z.infer<typeof Row>;
export type IPhong = z.infer<typeof Room>;
export type IPhongWeb = z.infer<typeof RoomWeb>;
export type IPhongCreate = z.infer<typeof RoomCreate>;

export type IShowTime = z.infer<typeof ShowTime>;
export type IShowTimeApi = Omit<IShowTime, 'startTime' | 'endTime' | 'showDate'> & {
  startTime: string | Date;
  endTime: string | Date;
  showDate?: string | Date;
};
export type IShowTimeSeat = z.infer<typeof ShowTimeSeat>;
export type ICreateShowTimePl = Omit<
  z.infer<typeof ShowTime>,
  '_id' | 'createdAt' | 'updatedAt'
> & {
  movieId: string;
  roomId: string;
};
export type IBooking = z.infer<typeof Booking>;
export type IBookingPayment = z.infer<typeof BookingPayment>;
export type ICreateBooking = Omit<
  IBooking,
  '_id' | 'createdAt' | 'updatedAt' | 'status' | 'ticketCode'
>;

export type IPaymentStatus = z.infer<typeof PaymentStatus>;
export type IPopulatedRoom = Omit<IPhong, 'cinema_id'> & {
  cinema_id: {
    _id: string;
    name: string;
    city: string;
    address: string;
  } | null;
};
export type IPopulatedBooking = Omit<IBooking, 'showTimeId' | 'userId'> & {
  showTimeId: IPopulatedShowTime;
  userId: IUser;
};
