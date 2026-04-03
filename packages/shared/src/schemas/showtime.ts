import { z } from 'zod';
import { SeatType, SeatsStatus, ShowTimeStatus } from './enums';
import { Base } from './core';

export const ShowTime = Base.extend({
  movieId: z.union([z.string(), z.any()]),
  roomId: z.union([z.string(), z.any()]),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  showDate: z.coerce.date(),
  priceNormal: z.number().nonnegative(),
  priceVip: z.number().nonnegative(),
  priceCouple: z.number().nonnegative(),
  status: ShowTimeStatus.default('upcoming'),
}).refine((data) => data.endTime > data.startTime, {
  message: ' endTime l?n hon startTime',
  path: ['endTime'],
});

export const ShowTimeSeat = Base.extend({
  showTimeId: z.union([z.string(), z.any()]),
  bookingId: z.union([z.string(), z.any()]).nullable().optional(),
  ten_phong: z.string(),
  seatCode: z.string(),
  row: z.string(),
  number: z.number(),
  seatType: SeatType,
  price: z.number(),
  trang_thai: SeatsStatus.default('empty'),
  heldBy: z.string().nullable().optional(),
  holdExpiresAt: z.coerce.date().nullable().optional(),
});
