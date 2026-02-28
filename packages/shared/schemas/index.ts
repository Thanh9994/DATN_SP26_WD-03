import { z } from "zod";

export const RoomType = z.enum(["2D", "3D", "IMAX", "4DX"]);
export const SeatType = z.enum(["normal", "vip", "couple"]);
export const MovieStatus = z.enum(["sap_chieu", "dang_chieu", "ngung_chieu"]);
export const AgeRating = z.enum(["P", "C13", "C16", "C18"]);
export const UserRole = z.enum(["admin", "nhan_vien", "khach_hang"]);
export const UserStatus = z.enum(["active", "inactive", "banned"]);
export const SeatsStatus = z.enum(["empty", "booked", "hold", "fix"]); // "trống", Đã đặt, giữ ghế, sửa ghế
export const BookingStatus = z.enum([
  "pending", //Chờ thanh toán
  "paid", //Đã thanh toán
  "cancelled", //Đã hủy
  "expired", //Hết hạn thanh toán
]);

export const Base = z.object({
  _id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CloudinaryImage = z.object({
  public_id: z.string(),
  url: z.string().url("Định dạng ảnh không hợp lệ"),
  customName: z.string().optional(),
});

export const UploadParams = z.object({
  file: z.any(),
  customName: z.string(),
});

export const Genre = z.object({
  name: z.string().min(1, "Tên thể loại không được để trống"),
});

export const Seats = z.object({
  hang_ghe: z.string(),
  so_ghe: z.number(),
  loai_ghe: SeatType,
  trang_thai: SeatsStatus.default("empty"),
  seatCode: z.string(),
});

export const ShowTime = Base.extend({
  movieId: z.union([z.string(), z.any()]),
  roomId: z.union([z.string(), z.any()]),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  priceNormal: z.number().nonnegative(),
  priceVip: z.number().nonnegative(),
  priceCouple: z.number().nonnegative(),
}).refine((data) => data.endTime > data.startTime, {
  message: " endTime lớn hơn startTime",
  path: ["endTime"],
});

export const ShowTimeSeat = Base.extend({
  showTimeId: z.union([z.string(), z.any()]),
  bookingId: z.union([z.string(), z.any()]),
  ten_phong: z.string(),
  seatCode: z.string(),
  row: z.string(),
  number: z.number(),
  loai_ghe: SeatType,
  price: z.number(),
  trang_thai: SeatsStatus.default("empty"),
  heldBy: z.string().nullable().optional(),
  holdExpiresAt: z.coerce.date().nullable().optional(),
});

export const Room = Base.extend({
  cinema_id: z.string(),
  ten_phong: z.string().min(1, "Tên phòng là bắt buộc"),
  loai_phong: RoomType,
  rows: z.array(
    z.object({
      name: z.string(), // A, B, C...
      seats: z.number().positive(), // số ghế của row đó
      type: SeatType.default("normal")
    })
  ),
  vip: z.array(z.string()).default([]),
  couple: z.array(z.string()).default([])
});

export const RoomCreate = z.object({
  ten_phong: z.string().min(1, "Tên phòng là bắt buộc"),
  loai_phong: RoomType,
  rows: z.array(
    z.object({
      name: z.string(), // A, B, C...
      seats: z.number().positive(), // số ghế của row đó
    })
  ),
  vip: z.array(z.string()).default([]),
  couple: z.array(z.string()).default([])
});

export const RoomFormSchema = RoomCreate.extend({
  vip: z.string().or(z.array(z.string())), // Chấp nhận cả 2 ở Form
  couple: z.string().or(z.array(z.string())),
}).transform((data) => ({
  ...data,
  vip: typeof data.vip === "string" ? data.vip.split(",").map(s => s.trim().toUpperCase()).filter(Boolean) : data.vip,
  couple: typeof data.couple === "string" ? data.couple.split(",").map(s => s.trim().toUpperCase()).filter(Boolean) : data.couple,
}));

export const Row = z.object({
  name: z.string(),
  seats: z.number(),
  type: SeatType,
});

export const Booking = Base.extend({
  userId: z.string(),
  showTimeId: z.string(),
  seats: z.array(z.string()).min(1, "Phải chọn ít nhất 1 ghế"), // ["A1","A2"]
  totalAmount: z.number(),
  status: BookingStatus.default("pending"),
  paymentId: z.string().optional(),
  expiresAt: z.coerce.date().optional(),
});

export const CreateCinema = z.object({
  name: z.string().min(1, "Tên rạp không được để trống"),
  address: z.string(),
  city: z.string(),
  // phong_chieu: z.array(CreateRoom),
});

export const Cinema = Base.extend({
  name: z.string().min(1, "Tên rạp không được để trống"),
  address: z.string(),
  city: z.string(),
  danh_sach_phong: z.array(Room),
});

export const Movie = Base.extend({
  ten_phim: z.string().min(1, "Tên phim là bắt buộc"),
  mo_ta: z.string(),
  thoi_luong: z.number().positive(),
  ngay_cong_chieu: z.coerce.date(),
  ngay_ket_thuc: z.coerce.date(),
  poster: CloudinaryImage,
  trailer: z.string().url().optional(),
  danh_gia: z.number().min(0).max(10).default(0),
  trang_thai: MovieStatus,
  the_loai: z.array(
    z.object({
      _id: z.string().optional(),
      name: z.string(),
    }),
  ),
  rap_chieu: z.array(z.string()).optional(),
  quoc_gia: z.string(),
  dao_dien: z.string(),
  dien_vien: z.array(z.string()),
  do_tuoi: AgeRating.default("P"),
  ngon_ngu: z.string(),
  phu_de: z.array(z.string()),
});

export const SnackDrink = Base.extend({
  name: z.string(),
  price: z.number().nonnegative("Giá không được là số âm"),
  image: CloudinaryImage,
});

export const User = Base.extend({
  ho_ten: z.string().min(2),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  phone: z
    .string()
    .regex(/^(03|05|07|08|09)\d{8}$/, "Số điện thoại không hợp lệ"),
  avatar: CloudinaryImage.optional(),
  role: UserRole.default("khach_hang"),
  trang_thai: UserStatus.default("active"),
});

export const UpdateUser = z.object({
  role: UserRole.optional(),
  trang_thai: UserStatus.optional(),
});
export const UserLog = User.pick({
  ho_ten: true,
  phone: true,
  role: true,
  trang_thai: true,
}).partial();

export const LoginPayload = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterPayload = z.object({
  ho_ten: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z
    .string()
    .regex(/^(03|05|07|08|09)\d{8}$/, "Số điện thoại không hợp lệ"),
});

export const AuthResponse = z.object({
  user: User,
  token: z.string(),
});

export type IRoomType = z.infer<typeof RoomType>;
export type ISeatType = z.infer<typeof SeatType>;
export type IMovieStatus = z.infer<typeof MovieStatus>;
export type IAgeRating = z.infer<typeof AgeRating>;
export type IUserRole = z.infer<typeof UserRole>;
export type IUserStatus = z.infer<typeof UserStatus>;
export type ISeatsStatus = z.infer<typeof SeatsStatus>;

export type ICloudinaryImage = z.infer<typeof CloudinaryImage>;
export type IUploadParams = z.infer<typeof UploadParams>;

export type IGenre = z.infer<typeof Genre>;
export type IMovie = z.infer<typeof Movie>;
export type IUpdateMovie = Partial<ICreateMovie>;
export type ICreateMovie = Omit<IMovie, "_id" | "createdAt" | "updatedAt">;
// export type ICinemaForm = Omit<ICinema, "danh_sach_phong" | "createdAt" | "updatedAt">;

export type IUser = z.infer<typeof User>;
export type IUserLog = z.infer<typeof UserLog>;
export type IUpdateUser = z.infer<typeof UpdateUser>;
export type ILoginPayload = z.infer<typeof LoginPayload>;
export type IRegisterPayload = z.infer<typeof RegisterPayload>;
export type IAuthResponse = z.infer<typeof AuthResponse>;

export type ICinema = z.infer<typeof Cinema>;
export type ICreateCinema = z.infer<typeof CreateCinema>;

export type ISeats = z.infer<typeof Seats>;
export type IRow = z.infer<typeof Row>;
export type IPhong = z.infer<typeof Room>;
export type IPhongCreate = z.infer<typeof RoomCreate>;

export type IShowTime = z.infer<typeof ShowTime>;
export type IShowTimeSeat = z.infer<typeof ShowTimeSeat>;
export type ISnackDrink = z.infer<typeof SnackDrink>;

// .optional(): Trường này có thể có hoặc không (tương đương với dấu ? trong Interface).
//
