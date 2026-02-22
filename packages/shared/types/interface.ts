// export type RoomType = '2D' | '3D' | 'IMAX' | '4DX';
// export type SeatType = 'thuong' | 'vip' | 'couple';
// export type MovieStatus = 'sap_chieu' | 'dang_chieu' | 'ngung_chieu';
// export type AgeRating = 'P' | 'C13' | 'C16' | 'C18';
// export type UserRole = 'admin' | 'nhan_vien' | 'khach_hang';
// export type UserStatus = 'active' | 'inactive' | 'banned';

// export interface ICloudinaryImage {
//   public_id: string;
//   url: string;
// }

// export interface IGenre {
//   name: string;
// }

// export interface IPhong {
//   ten_phong: string;
//   loai_phong: RoomType;
//   ghe: ISeats[];
// }

// export interface ISeats {
//   hang_ghe: string;
//   so_ghe: number;
//   loai_ghe: SeatType;
// }

// export interface IBase {
//   _id?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface ICinema extends IBase {
//   name: string;
//   address: string;
//   city: string;
//   phong_chieu: IPhong[];
// }

// export interface IUploadParams {
//   file: any;
//   customName: string;
// }

// export interface IMovie extends IBase {
//   ten_phim: string;
//   mo_ta: string;
//   thoi_luong: number;

//   ngay_cong_chieu: Date;
//   ngay_ket_thuc: Date;

//   poster: ICloudinaryImage;
//   trailer: string;
//   danh_gia: number;
//   trang_thai: MovieStatus;

//   the_loai: IGenre[];
//   rap_chieu?: ICinema[];

//   quoc_gia: string;
//   dao_dien: string;
//   dien_vien: string[];
//   do_tuoi: AgeRating;
//   ngon_ngu: string;
//   phu_de: string[];
// }

// export interface ISnackDrink extends IBase {
//   name: string;
//   price: number;
//   image: ICloudinaryImage;
// }

// export interface IUser extends IBase {
//   ho_ten: string;
//   email: string;
//   password: string;
//   phone?: string;
//   role: UserRole;
//   trang_thai: UserStatus;
// }

// export interface IUserLog {
//   ho_ten?: string;
//   phone?: string;
//   role?: UserRole
//   trang_thai?: UserStatus;
// }