import { z } from 'zod';
import { AgeRating, MovieStatus } from './enums';
import { Base, CloudinaryImage } from './core';

export const Genre = z.object({
  name: z.string().min(1, 'Tên thể loại không được để trống'),
});

export const Movie = Base.extend({
  ten_phim: z.string().min(1, 'Tên phim là bắt buộc'),
  mo_ta: z.string(),
  thoi_luong: z.number().positive(),
  ngay_cong_chieu: z.coerce.date(),
  ngay_ket_thuc: z.coerce.date(),
  poster: CloudinaryImage,
  banner: CloudinaryImage,
  trailer: z.string().url().optional(),
  rateting: z.number().min(0).max(5).default(0),
  danh_gia: z.number().min(0).max(10).default(0),
  trang_thai: MovieStatus,
  the_loai: z.array(
    z.object({
      _id: z.string().optional(),
      name: z.string(),
    }),
  ),
  quoc_gia: z.string(),
  dao_dien: z.string(),
  dien_vien: z.array(z.string()),
  do_tuoi: AgeRating.default('P'),
  ngon_ngu: z.string(),
  phu_de: z.array(z.string()),
});
