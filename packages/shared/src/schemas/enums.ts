import { z } from 'zod';

export const RoomType = z.enum(['2D', '3D', 'IMAX', '4DX']);
export const SeatType = z.enum(['normal', 'vip', 'couple']);
export const MovieStatus = z.enum(['sap_chieu', 'dang_chieu', 'ngung_chieu']);
export const AgeRating = z.enum(['P', 'C13', 'C16', 'C18']);
export const UserRole = z.enum(['admin', 'manager', 'staff', 'khach_hang']);
export const UserStatus = z.enum(['active', 'inactive', 'banned']);
export const SeatsStatus = z.enum(['empty', 'booked', 'hold', 'fix']); // "trống", Đã đặt, giuwx ghế, sửa ghế
export const BookingStatus = z.enum([
  'pending', //Chờ thanh toán
  'paid', // thanh toán
  'cancelled', //hủy
  'expired', //Hết hạn thanh toán trạng thái
  'picked_up', // Đã lấy vé (Khách đã nhận vé tại quầy/máy)
  'refunded', // Hoàn tiền (Nếu cần thêm sau này)
]);
export const PaymentStatus = z.enum(['pending', 'paying', 'success', 'failed']);
export const ShowTimeStatus = z.enum([
  'upcoming', //Sắp chiếu
  'ongoing', //Đang chiếu
  'finished', //Kết thúc
  'sold_out', //Hết vé
  'cancelled', //Đã hủy
]);
export const PaymentMethod = z.enum(['vnpay', 'momo', 'atm', 'cash']);
