import { z } from "zod";

export const RoomType = z.enum(["2D", "3D", "IMAX", "4DX"]);
export const SeatType = z.enum(["thuong", "vip", "couple"]);
export const MovieStatus = z.enum(["sap_chieu", "dang_chieu", "ngung_chieu"]);
export const AgeRating = z.enum(["P", "C13", "C16", "C18"]);
export const UserRole = z.enum(["admin", "nhan_vien", "khach_hang"]);
export const UserStatus = z.enum(["active", "inactive", "banned"]);

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
});

export const Room = z.object({
  ten_phong: z.string(),
  loai_phong: RoomType,
  ghe: z.array(Seats),
});

export const Cinema = Base.extend({
  name: z.string().min(1, "Tên rạp không được để trống"),
  address: z.string(),
  city: z.string(),
  phong_chieu: z.array(Room),
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
  the_loai: z.array(z.string()),
  rap_chieu: z.array(Cinema).optional(),
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

export type ICloudinaryImage = z.infer<typeof CloudinaryImage>;
export type IGenre = z.infer<typeof Genre>;
export type ISeats = z.infer<typeof Seats>;
export type IPhong = z.infer<typeof Room>;
export type ICinema = z.infer<typeof Cinema>;
export type IMovie = z.infer<typeof Movie>;
export type ISnackDrink = z.infer<typeof SnackDrink>;
export type IUser = z.infer<typeof User>;
export type IUpdateUser = z.infer<typeof UpdateUser>;
export type IUserLog = z.infer<typeof UserLog>;
export type IUploadParams = z.infer<typeof UploadParams>;

export type ICreateMovie = Omit<IMovie, "_id" | "createdAt" | "updatedAt">;
export type IUpdateMovie = Partial<ICreateMovie>;

export type ILoginPayload = z.infer<typeof LoginPayload>;
export type IRegisterPayload = z.infer<typeof RegisterPayload>;
export type IAuthResponse = z.infer<typeof AuthResponse>;

// .optional(): Trường này có thể có hoặc không (tương đương với dấu ? trong Interface).
//
