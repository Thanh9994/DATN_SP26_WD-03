import type { Dayjs } from 'dayjs';
import type { ICinemaRef, IMovie, IPhong } from '../schemas';

export type MovieOption = Pick<
  IMovie,
  '_id' | 'ten_phim' | 'thoi_luong' | 'ngay_cong_chieu' | 'ngay_ket_thuc' | 'trang_thai'
>;

export type CinemaOption = {
  value: string;
  label: string;
};

export type AdminRoom = Omit<IPhong, 'cinema_id'> & {
  cinema_id: string | ICinemaRef;
};

export type RoomOption = {
  value: string;
  label: string;
  cinemaId?: string;
};

export type SlotOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SingleCreateValues = {
  movieId?: string;
  roomIds: string[];
  date: Dayjs;
  timeSlots: string[];
  priceNormal: number;
  priceVip: number;
  priceCouple: number;
};

export type RangeCreateValues = {
  movieId?: string;
  roomIds: string[];
  startDate: Dayjs;
  endDate: Dayjs;
  timeSlots: string[];
  priceNormal: number;
  priceVip: number;
  priceCouple: number;
};
