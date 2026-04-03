import { z } from 'zod';
import { Base } from './core';

export const CreateCinema = z.object({
  name: z.string().min(1, 'Tên rạp không được để trống'),
  address: z.string(),
  city: z.string(),
  // phong_chieu: z.array(CreateRoom),
});
export const CinemaWeb = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Tên rạp không được để trống'),
  address: z.string().optional(),
  city: z.string(),
  // phong_chieu: z.array(CreateRoom),
});
export const Cinema = Base.extend({
  name: z.string().min(1, 'Tên rạp không được để trống'),
  address: z.string(),
  city: z.string(),
  danh_sach_phong: z.array(z.union([z.string(), z.any()])),
});
