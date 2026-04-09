import { z } from 'zod';

export const RoomType = z.enum(['2D', '3D', 'IMAX', '4DX']);
export const SeatType = z.enum(['normal', 'vip', 'couple']);
export const MovieStatus = z.enum(['sap_chieu', 'dang_chieu', 'ngung_chieu']);
export const AgeRating = z.enum(['P', 'C13', 'C16', 'C18']);
export const UserRole = z.enum(['admin', 'manager', 'staff', 'khach_hang']);
export const UserStatus = z.enum(['active', 'inactive', 'banned']);
export const SeatsStatus = z.enum(['empty', 'booked', 'hold', 'fix']);
export const BookingStatus = z.enum([
  'pending',
  'paid',
  'da_lay_ve',
  'cancelled',
  'expired',
  'picked_up',
  'refunded',
]);
export const PaymentStatus = z.enum(['pending', 'paying', 'success', 'failed']);
export const ShowTimeStatus = z.enum(['upcoming', 'ongoing', 'finished', 'sold_out', 'cancelled']);
export const PaymentMethod = z.enum(['vnpay', 'momo', 'atm', 'cash']);
