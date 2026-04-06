import { z } from 'zod';
import { RoomType, SeatType, SeatsStatus } from './enums';
import { Base } from './core';

export const Seats = z.object({
  hang_ghe: z.string(),
  so_ghe: z.number(),
  loai_ghe: SeatType,
  trang_thai: SeatsStatus.default('empty'),
  seatCode: z.string(),
});

export const Room = Base.extend({
  cinema_id: z.string(),
  ten_phong: z.string().min(1, 'Tên phòng là bắt buộc'),
  loai_phong: RoomType,
  rows: z.array(
    z.object({
      name: z.string(), // A, B, C...
      seats: z.number().positive(), // s? gh? c?a row d�
      type: SeatType.default('normal'),
    }),
  ),
  vip: z.array(z.string()).default([]),
  couple: z.array(z.string()).default([]),
});

export const RoomWeb = Base.extend({
  cinema_id: z.array(
    z.object({
      _id: z.string().optional(),
      name: z.string(),
      city: z.string().optional(),
    }),
  ),
  ten_phong: z.string().min(1, 'Tên phòng là bắt buộc'),
  loai_phong: RoomType,
  rows: z.array(
    z.object({
      name: z.string(), // A, B, C...
      seats: z.number().positive(), // s? gh? c?a row d�
      type: SeatType.default('normal'),
    }),
  ),
  vip: z.array(z.string()).default([]),
  couple: z.array(z.string()).default([]),
});

export const RoomCreate = z.object({
  ten_phong: z.string().min(1, 'Tên phòng là bắt buộc'),
  loai_phong: RoomType,
  rows: z.array(
    z.object({
      name: z.string(), // A, B, C...
      seats: z.number().positive(), // s? gh? c?a row d�
    }),
  ),
  vip: z.array(z.string()).default([]),
  couple: z.array(z.string()).default([]),
});

export const RoomFormSchema = RoomCreate.extend({
  vip: z.string().or(z.array(z.string())), // Ch?p nh?n c? 2 ? Form
  couple: z.string().or(z.array(z.string())),
}).transform((data) => ({
  ...data,
  vip:
    typeof data.vip === 'string'
      ? data.vip
          .split(',')
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean)
      : data.vip,
  couple:
    typeof data.couple === 'string'
      ? data.couple
          .split(',')
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean)
      : data.couple,
}));

export const Row = z.object({
  name: z.string(),
  seats: z.number(),
  type: SeatType,
});
