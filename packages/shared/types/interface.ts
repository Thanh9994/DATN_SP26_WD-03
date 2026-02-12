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