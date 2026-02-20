export interface IPhong {
  ten_phong: string;
  loai_phong: '2D' | '3D' | 'IMAX' | '4DX';
  ghe: ISeats[];
}
export interface ISeats {
  hang_ghe: string;
  so_ghe: number;
  loai_ghe: 'thuong' | 'vip' | 'couple';
}
export interface ICinema {
  name: string;
  address: string;
  city: string;
  phong_chieu: IPhong[];
}

export interface IGenre {
  name: string;
}

export interface ICloudinaryImage {
  public_id: string;
  url: string;
}

export interface IUploadParams {
  file: File;
  customName: string;
}

export interface IMovie {
  ten_phim: string;
  mo_ta: string;
  thoi_luong: number;

  ngay_cong_chieu: Date;
  ngay_ket_thuc: Date;

  poster: ICloudinaryImage;
  trailer: string;
  danh_gia: number;
  trang_thai: 'sap_chieu' | 'dang_chieu' | 'ngung_chieu';
  
  the_loai: IGenre[];
  rap_chieu?: ICinema[];
}